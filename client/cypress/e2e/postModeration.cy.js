describe("Edit Tags", () => {
  beforeEach(() => {
    cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
  });

  afterEach(() => {
    //clear the database after each test
    cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
  });

  it("Doesn't add any tags on an empty input", () => {
    cy.visit("http://localhost:3000");

    // Log back in
    cy.contains("Login").click();
    cy.get("#login-username-input").type("Mod");
    cy.get("#login-password-input").type("password");
    cy.get(".login-form-button").click();
    cy.wait(1000);

    cy.contains("Quick question about storage on android").click();
    cy.wait(500);

    //Adds no tags
    cy.get("#edit-tags-button").click();
    cy.get("#tag-edit-done").click();

    cy.get(".question_tag_button_full").its("length").should("eq", 4);
  });

  it("Adds new tags to question", () => {
    cy.visit("http://localhost:3000");

    // Log back in
    cy.contains("Login").click();
    cy.get("#login-username-input").type("Mod");
    cy.get("#login-password-input").type("password");
    cy.get(".login-form-button").click();
    cy.wait(1000);

    cy.contains("Quick question about storage on android").click();
    cy.wait(500);

    //Adds no tags
    cy.get("#edit-tags-button").click();
    cy.get("#new-tag-input").type("new tags");
    cy.get("#tag-edit-done").click();

    cy.get(".question_tag_button_full").its("length").should("eq", 6);
    cy.get(".question_tag_button_full").eq(4).should("contain", "tags");
    cy.get(".question_tag_button_full").eq(3).should("contain", "new");
  });

  it("Rejects bad tag inputs", () => {
    cy.visit("http://localhost:3000");

    // Log back in
    cy.contains("Login").click();
    cy.get("#login-username-input").type("Mod");
    cy.get("#login-password-input").type("password");
    cy.get(".login-form-button").click();
    cy.wait(1000);

    cy.contains("Quick question about storage on android").click();
    cy.wait(500);

    //Adds no tags
    cy.get("#edit-tags-button").click();
    cy.get("#new-tag-input").type("123456789012345678901234567890");
    cy.get("#tag-edit-done").click();

    cy.get(".question_tag_button_full").its("length").should("eq", 3);
    cy.get(".question_tags").should(
      "contain",
      "New tag length cannot be more than 20"
    );

    cy.get("#new-tag-input").clear();
    cy.get("#new-tag-input").type("more than five");
    cy.get("#tag-edit-done").click();

    cy.get(".question_tag_button_full").its("length").should("eq", 3);
    cy.get(".question_tags").should(
      "contain",
      "Cannot have more than 5 tags"
    );
  })

  it("Deletes already existing tags", () => {
    cy.visit("http://localhost:3000");

    // Log back in
    cy.contains("Login").click();
    cy.get("#login-username-input").type("Mod");
    cy.get("#login-password-input").type("password");
    cy.get(".login-form-button").click();
    cy.wait(1000);

    cy.contains("Quick question about storage on android").click();
    cy.wait(500);

    //Adds no tags
    cy.get("#edit-tags-button").click();
    cy.get(".question_tag_button_full").eq(2).click();
    cy.get("#tag-edit-done").click();

    cy.get(".question_tag_button_full").its("length").should("eq", 3);
  })
});

describe("Delete Post", () => {
  beforeEach(() => {
    cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
  });

  afterEach(() => {
    //clear the database after each test
    cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
  });

  it("Properly deletes answers and all of their references", () => {
    cy.visit("http://localhost:3000");

    // Sign up
    cy.contains("Signup").click();
    cy.get("#signupUsernameInput").type("somebodyNew");
    cy.get("#signupPasswordInput").type("testPassword");
    cy.get("#signupPasswordConfirm").type("testPassword");
    cy.get(".login-form-button").click();

    cy.wait(500);

    // Add Questions
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question 1");
    cy.get("#formTextInput").type("Test Question 1 Text");
    cy.get("#formTagInput").type("javascript");
    cy.contains("Post Question").click();
    cy.wait(500);

    cy.contains("Test Question 1").click();

    cy.contains("Answer Question").click();
    cy.get("#answerTextInput").type("Test answer 1");
    cy.contains("Post Answer").click();

    cy.contains("Answer Question").click();
    cy.get("#answerTextInput").type("Test answer 2");
    cy.contains("Post Answer").click();

    //Log out
    cy.get("#header").find(".profile-wrapper").find(".logout-button").click();
    cy.wait(500);

    // Log back in
    cy.contains("Login").click();
    cy.get("#login-username-input").type("Mod");
    cy.get("#login-password-input").type("password");
    cy.get(".login-form-button").click();
    cy.wait(1000);

    cy.contains("Test Question 1").click();

    cy.get(".trash-icon").eq(1).click();

    //Removed from question's answer page
    cy.get(".question-container").children().its("length").should("eq", 4);

    //Updates on question page
    cy.get(".menu-button-container").eq(0).click();
    cy.wait(500);
    cy.get("#question_list").children().eq(0).contains("1 answers");

    //Does not change user page because there is still an answer on that question
    cy.get("#question_list").children().eq(0).contains("somebodyNew").click();
    cy.get(".qaList").each(($el, index, $list) => {
      if (index == 1) {
        cy.wrap($el).find(".qalist-title").should("contain", "Answers");
        cy.wrap($el).find(".list-subtitle").should("contain", "1");
        cy.wrap($el)
          .find(".list-container")
          .children()
          .its("length")
          .should("eq", 1);
        cy.wrap($el)
          .find(".list-container")
          .each(($el, index, $list), () => {
            cy.wrap($el)
              .find(".list-title")
              .should("contain", "Test Question 1");
          });
      }
    });

    cy.contains("Test Question 1").click();

    //Deleting the other answer should update the user profile
    cy.get(".trash-icon").eq(1).click();
    cy.contains("somebodyNew").click();

    cy.get(".qaList").each(($el, index, $list) => {
      if (index == 1) {
        cy.wrap($el).find(".qalist-title").should("contain", "Answers");
        cy.wrap($el).find(".list-subtitle").should("contain", "0");
      }
    });
  });

  it("Properly deletes a question and all of its references", () => {
    cy.visit("http://localhost:3000");

    // Sign up
    cy.contains("Signup").click();
    cy.get("#signupUsernameInput").type("somebodyNew");
    cy.get("#signupPasswordInput").type("testPassword");
    cy.get("#signupPasswordConfirm").type("testPassword");
    cy.get(".login-form-button").click();

    cy.wait(500);

    // Add Questions
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question 1");
    cy.get("#formTextInput").type("Test Question 1 Text");
    cy.get("#formTagInput").type("javascript");
    cy.contains("Post Question").click();
    cy.wait(500);

    // Add Questions
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question 2");
    cy.get("#formTextInput").type("Test Question 2 Text");
    cy.get("#formTagInput").type("react");
    cy.contains("Post Question").click();
    cy.wait(500);

    cy.get("#question_list").children().its("length").should("eq", 6);

    //Log out
    cy.get("#header").find(".profile-wrapper").find(".logout-button").click();
    cy.wait(500);

    // Log back in
    cy.contains("Login").click();
    cy.get("#login-username-input").type("Mod");
    cy.get("#login-password-input").type("password");
    cy.get(".login-form-button").click();
    cy.wait(1000);

    cy.contains("Test Question 1").click();
    cy.wait(500);
    cy.get(".trash-icon").click();

    //Check that question is no longer on the home page
    cy.get("#question_list").children().its("length").should("eq", 5);
    cy.get("#question_list").children().eq(0).contains("Test Question 2");

    cy.get("#question_list").children().eq(0).contains("somebodyNew").click();
    //Check that question is removed from user profile
    cy.get(".qaList").each(($el, index, $list) => {
      if (index == 0) {
        cy.wrap($el).find(".qalist-title").should("contain", "Questions");
        cy.wrap($el).find(".list-subtitle").should("contain", "1");
        cy.wrap($el)
          .find(".list-container")
          .children()
          .its("length")
          .should("eq", 1);
        cy.wrap($el)
          .find(".list-container")
          .each(($el, index, $list), () => {
            cy.wrap($el)
              .find(".list-title")
              .should("contain", "Test Question 2");
          });
      }
    });
  });
});
