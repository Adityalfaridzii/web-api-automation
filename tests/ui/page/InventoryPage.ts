import { Page,expect } from "@playwright/test";

const classConstant = {
    burgerMenu: "#react-burger-menu-btn",
    logoutMenu: "#logout_sidebar_link",
    productCountainer: "#inventory_container",
    sortBtn: ".product_sort_container",
    sort: {
        az: "az",
        za: "za",
        lohi: "lohi",
        hilo: "hilo"
    },
    itemName: ".inventory_item_name",
    itemPrice: ".inventory_item_price",
    cartBtn: "#shopping_cart_container"
}

export class InventoryPage{
    readonly page: Page;  

    constructor(page: Page) {
        this.page = page;
    }

    async clickBurgerMenu(){
        await this.page.click(classConstant.burgerMenu)
    }
    async clickLogout(){
        await this.page.click(classConstant.logoutMenu)
        console.log("Logout is clicked")
    }
    async assertProductPage(){
        await this.page.isVisible(classConstant.productCountainer)

        console.log("Product page is visible")
    }
    async clickProduct(productId: string){
        await this.page.click(productId)

        console.log("Product page is visible")
    }
    async clickSort(sortType: string){
        await this.page.locator(classConstant.sortBtn).click()
        await this.page.locator(classConstant.sortBtn).selectOption(sortType)
        console.log("Sort button is clicked")
        await this.page.waitForTimeout(2500)
    }
    async assertSortDisplayed(sortType: string){
        let currentProductOrder: any
        let sorted: any; 

        if(sortType === "az" || sortType === "za"){
            currentProductOrder =  await this.page.locator(classConstant.itemName).allTextContents()
        } else {
            currentProductOrder =  await this.page.locator(classConstant.itemPrice).allTextContents()
        }
        
        switch (sortType) {
            case "az":
                sorted = [...currentProductOrder].sort()
                break;
            case "za":
                sorted = [...currentProductOrder].sort().reverse()
                break;
            case "lohi":
                sorted = [...currentProductOrder].sort((a, b) => parseFloat(a.replace("$", "")) - parseFloat(b.replace("$", "")))
                break;
            case "hilo":
                sorted = [...currentProductOrder].sort((a, b) => parseFloat(b.replace("$", "")) - parseFloat(a.replace("$", "")))
                break;
        }

        console.log(sortType)
        console.log("currentProductOrder", currentProductOrder)
        console.log("sorted", sorted)
        expect(currentProductOrder).toEqual(sorted)
        console.log(`Product is sorted by ${sortType} displayed correctly`)
    }
    async clickCart(){
        await this.page.click(classConstant.cartBtn)
        console.log("Cart button is clicked")
    }
}