import { Page } from "@playwright/test";

const classConstant = {
    productDetailContainer: "#inventory_item_container",
    productImage: ".inventory_details_img",
    productName: ".inventory_details_name large_size",
    productDescription: ".inventory_details_desc large_size",
    productPrice: ".inventory_details_price",
    addToCartButton: "#add-to-cart"
}

export class ProductDetailPage{
    readonly page: Page;  

    constructor(page: Page) {
        this.page = page;
    }

    async assertProductDetailPage(productdata: any){
        await this.page.isVisible(classConstant.productDetailContainer)
        await this.page.isVisible(classConstant.productImage)
        await this.page.isVisible(classConstant.productName)
        await this.page.isVisible(classConstant.productDescription)
        await this.page.isVisible(classConstant.productPrice)
        await this.page.isVisible(classConstant.addToCartButton)
        console.log("Product detail page is visible")

        await this.page.getByText(productdata.productName).isVisible();
        await this.page.getByText(productdata.price).isVisible();
        console.log("Product name and price is correct")
    }
    async clickAddToCart(){
        await this.page.click(classConstant.addToCartButton)
        console.log("Add to Cart button is clicked")
    }
}