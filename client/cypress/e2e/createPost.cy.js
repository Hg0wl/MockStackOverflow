describe("Posting Tests", () => {
    beforeEach(() => {
      cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
      cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
    });
  
    afterEach(() => {
      //clear the database after each test
      cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    });

    it("2.1 | Adds multiple questions one by one and displays them in All Questions", () => {
        cy.visit("http://localhost:3000");
        
        // Sign up
        cy.contains("Signup").click();
        cy.get("#signupUsernameInput").type("somebodyNew");
        cy.get("#signupPasswordInput").type("testPassword");
        cy.get("#signupPasswordConfirm").type("testPassword");
        cy.get(".login-form-button").click();
    
        cy.wait(1000);
    
        // Add Questions
        cy.contains("Ask a Question").click();
        cy.get('#formTitleInput').type("Test Question 1");
        cy.get("#formTextInput").type("Test Question 1 Text");
        cy.get("#formTagInput").type("javascript");
        cy.contains("Post Question").click();
    
        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("Test Question 2");
        cy.get("#formTextInput").type("Test Question 2 Text");
        cy.get("#formTagInput").type("react");
        cy.contains("Post Question").click();
    
        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("Test Question 3");
        cy.get("#formTextInput").type("Test Question 3 Text");
        cy.get("#formTagInput").type("java");
        cy.contains("Post Question").click();
    
        cy.wait(500)
        // Verify all questions are added and appear in "newest" order
        //cy.contains("Fake Stack Overflow"); // verify web page title for test
        const qTitles = [
          "Test Question 3",
          "Test Question 2",
          "Test Question 1",
          "Quick question about storage on android",
          "Object storage for a web application",
          "android studio save string shared preference, start activity and load the saved string",
          "Programmatically navigate using React router",
        ];
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
    
        // Verify "Unanswered" order button shows unanswered questions only
        cy.contains("Unanswered").click();
        cy.wait(500)
        const qTitlesUnanswered = [
          "Test Question 3",
          "Test Question 2",
          "Test Question 1",
        ];
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitlesUnanswered[index]);
        });
    });
    
    it("2.2 | Ask a Question creates and displays expected meta data", () => {
        cy.visit("http://localhost:3000");
    
        // Sign up
        cy.contains("Signup").click();
        cy.get("#signupUsernameInput").type("somebodyNew");
        cy.get("#signupPasswordInput").type("testPassword");
        cy.get("#signupPasswordConfirm").type("testPassword");
        cy.get(".login-form-button").click();
    
        cy.wait(1000);
    
        // Create question
        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("Test Question Q1");
        cy.get("#formTextInput").type("Test Question Q1 Text T1");
        cy.get("#formTagInput").type('javascript');
        cy.contains("Post Question").click();
        
        //cy.contains('Mock Stack Overflow');
        cy.contains("5 questions");
        cy.contains("asked 0 seconds ago");
    
        const answers = [
          "0 answers",
          "1 answers",
          "2 answers",
          "3 answers",
          "2 answers",
        ];
        const views = [
          "0 views",
          "103 views",
          "200 views",
          "121 views",
          "10 views",
        ];
        cy.get(".postStats").each(($el, index, $list) => {
          cy.wrap($el).should("contain", answers[index]);
          cy.wrap($el).should("contain", views[index]);
        });
        cy.contains("Unanswered").click();
        cy.wait(500)
        cy.get(".postTitle").should("have.length", 1);
        cy.contains("1 question");
    });
    
    it("2.3 | Ask a Question with empty title shows error", () => {
        cy.visit("http://localhost:3000");
    
        // Sign up
        cy.contains("Signup").click();
        cy.get("#signupUsernameInput").type("somebodyNew");
        cy.get("#signupPasswordInput").type("testPassword");
        cy.get("#signupPasswordConfirm").type("testPassword");
        cy.get(".login-form-button").click();
    
        cy.wait(1000);
    
        // Create question
        cy.contains("Ask a Question").click();
        cy.get('#formTextInput').type("Test Question 1 Text Q1");
        cy.get('#formTagInput').type('javascript');
        cy.contains("Post Question").click();
        cy.contains("Title cannot be empty");
    });

    it("9.1 | Adds a question with a hyperlink and verifies", () => {
        cy.visit("http://localhost:3000");
    
        // Sign up
        cy.contains("Signup").click();
        cy.get("#signupUsernameInput").type("somebodyNew");
        cy.get("#signupPasswordInput").type("testPassword");
        cy.get("#signupPasswordConfirm").type("testPassword");
        cy.get(".login-form-button").click();
     
        cy.wait(1000);
    
        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("How to add a hyperlink in Markdown?");
        cy.get("#formTextInput").type(
          "Here is a link: [Google](https://www.google.com)"
        );
        cy.get("#formTagInput").type("markdown");
        cy.contains("Post Question").click();
        cy.contains("How to add a hyperlink in Markdown?").click();
        cy.get("#questionBody")
          .find("a")
          .should("have.attr", "href", "https://www.google.com");
    });

    it("9.3 | Tries to add a question with an invalid hyperlink and verifies failures", () => {
        const invalidUrls = [
          "[Google](htt://www.google.com)",
          "[Microsoft](microsoft.com)",
          "[](https://www.google.com/)",
          "[link]()",
          "dfv[]()",
          "[link](http://www.google.com/)",
          "[Google](https//www.google.com)",
          "[GitHub](http//github.com)",
          "[Facebook](https:/facebook.com)",
          "[Twitter](://twitter.com)",
          "[Netflix](htps://www.netflix)",
          "[Google](htts://www.goo<gle.com)",
          "[Google](http://www.google)",
          "[Dropbox](ttps://www.dropbox.c-m)",
          "[LinkedIn](ps:/www.linkedin.com)",
          "[Adobe](ttps://www.adobe..com)",
          "[Spotify](ttp:///www.spotify.com)",
          "[Reddit](http://reddit)",
          "[Wikipedia](tps://www.wikipedia=com)",
        ];
        cy.visit("http://localhost:3000");
    
        // Sign up
        cy.contains("Signup").click();
        cy.get("#signupUsernameInput").type("somebodyNew");
        cy.get("#signupPasswordInput").type("testPassword");
        cy.get("#signupPasswordConfirm").type("testPassword");
        cy.get(".login-form-button").click();
     
        cy.wait(1000); 
    
        // Create new question w/ invalid hyperlink
        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type(
          "How to add an invalid hyperlink in Markdown?"
        );
        invalidUrls.forEach((url) => {
          cy.get("#formTextInput").clear().type(`This is an invalid link: ${url}`);
          cy.get("#formTagInput").clear().type("markdown");
          cy.contains("Post Question").click();
          cy.contains("Invalid hyperlink");
        });
        cy.visit("http://localhost:3000");
        cy.contains("How to add an invalid hyperlink in Markdown?").should(
          "not.exist"
        );
    });

    it("9.5 | Adds multiple questions with valid hyperlinks and verify", () => {
        cy.visit("http://localhost:3000");
    
        // Sign up
        cy.contains("Signup").click();
        cy.get("#signupUsernameInput").type("somebodyNew");
        cy.get("#signupPasswordInput").type("testPassword");
        cy.get("#signupPasswordConfirm").type("testPassword");
        cy.get(".login-form-button").click();
     
        cy.wait(1000); 
    
        // List of question data
        const questions = [
          {
            title: "Test Question 1",
            text: "Test Question 1 Text [Google](https://www.google.com)",
            tag: "javascript",
            link: "https://www.google.com",
          },
          {
            title: "Test Question 2",
            text: "Test Question 2 Text [Yahoo](https://www.yahoo.com)",
            tag: "react",
            link: "https://www.yahoo.com",
          },
          {
            title: "How to add a hyperlink in Markdown?",
            text: "Here is a link: [Google](https://www.google.com)",
            tag: "markdown",
            link: "https://www.google.com",
          },
        ];
    
        // Add multiple questions with hyperlinks
        questions.forEach((question) => {
          cy.contains("Ask a Question").click();
          cy.get("#formTitleInput").type(question.title);
          cy.get("#formTextInput").type(question.text);
          cy.get("#formTagInput").type(question.tag);
          cy.contains("Post Question").click();
        });
    
        cy.contains("Questions").click();
        questions.reverse().forEach((q) => {
          cy.contains(q.title).click();
          cy.get("#questionBody").find("a").should("have.attr", "href", q.link);
          cy.contains("Questions").click();
        });
    });


});