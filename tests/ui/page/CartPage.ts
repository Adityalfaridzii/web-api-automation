import { Page,expect } from "@playwright/test";

const classConstant = {
    cartContainer: "#cart_contents_container",
    checkoutBtn: "#checkout",
    continueShoppingBtn: "#continue-shopping"
}

export class CartPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async assertCartPage() {
        await this.page.isVisible(classConstant.cartContainer);
        await this.page.isVisible(classConstant.checkoutBtn);
        await this.page.isVisible(classConstant.continueShoppingBtn);  
        console.log("Cart page is visible");
    }

    async clickCheckout() {
        await this.page.click(classConstant.checkoutBtn);
        console.log("Checkout button is clicked");
    }
}