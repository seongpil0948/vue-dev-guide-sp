import { type Page } from '@playwright/test'
import { AnnotationType, expect, test } from 'test/tester'
// API: https://playwright.dev/docs/writing-tests#navigation

const MAIN_ROUTE = 'http://localhost:3333/guide/samp/el-todo'
test.describe('할일 생성,읽기,수정,삭제 테스트', () => {
  test.beforeEach(async ({ page, pushAnnotation, screenshotBefore }) => {
    pushAnnotation(AnnotationType.MAIN_CATEGORY, 'UI 프레임워크')
    pushAnnotation(AnnotationType.SUB_CATEGORY1, 'TODO 관리')
    await page.goto(MAIN_ROUTE) // Go to the starting url before each test.
    await page.waitForSelector('[data-test-id="todo-table"]')
    await screenshotBefore()
  })
  test('할 일 생성 케이스', async ({ page }) => {
    test.info().annotations.push(...[{ type: 'Test Action', description: 'UI Framework를 실행하고, 페이지 접속 \n TODO 페이지에서 할 일 을 입력하고 저장 되는지 확인' }, { type: '사용 데이터', description: 'ID: 1. 소금빵을 산다. \n  2. 밥을 먹는다.' }])

    await createTwoTodo(page)
    expect((await page.$$('.data-test-row')).length).toEqual(2)
    // await page.screenshot({ path: 'screenshots/todo/after-create.png', fullPage: true })
  })
  test('할 일 테이블 체크박스 수정 케이스', async ({ page }) => {
    test.info().annotations.push(...[{ type: 'Test Action', description: '할 일의 체크박스 전환(체크/해제)을 테스트한다.' }])
    // test.fail()
    await createTwoTodo(page)
    await page.getByRole('row', { name: '소금빵을 산다 미완료' }).locator('span').nth(1).click()
    await expect(page.getByRole('row', { name: '소금빵을 산다 미완료' }).locator('label.el-checkbox')).toHaveClass(/is-checked/)
    await page.getByRole('row', { name: '밥을 먹는다. 미완료', exact: true }).locator('span').nth(1).click()
    await expect(page.getByRole('row', { name: '밥을 먹는다. 미완료' }).locator('label.el-checkbox')).toHaveClass(/is-checked/)

    await page.getByRole('row', { name: '소금빵을 산다 미완료' }).locator('span').nth(1).click()
    await expect(page.getByRole('row', { name: '소금빵을 산다 미완료' }).locator('label.el-checkbox')).not.toHaveClass(/is-checked/)
    await page.getByRole('row', { name: '밥을 먹는다. 미완료', exact: true }).locator('span').nth(1).click()
    await expect(page.getByRole('row', { name: '밥을 먹는다. 미완료' }).locator('label.el-checkbox')).not.toHaveClass(/is-checked/)
  })
  test('할 일 테이블 상태 수정 케이스', async ({ page }) => {
    test.info().annotations.push(...[{ type: 'Test Action', description: '할 일의 상태(완료/미완료)전환을 테스트 한다.' }])
    await createTwoTodo(page)
    await page.getByRole('row', { name: '소금빵을 산다' }).getByRole('button', { name: '미완료' }).click()
    await expect(page.getByRole('row', { name: '소금빵을 산다' })).not.toContainText(/미완료/)
    await expect(page.getByRole('row', { name: '소금빵을 산다' })).toContainText(/완료/)
    await page.getByRole('row', { name: '소금빵을 산다 완료' }).getByRole('button', { name: '완료' }).click()
    await expect(page.getByRole('row', { name: '소금빵을 산다 미완료' })).toContainText(/미완료/)
  })
  test('할 일 전체 삭제 케이스', async ({ page }) => {
    await createTwoTodo(page)
    test.info().annotations.push(...[{ type: 'Test Action', description: '할 일 목록 전체 삭제를 테스트한다.' }])
    await page.getByRole('row', { name: '소금빵을 산다 미완료' }).locator('span').nth(1).click()
    await page.getByRole('row', { name: '밥을 먹는다. 미완료' }).locator('span').nth(1).click()
    await page.getByRole('button', { name: '삭제' }).click()
  })
})

async function createTwoTodo(page: Page) {
  await page.getByPlaceholder('TO-DO 항목을 입력해주세요.').click()
  await page.getByPlaceholder('TO-DO 항목을 입력해주세요.').fill('소금빵을 산다')
  await page.getByPlaceholder('TO-DO 항목을 입력해주세요.').press('Enter')
  await page.getByPlaceholder('TO-DO 항목을 입력해주세요.').click()
  await page.getByPlaceholder('TO-DO 항목을 입력해주세요.').fill('밥을 먹는다.')
  await page.getByRole('button', { name: '추가' }).click()
}

