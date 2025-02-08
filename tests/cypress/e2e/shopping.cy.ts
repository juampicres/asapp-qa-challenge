import { faker } from "@faker-js/faker";
import loginPage from "../pages/LoginPage";
import storePage from "../pages/StorePage";
const usr = Cypress.env('USERNAME');
const pwd = Cypress.env('PASSWORD');
describe("Login Scenarios", () => {
    before(() => {
        cy.task("resetDB", {stage: "local"});
        cy.intercept('/*/products').as('getProducts');
        cy.register(usr, pwd);
        loginPage.login(usr, pwd);
        cy.wait("@getProducts").then((interception) => {
            cy.wrap(interception.response.body).as('products');
        })
    });

    beforeEach(() => {
        cy.visit('/');
    });

    it("user can add 1 single product to cart if no specific quantity was specified", {tags: "@bug"},() => {
        cy.get("@products").then((products) => {
            const targetProduct = Cypress._.sample(products);
            cy.intercept(`${Cypress.env("baseApi")}/*/products/*/add`).as('addProduct');
            storePage.getProductCard(targetProduct.product_name)
                .find('[data-test-name="add-to-cart-button"]').click();
            cy.wait('@addProduct').then((interception) => {
                expect(interception.response.statusCode, "product added successfuly").to.eq(200);
                storePage.navigateToSection("Cart");
                //continue from here after fixing the bug...
            })
        })
    });

    it.only("user can purchase all products if available in stock", () => {
        cy.get("@products").then((products) => {
            products.forEach(product => {
                cy.intercept(`${Cypress.env("baseApi")}/*/products/*/add`).as('addProduct')
                storePage.getProductCard(product.product_name)
                    .as("productCard")
                        .find('.MuiSelect-select').click();
                let qty = Cypress._.random(1, 10);
                cy.get(`[data-value="${qty}"]`).click();
                cy.get('@productCard').find('[data-test-name="add-to-cart-button"]').click();
                cy.wait('@addProduct').then((interception) => {
                    expect(interception.response.statusCode, "product added successfuly").to.eq(200);
                    storePage.getToastMessage("Product Added to Cart").should('be.visible');
                    storePage.dismissToastMessage();
                })
            })
            cy.log("Visit the cart to see the products")
            storePage.navigateToSection("Cart");
            cy.intercept(`${Cypress.env("baseApi")}/*/products/cart/checkout`).as('checkout');
            storePage.getBuyBtn().click();
            cy.wait('@checkout')
            cy.contains('.MuiDialogTitle-root', 'Thank you!').should('be.visible');
            cy.contains('span', 'Awesome').click();
        })
    });
});