import loginPage from "../pages/LoginPage";
import storePage from "../pages/StorePage";
import { Product } from "../types";
const usr = Cypress.env('USERNAME');
const pwd = Cypress.env('PASSWORD');
describe("Login Scenarios", () => {
    before(() => {
        cy.task("resetDB", {stage: "local"});
    });

    beforeEach(() => {
        cy.intercept('/*/products').as('getProducts');
        cy.register(usr, pwd);
        loginPage.login(usr, pwd);
        cy.wait("@getProducts").then((interception) => {
            cy.wrap(interception.response.body).as('products');
        })
    });

    it("user can purchase all products if available in stock", () => {
        cy.get("@products").then((products: Product) => {
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
        });
    })

    it("can't select product qty over actual product stock from product card on ui", ()=>{
        cy.get("@products").then((products: Product) => {
            const targetProduct = Cypress._.sample(products);
            const stock = targetProduct.product_qty;
            console.log(`product: ${targetProduct.product_name} stock: ${stock}`)
            storePage.getProductCard(targetProduct.product_name)
                .find(storePage.elements.qtySelect)
                    .as('qtySelect')
                    .click();
            cy.get(`[data-value="${stock}"]`).should('exist')
                .parent().parent().as('qtyOptionsWrapper').scrollTo('bottom');
            cy.get(`[data-value="${stock+1}"]`).should('not.exist');
        })
    })

    it("shoppint page has a way to scroll down all the way if there are many products", () => {
        cy.intercept('/*/products', {
            fixture: 'fakeProducts.json'
        }).as('getProducts');
        cy.reload()
        cy.wait('@getProducts').then((interception) => {
            const mokedProducts = interception.response.body;
            console.log(interception.response.body)
            cy.scrollTo('bottom', {duration: 2000});
            cy.contains(mokedProducts.at(-1).product_name).should('be.visible');
        })
    });

    //here we don't have neither a quantity 1 set by default or warning message
    it("user add a single product unit to cart if no specific quantity was specified", {tags: "@bug"},() => {
        cy.get("@products").then((products: Product) => {
            const targetProduct = Cypress._.sample(products);
            cy.intercept(`${Cypress.env("baseApi")}/*/products/*/add`).as('addProduct');
            storePage.getProductCard(targetProduct.product_name)
                .find('[data-test-name="add-to-cart-button"]').click();
            cy.wait('@addProduct').then((interception) => {
                console.log("add to cart throwing internal server error when no qty ❌")
                expect(interception.response.statusCode, "product added successfuly").to.eq(200);
                storePage.navigateToSection("Cart");
                //continue from here after fixing the bug...
            })
        })
    });
});