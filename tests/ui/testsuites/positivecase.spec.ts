import { test, expect } from '@playwright/test';
import fs from 'fs';
import { LoginPage } from '../page/LoginPage';
import { InventoryPage } from '../page/InventoryPage';
import { ProductDetailPage } from '../page/ProductDetailPage';
import { CartPage } from '../page/CartPage';    
import { CheckoutPage } from '../page/CheckoutPage';
import { CheckoutOverviewPage } from '../page/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../page/CheckoutCompletePage';

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

const productdata = {
  id: "#item_4_title_link",
  productName: "Sauce Labs Backpack",
  price: "$29.99"

}

test('TC1_The user is able to login and logout', async ({ page }) => {
  let loginPage = new LoginPage(page);
  let inventoryPage = new InventoryPage(page);


  await page.goto(URL);
  await loginPage.assertLoginPage();
  await loginPage.userLogin(configData.USERNAME, configData.PASSWORD);
  await inventoryPage.assertProductPage();
  await inventoryPage.clickBurgerMenu();
  await inventoryPage.clickLogout();
  await loginPage.assertLoginPage();
  console.log("TC1 is passed")
});

test('TC2_The inventory page is displayed properly along with all products list', async ({ page }) => {
  let loginPage = new LoginPage(page);
  let inventoryPage = new InventoryPage(page);
  let productDetailPage = new ProductDetailPage(page);


  await page.goto(URL);
  await loginPage.assertLoginPage();
  await loginPage.userLogin(configData.USERNAME, configData.PASSWORD);
  await inventoryPage.assertProductPage();
  await page.waitForTimeout(2000);
  await inventoryPage.clickProduct(productdata.id);
  await productDetailPage.assertProductDetailPage(productdata);
  console.log("TC2 is passed")
});

test('TC3_Verify sorting functionality', async ({ page }) => {
  let loginPage = new LoginPage(page);
  let inventoryPage = new InventoryPage(page);

  await page.goto(URL);
  await loginPage.assertLoginPage();
  await loginPage.userLogin(configData.USERNAME, configData.PASSWORD);
  await inventoryPage.assertProductPage();
  await page.waitForTimeout(2000);
  await inventoryPage.clickSort("za");
  await inventoryPage.assertSortDisplayed("za");
  await inventoryPage.clickSort("lohi");
  await inventoryPage.assertSortDisplayed("lohi");
  await inventoryPage.clickSort("hilo");
  await inventoryPage.assertSortDisplayed("hilo");
  await inventoryPage.clickSort("az");
  await inventoryPage.assertSortDisplayed("az");
  await page.pause();
  console.log("TC3 is passed")
});

test ('TC4_Verify user can successfully checkout item', async ({ page }) => {
    let loginPage = new LoginPage(page);
    let inventoryPage = new InventoryPage(page);
    let productDetailPage = new ProductDetailPage(page);
    let cartPage = new CartPage(page);
    let checkoutPage = new CheckoutPage(page);
    let checkoutOverviewPage = new CheckoutOverviewPage(page);
    let checkoutCompletePage = new CheckoutCompletePage(page);

    await page.goto(URL);
    await loginPage.assertLoginPage();
    await loginPage.userLogin(configData.USERNAME, configData.PASSWORD);
    await inventoryPage.assertProductPage();
    await inventoryPage.clickProduct(productdata.id);
    await productDetailPage.assertProductDetailPage(productdata);
    await productDetailPage.clickAddToCart();
    await inventoryPage.clickCart();
    await cartPage.assertCartPage();
    await cartPage.clickCheckout();
    await checkoutPage.fillCheckoutForm("Aditya", "Alfaridzi", "12345");
    await checkoutPage.clickContinue();
    await checkoutOverviewPage.assertCheckoutOverviewPage();
    await checkoutOverviewPage.clickFinish();
    await checkoutOverviewPage.assertNoVisibleCheckoutOverviewPage();
    await checkoutCompletePage.assertCheckoutCompletePage();
    console.log("TC4 is passed")
});