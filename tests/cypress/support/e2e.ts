

import './commands'
import registerCypressGrep from '@cypress/grep'
registerCypressGrep()
import 'cypress-mochawesome-reporter/register';

before(() => {
    cy.seedDefaultUser(Cypress.env('USERNAME'), Cypress.env('PASSWORD'));
})