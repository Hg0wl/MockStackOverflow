describe("Tagging Tests", () => {
    beforeEach(() => {
      cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
      cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
    });
  
    afterEach(() => {
      //clear the database after each test
      cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    });

    it("7.1 | Adds a question with tags, checks the tags existed", () => {
        cy.visit("http://localhost:3000");
    
        // Sign up
        cy.contains("Signup").click();
        cy.get("#signupUsernameInput").type("somebodyNew");
        cy.get("#signupPasswordInput").type("testPassword");
        cy.get("#signupPasswordConfirm").type("testPassword");
        cy.get(".login-form-button").click();
    
        cy.wait(1000);
    
        // add a question with tags
        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("Test Question A");
        cy.get("#formTextInput").type("Test Question A Text");
        cy.get("#formTagInput").type("test1 test2 test3");
        cy.contains("Post Question").click();
    
        // clicks tags
        cy.contains("Tags").click();
        cy.contains("test1");
        cy.contains("test2");
        cy.contains("test3");
    });
    
    it("7.2 | Checks if all tags exist", () => {
        cy.visit("http://localhost:3000");
        // all tags exist in the page
        cy.contains("Tags").click();
        cy.contains("react", { matchCase: false });
        cy.contains("javascript", { matchCase: false });
        cy.contains("android-studio", { matchCase: false });
        cy.contains("shared-preferences", { matchCase: false });
        cy.contains("storage", { matchCase: false });
        cy.contains("website", { matchCase: false });
        cy.contains("Flutter", { matchCase: false });
    });
    
    it("7.3 | Checks if all questions exist inside tags", () => {
        cy.visit("http://localhost:3000");
        // all question no. should be in the page
        cy.contains("Tags").click();
        cy.contains("7 Tags");
        cy.contains("1 question");
        cy.contains("2 question");
        cy.contains("0 question");
    });
    
    it("8.1 | Clicking on tags in the tag page searches for the tag", () => {
        cy.visit("http://localhost:3000");
        // all question no. should be in the page
        cy.contains("Tags").click();
        cy.contains("react").click();
        cy.contains("Programmatically navigate using React router");
    });
    
    it("8.2 | Clicking on tags in the tag page searches for the tag", () => {
        cy.visit("http://localhost:3000");
        // all question no. should be in the page
        cy.contains("Tags").click();
        cy.contains("storage").click();
        cy.contains("Quick question about storage on android");
        cy.contains("Object storage for a web application");
    });
    
    it("8.3 | Create a new question with a new tag and finds the question through the tag", () => {
        cy.visit("http://localhost:3000");
    
        // Sign up
        cy.contains("Signup").click();
        cy.get("#signupUsernameInput").type("somebodyNew");
        cy.get("#signupPasswordInput").type("testPassword");
        cy.get("#signupPasswordConfirm").type("testPassword");
        cy.get(".login-form-button").click();
    
        cy.wait(1000);
    
        // add a question with tags
        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("Test Question A");
        cy.get("#formTextInput").type("Test Question A Text");
        cy.get("#formTagInput").type("test1-tag1");
        cy.contains("Post Question").click();
    
        // clicks tags
        cy.contains("Tags").click();
        cy.contains("test1-tag1").click();
        cy.contains("Test Question A");
    });

    it("10.1 | Clicks on a tag and verifies the tag is displayed", () => {
        const tagNames = "javascript";
    
        cy.visit("http://localhost:3000");
        cy.contains("Tags").click();
    
        cy.contains(tagNames).click();
        cy.get(".question_tags").each(($el, index, $list) => {
          cy.wrap($el).should("contain", tagNames);
        });
    });
    
    it("10.2 | Clicks on a tag in homepage and verifies the questions related tag is displayed", () => {
        const tagNames = "storage";
    
        cy.visit("http://localhost:3000");
    
        //clicks the 3rd tag associated with the question.
        cy.get(".question_tag_button").eq(2).click();
    
        cy.get(".question_tags").each(($el, index, $list) => {
          cy.wrap($el).should("contain", tagNames);
        });
    });
    
});