describe("Commenting Tests", () => {
    beforeEach(() => {
      cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
      cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
    });
  
    afterEach(() => {
      //clear the database after each test
      cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    });

    it("5.1 | Created new answer should be displayed at the top of the answers page", () => {
        const answers = [
          "Test Answer 1",
          "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.",
          "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.",
        ];
        cy.visit("http://localhost:3000");
    
         // Sign up
        cy.contains("Signup").click();
        cy.get("#signupUsernameInput").type("somebodyNew");
        cy.get("#signupPasswordInput").type("testPassword");
        cy.get("#signupPasswordConfirm").type("testPassword");
        cy.get(".login-form-button").click();
    
        cy.wait(1000);
    
        // Create new answer
        cy.contains("Programmatically navigate using React router").click();
        cy.contains("Answer Question").click();
        cy.get("#answerTextInput").type(answers[0]);
        cy.contains("Post Answer").click();
        cy.get(".answerText").each(($el, index) => {
          cy.contains(answers[index]);
        });
        cy.contains("0 seconds ago");
      });
    
    it("5.2 | Answer is mandatory when creating a new answer", () => {
        cy.visit("http://localhost:3000");
    
        // Sign up
        cy.contains("Signup").click();
        cy.get("#signupUsernameInput").type("somebodyNew");
        cy.get("#signupPasswordInput").type("testPassword");
        cy.get("#signupPasswordConfirm").type("testPassword");
        cy.get(".login-form-button").click();
    
        cy.wait(1000);
    
        cy.contains("Programmatically navigate using React router").click();
        cy.contains("Answer Question").click();
        cy.contains("Post Answer").click();
        cy.contains("Answer text cannot be empty");
    });

    
    it("6.2 | Checks if a6 and a7 exist in q3 answers page", () => {
        const answers = [
          "Using GridFS to chunk and store content.",
          "Storing content as BLOBs in databases.",
        ];
        cy.visit("http://localhost:3000");
        cy.contains("Object storage for a web application").click();
        cy.get(".answerText").each(($el, index) => {
          cy.contains(answers[index]);
        });
    });
    
    it("6.3 | Checks if a8 exists in q4 answers page", () => {
        cy.visit("http://localhost:3000");
        cy.contains("Quick question about storage on android").click();
        cy.contains("Store data in a SQLLite database.");
    });


    it("9.2 | Create new answer should be displayed at the top of the answers page", () => {
        const answers = [
          "Check this link for more info: [Documentation](https://docs.example.com)",
          "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.",
          "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.",
        ];
        cy.visit("http://localhost:3000");
    
        // Sign up
        cy.contains("Signup").click();
        cy.get("#signupUsernameInput").type("somebodyNew");
        cy.get("#signupPasswordInput").type("testPassword");
        cy.get("#signupPasswordConfirm").type("testPassword");
        cy.get(".login-form-button").click();
     
        cy.wait(1000); 
      
        // Create new answer
        cy.contains("Programmatically navigate using React router").click();
        cy.contains("Answer Question").click();
        cy.get("#answerTextInput").type(
          "Check this link for more info: [Documentation](https://docs.example.com)"
        );
        cy.contains("Post Answer").click();
        cy.get(".answerText")
          .first()
          .within(() => {
            cy.get("a").should("have.attr", "href", "https://docs.example.com");
          });
        cy.contains("somebodyNew");
        cy.contains("0 seconds ago");
    });

    it("9.4 | Attempts to add an answer with an invalid hyperlink and verifies failure", () => {
        cy.visit("http://localhost:3000");
    
        // Sign up
        cy.contains("Signup").click();
        cy.get("#signupUsernameInput").type("somebodyNew");
        cy.get("#signupPasswordInput").type("testPassword");
        cy.get("#signupPasswordConfirm").type("testPassword");
        cy.get(".login-form-button").click();
     
        cy.wait(1000); 
    
        // Create new answer
        cy.contains("Programmatically navigate using React router").click();
        cy.contains("Answer Question").click();
        cy.get("#answerTextInput").type(
          "Check this invalid link: [](https://wrong.url)"
        );
        cy.contains("Post Answer").click();
        cy.contains("Invalid hyperlink");
    
        cy.visit("http://localhost:3000");
        cy.contains("Programmatically navigate using React router").click();
        cy.get(".answerText").should("not.contain", "https://wrong.url");
    });

});