describe("Accessibility Tests", () => {
    beforeEach(() => {
      cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
      cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
    });
  
    afterEach(() => {
      //clear the database after each test
      cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    });

    it("Logos and decorative images have an empty alt tag", () => {
        cy.visit("http://localhost:3000");

        cy.get('.logo').should('have.attr', 'alt', '');
        cy.get('.menu-button-container > img').should('have.attr', 'alt', '');
        cy.contains("Login").click();
        cy.get('.login-logo').should('have.attr', 'alt', '');
        cy.contains("Signup").click();
        cy.get('.login-logo').should('have.attr', 'alt', '');
    });

    it("Images that have functionality have appropriate alt text", () => {
        cy.visit("http://localhost:3000");

        // Login to a moderator account
        cy.contains('Login').click();
        cy.get('#login-username-input').type('Mod');
        cy.get('#login-password-input').type('password');
        cy.get('.login-form-button').click();
        cy.get('.profile-banner > img').should('have.attr', 'alt', 'Profile Picture');
        cy.get('.logout-button').should('have.attr', 'alt', 'Logout');
        cy.get('.profile-banner').click();
        cy.get('#startEditing > img').should('have.attr', 'alt', 'Edit Username');
    });

});