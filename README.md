[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/37vDen4S)
# Final Team Project for CS5500

Login with your Northeastern credentials and read the project description [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/ETUqq9jqZolOr0U4v-gexHkBbCTAoYgTx7cUc34ds2wrTA?e=URQpeI).

## List of features

All the features you have implemented. 

| Feature   | Description     | E2E Tests      | Component Tests | Jest Tests     |
|-----------|-----------------|----------------|-----------------|----------------|
| View Posts | A list of all questions asked can be viewed ans sorted by several criteria | path/to/test | client/cypress/component/question_page.cy.js | server/tests/question.test.js  |
| Create new Post | Logged in users can post new questions | /path/to/test | client/cypress/component/new_question.cy.js | server/tests/newQuestion.test.js   |
| Search for existing posts | Users can filter questions by keywords and tags | /path/to/test | client/cypress/component/header.cy.js, client/cypress/component/fake_so.cy.js | server/tests/question.test.js |
| Commenting on posts | Users can post answers on posted questions | /path/to/test | client/cypress/component/answer_page.cy.js, client/cypress/component/new_answer.cy.js | server/tests/answer.test.js, server/tests/newAnswer.test.js |
| Voting on pools | Users can upvote and downvote other user's posts | /path/to/test | client/component/answer_page.cy.js | server/tests/question.test.js, server/tests/answer.test.js |
| Tagging posts | Users can tag questions and view all tags on the tag page | /path/to/test | client/component/tag_page.cy.js, client/component/question_page.cy.js, client/component/answer_page.cy.js | server/tests/tags.test.js |
| User profile | Users can signup, login, and view their profiles | /path/to/test | client/component/user_profile.cy.js, client/component/login.cy.js, client/component/signup_page.cy.js | server/tests/user.test.js, server/tests/login.test.js, server/tests/signup.test.js |
| Post moderation | Users with over 10,000 can delete other user's posts and edit tags on posts | /path/to/test | client/component/answer_page.cy.js | server/tests/answer.test.js, server/tests/question.test.js |


## Instructions to generate and view coverage report 

## Extra Credit Section (if applicable)