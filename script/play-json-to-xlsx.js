/* eslint-disable no-console */
import * as fs from 'fs'
import * as XLSX from 'xlsx'

XLSX.set_fs(fs)
const INVALID_TYPES = ['fail']
const config = readJson('test/excel-config.json')

//  >>> parse input excel file >>>
// const inputWorkbook = XLSX.readFile(config.excelInputPath)
// const inputWorksheet = XLSX.utils.sheet_to_json(inputWorkbook.Sheets[config.caseSheetName])
// const sheetAoa = sheetToAoa(inputWorksheet)
// console.log('\n ===> inputWorkbook: ', Object.keys(inputWorkbook))
// console.log('\n ===> sheetAoa: ', sheetAoa)
//  <<< parse input excel file <<<

// >>> json report to Excel >>>
const jsonReporter = readJson(config.jsonReporterPath)
const suites = jsonReporter.suites
// iterate test files
const result = parseSuiteList(suites)
// translate
const t = config.translator
for (let i = 0; i < result.length; i++) {
  const data = result[i]
  Object.keys(data).forEach((key) => {
    if (t[key]) {
      data[t[key]] = data[key]
      delete data[key]
    }
  })
}
// >>> save to Excel >>>
const worksheet = XLSX.utils.json_to_sheet(result)
const workbook = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(workbook, worksheet, config.caseSheetName)
XLSX.writeFile(workbook, config.excelOutputPath)
// <<< save to Excel <<<

function parseSuiteList(suites) {
  const result = []
  for (let i = 0; i < suites.length; i++) {
    const suite = suites[i]
    // console.log('suite: ', suite)
    const fileName = suite.file
    if (suite.specs.length < 1 && suite.suites.length < 1)
      return result
    if (suite.suites?.length > 0)
      result.push(...parseSuiteList(suite.suites))

    if (suite.specs.length > 0)
      result.push(...parseSpecs(suite.specs, suite.title, fileName))
  }
  return result
}

function parseSpecs(caseList, title, fileName) {
  const result = []
  for (let z = 0; z < caseList.length; z++) {
    const testCase = caseList[z]
    console.log('testCase: ', testCase)
    const envList = []
    const data = { testName: testCase.title, ok: testCase.ok, title, fileName }
    const annotations = {}
    for (let i = 0; i < testCase.tests.length; i++) {
      const test = testCase.tests[i]
      envList.push(test.projectId)
      for (let j = 0; j < test.annotations.length; j++) {
        const annotation = test.annotations[j]
        if (INVALID_TYPES.includes(annotation.type))
          continue
        annotations[annotation.type] = annotation.description
      }
    }
    data.env = envList.join(',')
    result.push({ ...annotations, ...data })
  }

  // merge same test cases
  // 모든 테스트환경(firefox, chrome, native...)은 같은 annotation이 있다 가정하고  merge 되지않습니다.
  const mergedData = Object.values(result.reduce((acc, cur) => {
    if (acc[cur.testName]) {
      acc[cur.testName].ok = acc[cur.testName].ok === true && cur.ok === true
      acc[cur.testName].env = `${acc[cur.testName].env},${cur.env}`
    }
    else {
      acc[cur.testName] = cur
    }
    return acc
  }, {}))

  return mergedData
}

// <<< json report to Excel <<<

// >>> utils >>>
function readJson(path) {
  const buff = fs.readFileSync(path)
  return JSON.parse(buff)
}

// function sheetToAoa(sheet, defaultValue = '') {
//   const jsonArr = XLSX.utils.sheet_to_json(sheet, {
//     header: 1,
//     defval: defaultValue,
//   })
//   return jsonArr
// }
// <<< utils <<<
