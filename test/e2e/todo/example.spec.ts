import { type Page, expect, test } from '@playwright/test'
// API: https://playwright.dev/docs/writing-tests#navigation

const MAIN_ROUTE = 'http://localhost:3333/guide/samp/el-todo'
test.describe('Todo CRUD ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(MAIN_ROUTE) // Go to the starting url before each test.
  })
  test('create todo', async ({ page }) => {
    await createTwoTodo(page)
    expect((await page.$$('.data-test-row')).length).toEqual(2)
  })
  test('update todo checkbox', async ({ page }) => {
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
  test('update todo status', async ({ page }) => {
    await createTwoTodo(page)
    await page.getByRole('row', { name: '소금빵을 산다' }).getByRole('button', { name: '미완료' }).click()
    await expect(page.getByRole('row', { name: '소금빵을 산다' })).not.toContainText(/미완료/)
    await expect(page.getByRole('row', { name: '소금빵을 산다' })).toContainText(/완료/)
    await page.getByRole('row', { name: '소금빵을 산다 완료' }).getByRole('button', { name: '완료' }).click()
    await expect(page.getByRole('row', { name: '소금빵을 산다 미완료' })).toContainText(/미완료/)
  })
  test('delete all todo', async ({ page }) => {
    await createTwoTodo(page)
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

