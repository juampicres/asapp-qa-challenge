context('API Tests Card Management', () => {
    const username = Cypress.env('USERNAME');
    beforeEach(() => {
        cy.login(username);
    });

    it('cant add product to cart if requested quantity is out of stock', () => {
        cy.getCartInfo(username).then((response) => {
            const cartInfo = response.body;
            cy.getProducts(username).then((response) => {
                cy.request(`${Cypress.env('baseApi')}/${username}/products`).then((response) => {
                    const targetProduct = Cypress._.sample(response.body);
                    const stock = targetProduct.product_qty;
                    const quantity = stock + 1;
                    const qtyOnCart = cartInfo.find((product) => product.product_name === targetProduct.product_name)?.product_qty || 0;
                    cy.request({
                        method: 'POST',
                        url: `${Cypress.env('baseApi')}/${username}/products/${targetProduct.product_name}/add`,
                        failOnStatusCode: false,
                        body: { quantity }
                    }).then((response) => {
                        expect(response.status).to.eq(400);
                        expect(response.body)
                            .include(`Unable to request QTY "${quantity + qtyOnCart}"`).and
                            .include(`"${targetProduct.product_name}": insufficient inventory`);
                    });
                });
            });
        });
    });

    it("POST /products/cart/checkout - after checkout the user cart got empty", () => {
        cy.getProducts(username).then((response) => {
            const productName = Cypress._.sample(response.body).product_name;
            const quantity = 1;
            cy.request({
                url: `${Cypress.env('baseApi')}/${username}/products/${productName}/add`,
                method: 'POST',
                body: { quantity }
            }).then(() => {
                cy.getCartInfo(username).then((response) => {
                    let cartInfo = response.body;
                    expect(cartInfo).to.be.an('array').not.to.be.empty;
                    cy.request({
                        url: `${Cypress.env('baseApi')}/${username}/products/cart/checkout`,
                        method: 'POST'
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body).to.contains("Checkout successful!");
                        cy.getCartInfo(username).then((res) => {
                            cartInfo = res.body;
                            expect(cartInfo).to.be.null;
                            cy.log("Cart is empty after checkout!! 🟢");
                        });
                    });
                });
            });
        });
    });
});