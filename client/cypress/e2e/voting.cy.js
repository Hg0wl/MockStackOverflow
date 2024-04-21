describe("Voting Tests", () => {
    beforeEach(() => {
      cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
      cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
    });
  
    afterEach(() => {
      //clear the database after each test
      cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    });

    it("11.1 | Questions display correct number of votes", () => {
        const votes = [
          -1,
          0,
          1,
          -1
        ];
       
        cy.visit("http://localhost:3000");
    
        cy.get(".vote-stat").each(($el, index, $list) => {
          cy.wrap($el).should("contain", `${votes[index]} votes`);
        });
    });
    
    it("11.2 | Creating a new question has 0 votes", () => {
        const votes = [
          0,
          -1,
          0,
          1,
          -1
        ];
    
        cy.visit("http://localhost:3000");
        
        // Sign up
        cy.contains("Signup").click();
        cy.get("#signupUsernameInput").type("somebodyNew");
        cy.get("#signupPasswordInput").type("testPassword");
        cy.get("#signupPasswordConfirm").type("testPassword");
        cy.get(".login-form-button").click();
     
        cy.wait(1000); 
    
        // Add a Question
        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("Test Question A");
        cy.get("#formTextInput").type("Test Question A Text");
        cy.get("#formTagInput").type("tag1");
        cy.contains("Post Question").click();
    
        cy.get(".vote-stat").each(($el, index, $list) => {
          cy.wrap($el).should("contain", `${votes[index]} votes`);
        });
    });
    
    it("11.3 | Clicking upvote increments the question's vote by 1", () => {
        cy.visit("http://localhost:3000");
    
        // Sign up
        cy.contains("Signup").click();
        cy.get("#signupUsernameInput").type("somebodyNew");
        cy.get("#signupPasswordInput").type("testPassword");
        cy.get("#signupPasswordConfirm").type("testPassword");
        cy.get(".login-form-button").click();
     
        cy.wait(1000); 
    
        // Verify votes
        cy.get(".vote-stat").eq(0).should("contain", '-1 votes');
        cy.contains("Quick question about storage on android").click();
        cy.get('.vote-button').eq(0).click();
        cy.get('.big-vote-count').should("contain", '0');
    
        cy.get(".selected-vote-button").eq(0).click();
        cy.contains('-1');
    });
    
    it("11.4 | Clicking downvote decrements the question's vote by 1", () => {
        cy.visit("http://localhost:3000");
    
        // Sign up
        cy.contains("Signup").click();
        cy.get("#signupUsernameInput").type("somebodyNew");
        cy.get("#signupPasswordInput").type("testPassword");
        cy.get("#signupPasswordConfirm").type("testPassword");
        cy.get(".login-form-button").click();
     
        cy.wait(1000); 
    
        // Verify votes
        cy.get(".vote-stat").eq(0).should("contain", '-1 votes');
        cy.contains("Quick question about storage on android").click();
        cy.get('.vote-button').eq(1).click();
        cy.get('.big-vote-count').should("contain", '-2');
    
        cy.get(".selected-vote-button").eq(0).click();
        cy.contains('-1');
    });
});