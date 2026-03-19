import { Page,expect } from "@playwright/test";

const classConstant = {
    checkoutCompleteContainer: "#checkout_complete_container"
}

export class CheckoutCompletePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async assertCheckoutCompletePage() {
        await this.page.isVisible(classConstant.checkoutCompleteContainer);
        console.log("Checkout complete page is visible");
     }
}