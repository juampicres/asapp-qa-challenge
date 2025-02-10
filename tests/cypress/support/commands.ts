import { Product } from "./../types";
/// <reference types="cypress" />
import "@cypress-audit/lighthouse/commands";
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
            login(email?: string, password?: string): Chainable<void>
            logout(): Chainable<void>
            seedDefaultUser(user: string, pwd: string): Chainable<void>
            getProducts(username: string): Chainable<{Product}[]>
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
        if(response.status === 401){
            cy.register(username, password).then(() => { cy.login(username, password) })
        }else{ return response }
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
    });
})

Cypress.Commands.add('seedDefaultUser', (user, pwd) => {
    cy.register(user, pwd)
});

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
        })
    })
})

/*************** CART  ********************/
Cypress.Commands.add('getCartInfo', (username) => {
    cy.request(`${Cypress.env('baseApi')}/${username}/products/cart`).then((response) => {
        return response;
    })
})