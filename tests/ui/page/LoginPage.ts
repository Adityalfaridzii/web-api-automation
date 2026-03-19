import { Page } from "@playwright/test";

const classConstant = {
    username: "#user-name",
    password: "#password",
    loginBtn: "#login-button",

}

export class LoginPage{
    readonly page: Page;  

    constructor(page: Page) {
        this.page = page;
    }
    async userLogin(username: string, password: string){
        await this.page.fill(classConstant.username, username)
        await this.page.fill(classConstant.password, password)
        await this.page.click(classConstant.loginBtn)
    }
    async assertLoginPage(){
        await this.page.isVisible(classConstant.loginBtn)
        await this.page.isVisible(classConstant.username)
        await this.page.isVisible(classConstant.password)

        console.log("Login Page is visible")
    }
    async clickLoginButton(){
        await this.page.click(classConstant.loginBtn)
    }
    async assertErrorMessage(errorMessage: string){
        await this.page.getByText(errorMessage).isVisible()
        console.log("Error message is visible")
    }

}