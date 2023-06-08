/* eslint-disable no-console */
import * as fs from 'fs'
import type { FullConfig, FullResult, Reporter, Suite, TestCase } from '@playwright/test/reporter'
import * as XLSX from 'xlsx'

XLSX.set_fs(fs)
const DEFAULT_CONFIG: IExcelConfig = {
  excelInputPath: 'test/asset/unit-test-case.xlsx',
  excelOutputDir: 'excel-reporter-result',
  excelOutputFileName: 'result.xlsx',
  excelStartRow: 0,
  caseSheetName: '블라인드',
  translator: {
    testName: '케이스명',
    ok: '통과여부',
    title: '테스트명',
    fileName: '테스트 그룹명',
  },
}

// https://github.com/cenfun/monocart-reporter
class ExcelReporter implements Reporter {
  suites: Suite[] = []
  INVALID_TYPES = ['fail']
  config: IExcelConfig = DEFAULT_CONFIG

  onBegin(config: FullConfig, suite: Suite) {
    console.log(`\n ExcelReporter Starting the run with ${suite.allTests().length} test`)
    const reporter = config.reporter.find(reporter => reporter[0].includes('excel-reporter'))
    if (!reporter)
      throw new Error('ExcelReporter not found')

    this.config = Object.assign({}, this.config, reporter[1])
    const outputFilePath = `${this.config.excelOutputDir}/${this.config.excelOutputFileName}`
    if (!fs.existsSync(this.config.excelOutputDir))
      fs.mkdirSync(this.config.excelOutputDir)
    if (fs.existsSync(outputFilePath)) {
      fs.unlink(outputFilePath, (err) => {
        if (err)
          throw err // handle your error the way you want to;
        console.log(`${outputFilePath} was deleted`)// or else the file will be deleted
      })
    }
    this.suites.push(suite)
  }

  onEnd(result: FullResult) {
    console.log(`\n ExcelReporter Finished the run: ${result.status}`)
    const excelData: ExcelData = this.translateExcelData(this.parseSuiteList(this.suites))
    const aoa = sheetToAoa(XLSX.utils.json_to_sheet(excelData))
    const wbInfo = readWBook(this.config.excelInputPath)
    if (wbInfo) {
      const targetSheet = wbInfo.getSheetByName(this.config.caseSheetName)
      const targetAoa: any[][] = sheetToAoa(targetSheet)
      const resultAoa = coverArraysByIndex<any[]>(targetAoa, aoa, this.config.excelStartRow)
      wbInfo.workBook.Sheets[this.config.caseSheetName] = XLSX.utils.aoa_to_sheet(resultAoa)
      XLSX.writeFile(wbInfo.workBook, `${this.config.excelOutputDir}/${this.config.excelOutputFileName}`)
    }
    else {
      const worksheet = XLSX.utils.json_to_sheet(excelData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, this.config.caseSheetName)
      XLSX.writeFile(workbook, `${this.config.excelOutputDir}/${this.config.excelOutputFileName}`)
    }
  }

  translateExcelData(data: ExcelData) {
    const t = this.config.translator
    for (let i = 0; i < data.length; i++) {
      const obj = data[i]
      Object.keys(obj).forEach((key) => {
        if (t[key]) {
          obj[t[key]] = obj[key]
          delete obj[key]
        }
      })
    }
    return data
  }

  parseSuiteList(suites: Suite[]) {
    const result: IExcelObj[] = []
    for (let i = 0; i < suites.length; i++) {
      const suite = suites[i]
      const fileName = suite.location ? suite.location.file : ''
      if (suite.suites.length < 1 && suite.tests.length < 1)
        return result
      if (suite.suites.length > 0)
        result.push(...this.parseSuiteList(suite.suites))

      if (suite.tests.length > 0)
        result.push(...this.parseTests(suite.tests, suite.title, fileName))
    }
    return this.mergeSameTests(result)
  }

  parseTests(caseList: TestCase[], title: string, fileName: string) {
    const result: IExcelObj[] = []
    for (let i = 0; i < caseList.length; i++) {
      const testCase = caseList[i]
      const envList = []
      const test = caseList[i]
      const data = { testName: testCase.title, ok: testCase.ok(), title, fileName, env: '' }
      const annotations: { [k: string]: string } = {}
      const project = test.parent.project()
      if (project)
        envList.push(project.name)

      for (let j = 0; j < test.annotations.length; j++) {
        const annotation = test.annotations[j]
        if (this.INVALID_TYPES.includes(annotation.type))
          continue
        if (annotation.type && annotation.description)
          annotations[annotation.type] = annotation.description
      }
      data.env = envList.join(',')
      result.push({ ...annotations, ...data })
    }
    return result
  }

  mergeSameTests(data: ExcelData): ExcelData {
    // merge same test cases
    // 모든 테스트환경(firefox, chrome, native...)은 같은 annotation이 있다 가정하고  merge 되지않습니다.
    return Object.values(data.reduce((acc, cur) => {
      if (acc[cur.testName]) {
        acc[cur.testName].ok = acc[cur.testName].ok === true && cur.ok === true
        acc[cur.testName].env = `${acc[cur.testName].env},${cur.env}`
      }
      else {
        acc[cur.testName] = cur
      }
      return acc
    }, {} as { [testName: string]: IExcelObj }))
  }
}
function readWBook(path = 'wise_life_doctor.xlsx') {
  if (!fs.existsSync(path))
    return null
  const workBook = XLSX.readFile(path)
  const sheetNames = workBook.SheetNames // @details 첫번째 시트 정보 추출
  const getSheetByName = (sheetName: string) => workBook.Sheets[sheetName]
  return {
    workBook,
    sheetNames,
    getSheetByName,
  }
}
export function sheetToAoa(sheet: XLSX.WorkSheet, defval = '') {
  const jsonArr = XLSX.utils.sheet_to_json<any[]>(sheet, {
    header: 1,
    defval,
  })
  return jsonArr
}

function coverArraysByIndex<T>(arr1: T[], arr2: T[], index: number) {
  // 인덱스 기준으로 배열을 분할
  const arr1Part1 = arr1.slice(0, index)
  // 첫 번째 배열의 분할된 부분과 두 번째 배열을 합침
  const mergedArray = arr1Part1.concat(arr2)

  return mergedArray
}

export default ExcelReporter

export interface IExcelObj { [key: string]: any }
export type ExcelData = IExcelObj[]

export interface IExcelConfig {
  excelInputPath: string
  excelOutputDir: string
  excelOutputFileName: string
  caseSheetName: string
  translator: { [key: string]: string }
  excelStartRow: number
}
