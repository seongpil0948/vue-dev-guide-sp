// import fs from 'fs'
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

export const getRecordDir = (testInfo: TestInfo) => {
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
  // return `${testConfig.recordPath}/${testInfo.outputDir.split('-').slice(1).join('/')}`
  // 0 is file directory path(relative)
  const path = `${testConfig.recordPath}/${testInfo.titlePath.slice(1).join('/')}`
  // console.log('path: ', path)
  return path
}

// from, to
// const videoPaths: [string, string][] = []

// base.afterAll(() => {
//   videoPaths.forEach((pathInfo) => {
//     fs.rename(pathInfo[0], pathInfo[1], (err) => {
//       if (err)
//         throw err
//       console.log('Successfully renamed - AKA moved!')
//     })
//   })
// })

base.afterEach(async ({ page }, testInfo) => {
  if (!testConfig.saveRecord)
    return
  const env = testInfo.project.name
  await page.screenshot({ path: `${getRecordDir(testInfo)}/after-${env}.jpeg`, type: 'jpeg', scale: 'css' })
  // video saveAs is not work properly(not close context)
  // const video = page.video()
  // const videoPath = `${getRecordDir(testInfo)}/${env}.webm`
  // if (video)
  //   videoPaths.push([await video.path(), videoPath])

  // test not closed when use saveAs
  // await video.saveAs(videoPath)
})
base.use({ locale: 'ko-KR', timezoneId: 'Asia/Seoul' })

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
      if (!testConfig.saveRecord)
        return
      await page.screenshot({ path: `${getRecordDir(testInfo)}/before-${testInfo.project.name}.jpeg`, type: 'jpeg', scale: 'css' })
    })
  },
})

export { expect } from '@playwright/test'
