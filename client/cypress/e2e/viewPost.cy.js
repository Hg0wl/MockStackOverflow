describe("Viewing Posts", () => {
    beforeEach(() => {
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
    });

    afterEach(() => {
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    });

    it('1.1 | Signsup, adds three questions and one asnwer, then clicks "Questions", then click unanswered button, verifies sequence of questions', () => {
        cy.visit("http://localhost:3000");
    
        // Sign up
        cy.contains("Signup").click();
        cy.get("#signupUsernameInput").type("somebodyNew");
        cy.get("#signupPasswordInput").type("testPassword");
        cy.get("#signupPasswordConfirm").type("testPassword");
        cy.get(".login-form-button").click();
    
        cy.wait(1000);
    
        // Add Q1
        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("Test Question A");
        cy.get("#formTextInput").type("Test Question A Text");
        cy.get("#formTagInput").type("javascript");
        cy.contains("Post Question").click();
    
        // Add Q2
        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("Test Question B");
        cy.get("#formTextInput").type("Test Question B Text");
        cy.get("#formTagInput").type("javascript");
        cy.contains("Post Question").click();
    
        // Add Q3
        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("Test Question C");
        cy.get("#formTextInput").type("Test Question C Text");
        cy.get("#formTagInput").type("javascript");
        cy.contains("Post Question").click();
    
        // Add an answer to question 1
        cy.contains("Test Question A").click();
        cy.contains("Answer Question").click();
        cy.get("#answerTextInput").type("Answer Question 1");
        cy.contains("Post Answer").click();
    
        // Go back to home page
        cy.contains("Questions").click();
    
        // Click 'unanswered'
        cy.contains("Unanswered").click();
        const qTitles = ["Test Question C", "Test Question B"];
        cy.wait(1000);
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });

    it("1.2 | Check if questions are displayed in descending order of dates", () => {
        const questionTitles = [
          'Quick question about storage on android',
          'Object storage for a web application',
          'android studio save string shared preference, start activity and load the saved string',
          'Programmatically navigate using React router',
        ];
    
        cy.visit("http://localhost:3000");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", questionTitles[index]);
        });
      });
    
    it("1.3 | successfully shows all questions in model in active order", () => {
        const questionTitles = [
          "Programmatically navigate using React router",
          "android studio save string shared preference, start activity and load the saved string",
          "Quick question about storage on android",
          "Object storage for a web application",
        ];
        cy.visit("http://localhost:3000");
        cy.contains("Active").click();
        cy.get('.postTitle').each(($el, index, $list) => {
          cy.wrap($el).should("contain", questionTitles[index]);
        });
    });

    it("6.1 | Adds a question, click active buttion, and verifies question sequence", () => {
        cy.visit("http://localhost:3000");
    
        // Sign up
        cy.contains("Signup").click();
        cy.get("#signupUsernameInput").type("somebodyNew");
        cy.get("#signupPasswordInput").type("testPassword");
        cy.get("#signupPasswordConfirm").type("testPassword");
        cy.get(".login-form-button").click();
    
        cy.wait(1000);
        
        // add a question
        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("Test Question A");
        cy.get("#formTextInput").type("Test Question A Text");
        cy.get("#formTagInput").type("javascript");
        cy.contains("Post Question").click();
    
        // add an answer to question of React Router
        cy.contains("Programmatically navigate using React router").click();
        cy.contains("Answer Question").click();
        cy.get("#answerTextInput").type("Answer to React Router");
        cy.contains("Post Answer").click();
    
        // go back to main page
        cy.contains("Questions").click();
    
        // add an answer to question of Android Studio
        cy.contains(
          "android studio save string shared preference, start activity and load the saved string"
        ).click();
        cy.contains("Answer Question").click();
        cy.get("#answerTextInput").type("Answer to android studio");
        cy.contains("Post Answer").click();
    
        // go back to main page
        cy.contains("Questions").click();
    
        // add an answer to question A
        cy.contains("Test Question A").click();
        cy.contains("Answer Question").click();
        cy.get("#answerTextInput").type("Answer Question A");
        cy.contains("Post Answer").click();
    
        // go back to main page
        cy.contains("Questions").click();
    
        // clicks active
        cy.contains("Active").click();
    
        const qTitles = [
          "Test Question A",
          "android studio save string shared preference, start activity and load the saved string",
          "Programmatically navigate using React router",
          "Quick question about storage on android",
          "Object storage for a web application",
        ];
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
      
});