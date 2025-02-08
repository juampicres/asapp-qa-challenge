class LoginPage{
    get usernameInput(){
        return cy.get('#username');
    }
    get passwordInput(){
        return cy.get('#password');
    }
    getLoginBtn(){
        return cy.get('button').contains('Log in', {matchCase: false});
    }

    errorToastMessage(message: string){
        return cy.get('[role="alertdialog"]').contains(message);
    }

    login(username?: string , password?: string){
        cy.visit('/');
        cy.intercept('POST', '/users/login').as('login');
        this.usernameInput.type(username);
        this.passwordInput.type(password);
        this.getLoginBtn().click();
    }
}

export default new LoginPage();