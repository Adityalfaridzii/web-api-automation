import { Page,expect } from "@playwright/test";

const classConstant = {
    checkoutContainer: "#checkout_info_container",
    firstName: "#first-name",
    lastName: "#last-name",
    postalCode: "#postal-code",
    continueBtn: "#continue",
    cancelBtn: "#cancel"
}

export class CheckoutPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async assertCheckoutPage() {
        await this.page.isVisible(classConstant.checkoutContainer);
        await this.page.isVisible(classConstant.firstName);
        await this.page.isVisible(classConstant.lastName);
        await this.page.isVisible(classConstant.postalCode);
        await this.page.isVisible(classConstant.continueBtn);
        await this.page.isVisible(classConstant.cancelBtn);
        console.log("Checkout page is visible");
     }
     async clickContinue() {
        await this.page.click(classConstant.continueBtn);
        console.log("Continue button is clicked");
     }
     async clickCancel() {
        await this.page.click   (classConstant.cancelBtn);
        console.log("Cancel button is clicked");
     }
     async fillCheckoutForm(firstName: string, lastName: string, postalCode: string) {
        await this.page.fill(classConstant.firstName, firstName);
        await this.page.fill(classConstant.lastName, lastName);
        await this.page.fill(classConstant.postalCode, postalCode);
        console.log("Checkout form is filled");
     }
     async assertErrorMessage(errorMessage: string) {
        await this.page.getByText(errorMessage).isVisible();
        console.log("Error message is visible");
     }
     async inputCheckoutForm(firstName: string, lastName: string, postalCode: string) {
        await this.page.fill(classConstant.firstName, firstName);
        await this.page.fill(classConstant.lastName, lastName);
        await this.page.fill(classConstant.postalCode, postalCode);
        console.log("Checkout form is filled");
     }
    }