const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/forgot-password');
});

test("Forgot Password form and it's fields are visible", async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Forgot Password' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Security Answer' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'New Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reset Password' })).toBeVisible();
});

test('successful reset password', async ({ page }) => {
    const randomSuffix = Math.floor(Math.random() * 10000);
    await page.getByRole('textbox', { name: 'Enter your email' }).click();
    await page.getByRole('textbox', { name: 'Enter your email' }).fill('masteruitest@gmail.com');
    await page.getByRole('textbox', { name: 'Enter your security answer' }).click();
    await page.getByRole('textbox', { name: 'Enter your security answer' }).fill('Soccer');
    await page.getByRole('textbox', { name: 'Enter new password' }).click();
    await page.getByRole('textbox', { name: 'Enter new password' }).fill(`newpassword${randomSuffix}`);
    await page.getByRole('button', { name: 'Reset Password' }).click();

    await page.goto('http://localhost:3000/login');
    await expect(page.getByRole('heading', { name: 'LOGIN FORM' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Enter Your Email' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Enter Your Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'LOGIN' })).toBeVisible();
});

test('unsuccessful reset password with wrong email', async ({ page }) => {
    const randomSuffix = Math.floor(Math.random() * 10000);
    await page.getByRole('textbox', { name: 'Enter your email' }).click();
    await page.getByRole('textbox', { name: 'Enter your email' }).fill(`${randomSuffix}@gmail.com`);
    await page.getByRole('textbox', { name: 'Enter your security answer' }).click();
    await page.getByRole('textbox', { name: 'Enter your security answer' }).fill('Soccer');
    await page.getByRole('textbox', { name: 'Enter new password' }).click();
    await page.getByRole('textbox', { name: 'Enter new password' }).fill(`newpassword${randomSuffix}`);
    await page.getByRole('button', { name: 'Reset Password' }).click();

    await expect(page.getByText('Wrong Email Or Answer')).toBeVisible();
});