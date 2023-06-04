import * as fs from 'fs'
import * as XLSX from 'xlsx'

XLSX.set_fs(fs)
const buff = fs.readFileSync('script/result.json')
const json = JSON.parse(buff)
const suites = json.suites
// iterate test files
const result = parseSuiteList(suites)

const worksheet = XLSX.utils.json_to_sheet(result)
const workbook = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(workbook, worksheet, 'test result')
XLSX.writeFile(workbook, './result.xlsx')

function parseSuiteList(suites) {
  const result = []
  for (let i = 0; i < suites.length; i++) {
    const suite = suites[i]
    console.log('suite: ', suite)
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
    result.push({ fileName, title, testName: testCase.title, ok: testCase.ok })
  }
  return result
}
