/* eslint-disable no-console */
import { type TestInfo, test as base } from '@playwright/test'
import testConfig from './testConfig'

export enum AnnotationType {
  MAIN_CATEGORY = 'MAIN_CATEGORY',
  SUB_CATEGORY1 = 'SUB_CATEGORY1',
  SUB_CATEGORY2 = 'SUB_CATEGORY2',
  SUB_CATEGORY3 = 'SUB_CATEGORY3',
}
// const isCustomAnnotation = (p: string): p is AnnotationType => p in AnnotationType
// Declare a array that defines the order of the elements to be sorted.
// const annotationOrder = ['MAIN_CATEGORY', 'SUB_CATEGORY1', 'SUB_CATEGORY3']

export const getScreenshotDir = (testInfo: TestInfo) => {
  // const customList = testInfo.annotations.filter(a => isCustomAnnotation(a.type))
  // console.log('testInfo.annotations: ', testInfo.annotations)
  // console.log('customList: ', customList)
  // customList.sort(
  //   (a, b) => { // Pass a function to the sort that takes 2 elements to compare
  //     if (a.type === b.type) { // If the elements both have the same `type`,
  //       return (a.description ?? '').localeCompare(b.description ?? '') // Compare the elements by `name`.
  //     }
  //     else {
  //       // Subtract indexes, If element `a` comes first in the array, the returned value will be negative
  //       // resulting in it being sorted before `b`, and vice versa.
  //       return annotationOrder.indexOf(a.type) - annotationOrder.indexOf(b.type)
  //     }
  //   },
  // )
  // return [testInfo.config.globalSetup, ...customList.map(x => x.description)].join('/')
  // return `${testConfig.screenshotPath}/${testInfo.outputDir.split('-').slice(1).join('/')}`
  // 0 is file directory path(relative)
  const path = `${testConfig.screenshotPath}/${testInfo.titlePath.slice(1).join('/')}`
  console.log('path: ', path)
  return path
}

base.afterEach(async ({ page }, testInfo) => {
  await page.screenshot({ path: `${getScreenshotDir(testInfo)}/after.jpeg`, type: 'jpeg', scale: 'css' })
})

interface IMyFixtures {
  pushAnnotation(type: AnnotationType, description: string): void
  screenshotBefore(): Promise<void>
}

export const test = base.extend<IMyFixtures>({
  pushAnnotation: async ({ page: _ }, use) => {
    await use((type, description) => {
      // console.log('pushAnnotation', type, description)
      base.info().annotations.push({ type, description })
    })
  },
  screenshotBefore: async ({ page }, use, testInfo) => {
    await use(async () => {
      await page.screenshot({ path: `${getScreenshotDir(testInfo)}/before.jpeg`, type: 'jpeg', scale: 'css' })
    })
  },
})

export { expect } from '@playwright/test'
