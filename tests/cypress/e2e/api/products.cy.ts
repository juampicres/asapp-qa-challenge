describe('API Testing - Products', () => {
  
    context('Operaciones CRUD sobre Product', () => {
        const username = Cypress.env('USERNAME');
        beforeEach(() => {
            cy.login(username);
        });

        it('GET /products - must return an array of products', () => {
            cy.request(`${Cypress.env('baseApi')}/${username}/products`).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.be.an('array').not.to.be.empty;
                response.body.forEach((product) => {
                    expect(product).to.have.property('product_name')
                        .to.be.a('string').not.to.be.empty;
                    expect(product).to.have.property('product_descr')
                        .to.have.length.greaterThan(10);
                    expect(product).to.have.property('product_qty')
                        .to.be.a('number').to.be.greaterThan(0, "have at least 1 unit in stock by default");
                });
            });
        });

        it('GET /products - without a valid session server wont return products given a username', {tags: "@bugs"}, () => {
            cy.logout(); //there is no need to close the session to test this  :S
            cy.request(`${Cypress.env('baseApi')}/${username}/products`).then((response) => {
                expect(response.status).to.eq(401);
            });
        });

        it('GET /products/:id - must return a single product detail', () => {
            cy.request(`${Cypress.env('baseApi')}/${username}/products`).then((response) => {
                const targetProduct = Cypress._.sample(response.body);
                cy.request(`${Cypress.env('baseApi')}/${username}/products/${targetProduct.product_name}`).then((response) => {
                    console.log(response.body);
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property('product_name', targetProduct.product_name);
                    expect(response.body).to.have.property('product_descr', targetProduct.product_descr);
                    expect(response.body).to.have.property('product_qty', targetProduct.product_qty);
                });
            });
        });

        //add tests for all these endpoints
        /* endpoints = {
    "REGISTER_USER": "/users/register",
    "LOGIN_USER": "/users/login",
    "LOGOUT_USER": "/users/logout",
    "GET_PRODUCTS": "/<string:username>/products",
    "GET_PRODUCT": "/<string:username>/products/<string:product_name>",
    "ADD_TO_CART": "/<string:username>/products/<string:product_name>/add",
    "GET_CART": "/<string:username>/products/cart",
    "CHECKOUT_CART": "/<string:username>/products/cart/checkout",
    "REMOVE_FROM_CART": "/<string:username>/products/"
                        "cart/<string:product_name>/remove"
} */
        it('POST /products/:name/add - must add a product to the cart if stock is enough', () => {
            cy.getProducts(username).then((response) => {
                const products = response.body;
                cy.resetStock(username, products);
                cy.request(`${Cypress.env('baseApi')}/${username}/products`).then((response) => {
                    const targetProduct = Cypress._.sample(products);
                    const stock = targetProduct.product_qty;
                    const quantity = Cypress._.random(1, stock);
                    cy.request({
                        method: 'POST',
                        url: `${Cypress.env('baseApi')}/${username}/products/${targetProduct.product_name}/add`,
                        body: { quantity }
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body).to.include(`QTY "${quantity}" of product "${targetProduct.product_name}" added to cart`);
                    });
                });
            });
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

        it.only("POST /products/cart/checkout - after checkout the user cart got empty", () => {
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
});

