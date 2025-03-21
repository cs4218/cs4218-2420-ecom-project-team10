import { test, expect } from '@playwright/test';

// navigate to the home page first 
test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/product/the-law-of-contract-in-singapore');
});

test.describe("Product Details", () => {

    test('should add to cart when ADD TO CART button clicked', async ({ page }) => {
        // Assert empty cart at first
        await expect(page.locator('sup')).toHaveText('0');

        // Click on ADD TO CART button
        await page.locator('.btn-secondary').click();

        await expect(page.getByRole('status')).toHaveText("Item Added to cart");
        await expect(page.locator('sup')).toHaveText('1');

        // check cart has product
        await page.getByRole('link', { name: 'Cart' }).click();
        await expect(page.getByRole('main')).toMatchAriaSnapshot(`
            - paragraph: The Law of Contract in Singapore
            - paragraph: A bestselling book in Singapor
            - paragraph: "/Price : \\\\d+\\\\.\\\\d+/"
            `);

    });

    test("should have ADD TO CART and MORE DETAILS button for related products", async ({ page }) => {

        await expect(page.getByRole('button', { name: 'More Details' }).first()).toBeVisible();
        await expect(page.getByRole('button', { name: 'ADD TO CART' }).nth(1)).toBeVisible();

    });

    

    test('should allow related products to be added to cart', async ({ page }) => {
        // Assert empty cart at first
        await expect(page.locator('sup')).toHaveText('0');

        // Click on ADD TO CART button
        await page.locator('.btn-dark').first().click();

        await expect(page.getByRole('status')).toHaveText("Item Added to cart");
        await expect(page.locator('sup')).toHaveText('1');

        // check cart has product
        await page.getByRole('link', { name: 'Cart' }).click();
        await expect(page.getByRole('main')).toMatchAriaSnapshot(`
            - paragraph: Textbook
            - paragraph: A comprehensive textbook
            - paragraph: "/Price : \\\\d+\\\\.\\\\d+/"
            `);

    });
})