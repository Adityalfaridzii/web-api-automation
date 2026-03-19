import { test, expect } from '@playwright/test';
import fs from 'fs';
import { LoginPage } from '../page/LoginPage';
import { InventoryPage } from '../page/InventoryPage';
import { ProductDetailPage } from '../page/ProductDetailPage';
import { CartPage } from '../page/CartPage';    
import { CheckoutPage } from '../page/CheckoutPage';
import { CheckoutOverviewPage } from '../page/CheckoutOverviewPage';

var configData:any;
var URL = "";

test.beforeAll(async () => {
  //init some of the helper
  configData = JSON.parse(fs.readFileSync("./setup/config.json", "utf-8"));
  URL = configData.URL;
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test('TC1_Verify error message when username and password is not provided', async ({ page }) => {
  let loginPage = new LoginPage(page);

  await page.goto(URL);
  await loginPage.assertLoginPage();
  await loginPage.clickLoginButton();
  await loginPage.assertErrorMessage("Epic sadface: Username is required");
  console.log("TC1 negative case is passed")
});

test('TC2_Verify error message when password is invalid', async ({ page }) => {
  let loginPage = new LoginPage(page);

  await page.goto(URL);
  await loginPage.assertLoginPage();
  await loginPage.userLogin("standard_user", "wrong_password");
  await loginPage.assertErrorMessage("Epic sadface: Username and password do not match any user in this service");
  console.log("TC2 negative case is passed")
});

test('TC3_Verify error message when username is invalid', async ({ page }) => {
  let loginPage = new LoginPage(page);

  await page.goto(URL);
  await loginPage.assertLoginPage();
  await loginPage.userLogin("wrong_username", " secret_sauce");
  await loginPage.assertErrorMessage("Epic sadface: Username and password do not match any user in this service");
  console.log("TC3 negative case is passed")
});

test('TC4_Verify error message when user checkout with empty field on data information', async ({ page }) => {
    let loginPage = new LoginPage(page);
    let inventoryPage = new InventoryPage(page);
    let productDetailPage = new ProductDetailPage(page);
    let cartPage = new CartPage(page);
    let checkoutPage = new CheckoutPage(page);

    await page.goto(URL);
    await loginPage.assertLoginPage();
    await loginPage.userLogin(configData.USERNAME, configData.PASSWORD);
    await inventoryPage.assertProductPage();
    await inventoryPage.clickProduct("#item_4_title_link");
    await productDetailPage.assertProductDetailPage({
        productName: "Sauce Labs Backpack",
        price: "$29.99"
    })
    await productDetailPage.clickAddToCart();
    await inventoryPage.clickCart();
    await cartPage.assertCartPage();
    await cartPage.clickCheckout();
    await checkoutPage.clickContinue();
    await checkoutPage.assertErrorMessage("Error: First Name is required");
    console.log("TC4 negative case is passed")
});

test('TC5_Verify when user checkout with empty item on cart should display error message', async ({ page }) => {
    let loginPage = new LoginPage(page);
    let inventoryPage = new InventoryPage(page);
    let cartPage = new CartPage(page);
    let checkoutPage = new CheckoutPage(page);
    let checkoutOverviewPage = new CheckoutOverviewPage(page);

    await page.goto(URL);
    await loginPage.assertLoginPage();
    await loginPage.userLogin(configData.USERNAME, configData.PASSWORD);
    await inventoryPage.assertProductPage();
    await inventoryPage.clickCart();
    await cartPage.assertCartPage();
    await cartPage.clickCheckout();
    await checkoutPage.fillCheckoutForm("Aditya", "Alfaridzi", "12345");
    await checkoutPage.clickContinue();
    await page.waitForTimeout(2000);
    await checkoutOverviewPage.assertNoVisibleCheckoutOverviewPage();
    console.log("TC5 negative case is passed")
});