/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
export {};
//
declare global {
    namespace Cypress {
        interface Chainable {
            register(email: string, password?: string): Chainable<{body, status: number}>
            login(email: string, password: string): Chainable<void>
            logout(): Chainable<void>
        }
    }
}

/******************** API AUTH ***********/
Cypress.Commands.add('register', (username, password?) => { 
    cy.request({
        method: 'POST',
        url: `${Cypress.env("baseApi")}/users/register`,
        failOnStatusCode: false,
        body: { username, password: password || 'passw0rd' }    
    }).then((response) => {
        console.log(response)
        return response;
    })
})

Cypress.Commands.add('login', (username, password) => {
    username = username || Cypress.env('USERNAME');
    password = password || Cypress.env('PASSWORD');
    cy.request({
        method: 'POST',
        url: `${Cypress.env("baseApi")}/users/login`,
        failOnStatusCode: false,
        body: { username, password }    
    }).then((response) => {
        console.log(response)
        return response;
    })
})

Cypress.Commands.add('logout', () => {
    cy.getCookie('DLacy').then((cookie) => {
        console.log(cookie)
        const username = cookie.value;
        cy.request({
            method: 'POST',
            url: `${Cypress.env("baseApi")}/users/logout`,
            failOnStatusCode: false,
            body: { username }    
        }).then((response) => {
            return response;
        })
    })
    
})

/* Cypress.Commands.add('auth', (username?, password?) => {
    username ? username : Cypress.env('USERNAME');
    password ? password : Cypress.env('PASSWORD');
    cy.login(username, password).then((response) => {
        cy.log(response);
        cy.pause();
        cy.register(username, password).then((response) => {
        })
    })
}) */

Cypress.Commands.add('dropDatabase', () => {
    cy.task('dropDatabase');
})

/*************** PRODUCTS  ********************/
Cypress.Commands.add('getProducts', (username) => {
    return cy.request(`${Cypress.env('baseApi')}/${username}/products`)
})
Cypress.Commands.add('resetStock', (username, products) => {
    products.forEach(product => {
        cy.request({
            method: 'POST',
            failOnStatusCode: false,
            url: `${Cypress.env('baseApi')}/${username}/products/cart/${product.product_name}/remove`,
        }).then((response) => {
            console.log(response.body);
        })
    })
})

/*************** CART  ********************/
Cypress.Commands.add('getCartInfo', (username) => {
    cy.request(`${Cypress.env('baseApi')}/${username}/products/cart`).then((response) => {
        return response;
    })
})