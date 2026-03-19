import { Page,expect } from "@playwright/test";

const classConstant = {
    checkoutContainer: "#checkout_summary_container",
    finishBtn: "#finish",
}

export class CheckoutOverviewPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async assertCheckoutOverviewPage() {
        await this.page.isVisible(classConstant.checkoutContainer);
        console.log("Checkout overview page is visible");
    }
    async assertNoVisibleCheckoutOverviewPage() {
        await expect(this.page.locator(classConstant.checkoutContainer)).toBeHidden();
        console.log("Checkout overview page is not visible");
    }
    async clickFinish() {
        await this.page.click(classConstant.finishBtn);
        console.log("Finish button is clicked");
    }
    async assertProductName(productName: string) {
        await this.page.getByText(productName).isVisible();
        console.log("Product name is correct");
    }
    async assertProductPrice(price: string) {
        await this.page.getByText(price).isVisible();
        console.log("Product price is correct");
     }
}