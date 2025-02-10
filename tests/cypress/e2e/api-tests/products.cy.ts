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
            cy.clearCookies();
            cy.clearAllSessionStorage();
            cy.clearAllLocalStorage();
            cy.request(`${Cypress.env('baseApi')}/${username}/products`).then((response) => {
                expect(response.status, "user should not be authorized").to.eq(401);
            });
        });

        it('GET /products/:id - must return a single product detail with expected keys', () => {
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

        it('POST /products/:name/add - must add a product to the cart if stock is enough', () => {
            cy.getProducts(username).then((response) => {
                const products = response.body;
                cy.resetStock(username, products);
                cy.request(`${Cypress.env('baseApi')}/${username}/products`).then(() => {
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
    });
});

