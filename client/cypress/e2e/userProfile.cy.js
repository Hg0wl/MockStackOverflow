describe("Tests for viewing the user profile", () => {
  beforeEach(() => {
    cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
  });

  afterEach(() => {
    //clear the database after each test
    cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
  });

  it("Opens user profile from questions page", () => {
    cy.visit("http://localhost:3000");

    // Sign up
    cy.contains("Yoshi").click();

    cy.wait(1000);

    cy.contains("Yoshi").should("be.visible");
    cy.contains("Joined Nov 12 at 03:30:00").should("be.visible");
    cy.contains("450 Reputation").should("be.visible");
  });

  it("Opens user profile from answer page question", () => {
    cy.visit("http://localhost:3000");

    // Sign up
    cy.contains("Programmatically navigate using React router").click();

    cy.wait(1000);

    cy.contains("Yoshi").click();

    cy.contains("Yoshi").should("be.visible");
    cy.contains("Joined Nov 12 at 03:30:00").should("be.visible");
    cy.contains("450 Reputation").should("be.visible");
  });

  it("Opens user profile from answer page answer", () => {
    cy.visit("http://localhost:3000");

    // Sign up
    cy.contains("Programmatically navigate using React router").click();

    cy.wait(1000);

    cy.contains("Blue Toad").click();

    cy.contains("Blue Toad").should("be.visible");
    cy.contains("Joined Nov 20 at 03:24:4").should("be.visible");
    cy.contains("250 Reputation").should("be.visible");
  });

  it("Generates a user profile for a new user, accesses it from header, and updates question/answer lists", () => {
    cy.visit("http://localhost:3000");

    // Sign up
    cy.contains("Signup").click();
    cy.get("#signupUsernameInput").type("somebodyNew");
    cy.get("#signupPasswordInput").type("testPassword");
    cy.get("#signupPasswordConfirm").type("testPassword");
    cy.get(".login-form-button").click();

    cy.wait(1000);

    //Access profile from header
    cy.get("#header").find(".profile-wrapper").find(".profile-banner").click();

    //Check profile is correct
    cy.contains("somebodyNew").should("be.visible");
    cy.contains("0 Reputation").should("be.visible");

    //Acces Question page
    cy.get("#menu_question").click();

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

    //Acces user profile
    cy.get("#header").find(".profile-wrapper").find(".profile-banner").click();
    cy.wait(500);

    //Check user question and answer lists
    cy.get(".qaList").each(($el, index, $list) => {
      if (index == 0) {
        cy.wrap($el).find(".qalist-title").should("contain", "Questions");
        cy.wrap($el).find(".list-subtitle").should("contain", "2");
        cy.wrap($el)
          .find(".list-container")
          .children()
          .its("length")
          .should("eq", 2);
        cy.wrap($el)
          .find(".list-container")
          .each(($el, index, $list), () => {
            if (index == 0) {
              cy.wrap($el)
                .find(".list-title")
                .should("contain", "Test Question B");
            } else {
              cy.wrap($el)
                .find(".list-title")
                .should("contain", "Test Question A");
            }
          });
      } else {
        cy.wrap($el)
          .find(".list-container")
          .children()
          .should("have.length", 0);
      }
    });

    cy.get(".qaList").each(($el, index, $list) => {
      if (index == 0) {
        cy.wrap($el)
          .find(".list-container")
          .each(($el, index, $list), () => {
            if (index == 0) {
              cy.wrap($el).find(".list-title").first().click();
            }
          });
      }
    });

    //Add an answer to Q1
    cy.contains("Answer Question").click();
    cy.get("#answerTextInput").type("Question answer 1");
    cy.contains("Post Answer").click();

    //Add another answer to Q1
    cy.contains("Answer Question").click();
    cy.get("#answerTextInput").type("Question answer 2");
    cy.contains("Post Answer").click();

    //Acces user profile
    cy.get("#header").find(".profile-wrapper").find(".profile-banner").click();
    cy.wait(500);

    //Check user question and answer lists
    cy.get(".qaList").each(($el, index, $list) => {
      if (index == 0) {
        cy.wrap($el).find(".qalist-title").should("contain", "Questions");
        cy.wrap($el).find(".list-subtitle").should("contain", "2");
        cy.wrap($el)
          .find(".list-container")
          .children()
          .its("length")
          .should("eq", 2);
        cy.wrap($el)
          .find(".list-container")
          .each(($el, index, $list), () => {
            if (index == 0) {
              cy.wrap($el)
                .find(".list-title")
                .should("contain", "Test Question A");
            } else {
              cy.wrap($el)
                .find(".list-title")
                .should("contain", "Test Question B");
            }
          });
      } else {
        cy.wrap($el).find(".qalist-title").should("contain", "Answers");
        cy.wrap($el).find(".list-subtitle").should("contain", "1");
        cy.wrap($el)
          .find(".list-container")
          .children()
          .should("have.length", 1);
        cy.wrap($el)
          .find(".list-container")
          .each(($el, index, $list), () => {
            cy.wrap($el)
              .find(".list-title")
              .should("contain", "Test Question B");
          });
      }
    });

    //In Mod e2e tests, check that deleting questions still updates lists
  });
});
