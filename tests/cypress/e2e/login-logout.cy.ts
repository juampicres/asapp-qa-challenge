import { faker } from "@faker-js/faker";
import loginPage from "../pages/LoginPage";

context("Login Scenarios", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should not login with invalid credentials", () => {
        const username = faker.internet.username();
        const password = faker.internet.password();
        loginPage.login(username, password);
        cy.wait('@login').then((interception) => {
            expect(interception.request.body).to.deep.eq({ username, password });
            expect(interception.response.statusCode).to.eq(401);
            loginPage.errorToastMessage("Incorrect Username or Password").should('be.visible');
        });
    });

    it("should login with valid credentials & set user cookie", () => {
        loginPage.login(Cypress.env('USERNAME'), Cypress.env('PASSWORD'));
        cy.wait('@login').then((interception) => {
            expect(interception.request.body).to.deep.eq({ username: Cypress.env('USERNAME'), password: Cypress.env('PASSWORD') });
            expect(interception.response.statusCode).to.eq(200);
            cy.getCookie("DLacy").then(cookie => {
                expect(cookie.value).to.eq(Cypress.env('USERNAME'));
            })
        });
    })
});

context("Logout Scenarios", () => {
    it("logout action should redirect user back to login removing session cookie", () => {
        loginPage.login(Cypress.env('USERNAME'), Cypress.env('PASSWORD'));
        cy.getCookie("DLacy").then(cookie => {
            expect(cookie).to.have.property('name', 'DLacy')
            expect(cookie.value).to.eq(Cypress.env('USERNAME'));
        })
        cy.get('button').contains('Log out', {matchCase:false}).click();
        cy.getCookie("DLacy").should('not.exist');
        cy.log("User is logged out successfully to the login page and cookie is removed");
        cy.contains("h2", "Please Login").should('be.visible');
    })
});