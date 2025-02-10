class StorePage{

    elements={
        addToCartButton: '[data-test-name="add-to-cart-button"]',    
        qtySelect: '.MuiSelect-selectMenu',
    };

    getProductCard(productName: string){
        return cy.get(".product-card-content")
            .contains(productName, {matchCase:false})
            .parentsUntil('[data-test-name="product-card"]')
            .last().parent();
    }

    navigateToSection(section: string){
        cy.get('.MuiTab-wrapper').contains(section, {matchCase:false}).click();
    }

    getToastMessage(message: string){
        return cy.contains('#snackbar-fab-message-id', message);
    }
    dismissToastMessage(){
        cy.get('.MuiSnackbarContent-action').click();
    }

    /*** CART  */
    getBuyBtn(){
        return cy.get('.buy-button')
    }
}

export default new StorePage();