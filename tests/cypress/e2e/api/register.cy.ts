import { env } from 'process';
import { random } from './../../node_modules/@colors/colors/index.d';
import { faker } from "@faker-js/faker";

describe("API Tests", () => {
    beforeEach(() => {
        cy.visit('/');
    });

    after(()=>{
        cy.task("resetDB", {env: env.stage});
    })

    context("user try to register with a username that already exists", () => {
        it("case sensitive registry for username", () => {
            const username = faker.internet.username();
            const password = faker.internet.password();
            cy.register(username).then((response) => {
                expect(response.status, "get success status code: user was registered successfully").to.eq(200);
                expect(response.body).to.include("User created successfully");
                cy.log("..trying to register the exact same user again");
                cy.register(username, password).then((response) => {
                    expect(response.status, "get conflict status code: user was not registered successfully at the second time").to.eq(409);
                    expect(response.body).eq(`Username "${username}" already exists`);
                })
            })
        });

        it("case insensitive registry for username", {tags: "@bug"}, () => {
            let username = faker.internet.username().toLowerCase();
            cy.register(username).then((response) => {
                expect(response.status).to.eq(200);
                username = username.toUpperCase();
                cy.register(username).then((response) => {
                    expect(response.body, "user already exists message").eq(`Username "${username}" already exists`);
                    expect(response.status, "server throws conflict because the user already exists").to.eq(409);
                })
            });
        })
    });

    it("user password cant be less than 6 digit", {tags: "@bug"}, () => {
        const username = faker.internet.username();
        const pwd = faker.internet.password({length: Cypress._.random(1, 5)});
        cy.log(`🔑 weak password submitted: ${pwd}`);
        cy.register(username, pwd).then((response) => {
            expect(response.status, "get bad request status code: user was not registered successfully").to.eq(400);
            expect(response.body).to.include("Password must be at least 6 characters long");
        })
    });

    it.skip("user password should be hashed on database", () => {
        const username = faker.internet.username();
        const pwd = faker.internet.password();
        cy.register(username, pwd).then((response) => {
            //will get back here later to implement a way to get the db.json from the server
        })
    });
});