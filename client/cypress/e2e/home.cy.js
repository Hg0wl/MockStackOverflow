// End to End Tests

describe("Home Page Tests", () => {
  beforeEach(() => {
    cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
  });

  afterEach(() => {
    //clear the database after each test
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
});
