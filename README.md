[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/37vDen4S)
# Final Team Project for CS5500

Login with your Northeastern credentials and read the project description [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/ETUqq9jqZolOr0U4v-gexHkBbCTAoYgTx7cUc34ds2wrTA?e=URQpeI).

## List of features

All the features you have implemented. 

| Feature   | Description     | E2E Tests      | Component Tests | Jest Tests     |
|-----------|-----------------|----------------|-----------------|----------------|
| View Posts | A list of all questions asked can be viewed ans sorted by several criteria | path/to/test | client/cypress/component/question_page.cy.js | Endpoints: GET /question/getQuestion Test paths: server/tests/newQuestion.test.js  |
| Create new Post | Logged in users can post new questions | /path/to/test | client/cypress/component/new_question.cy.js | Endpoints: POST /question/addQuestion Test paths: server/tests/newQuestion.test.js |
| Search for existing posts | Users can filter questions by keywords and tags | /path/to/test | client/cypress/component/header.cy.js, client/cypress/component/fake_so.cy.js | Endpoints: GET /question/getQuestion Test paths: server/tests/question.test.js, server/tests/newQuestion.test.js |
| Commenting on posts | Users can post answers on posted questions | /path/to/test | client/cypress/component/answer_page.cy.js, client/cypress/component/new_answer.cy.js | Endpoints: POST /answer/addAnswer  Test paths: server/tests/answer.test.js, server/tests/newAnswer.test.js |
| Voting on pools | Users can upvote and downvote other user's posts | /path/to/test | client/cypress/component/answer_page.cy.js | Endpoints: POST /question/upvote, POST /question/downvote, POST /answer/downvote, POST /answer/upvote Test paths: server/tests/question.test.js, server/tests/answer.test.js |
| Tagging posts | Users can tag questions and view all tags on the tag page | /path/to/test | client/cypress/component/tag_page.cy.js, client/cypress/component/question_page.cy.js, client/component/answer_page.cy.js | Endpoints: POST question/addTags, GET tag/getTagsWithQuestionNumber Test paths: server/tests/newQuestion.test.js server/tests/tags.test.js |
| User profile | Users can signup, login, and view their profiles | client/cypress/e2e/userProfile.cy.js | client/cypress/component/user_profile.cy.js, client/cypress/component/login.cy.js, client/cypress/component/signup_page.cy.js | Endpoints: POST signup/signup, POST login/login, POST login/logout, POST login/csrf-token, GET user/getUserById:uid, POST user/changeUsername, POST user/changeProfilePicture Test paths: server/tests/user.test.js, server/tests/login.test.js, server/tests/signup.test.js |
| Post moderation | Users with over 10,000 can delete other user's posts and edit tags on posts | /path/to/test | client/cypress/component/answer_page.cy.js | Endpoints: POST answer/deleteAnswer, POST question/deleteQuestion, POST question/removeTag, POST question/addTag Test paths: server/tests/answer.test.js, server/tests/newQuestion.test.js |


## Instructions to generate and view coverage report 

# Jest coverage report
Open a terminal and cd to the `/server`. Then, run the command `npx jest --coverage --runInBand --forceExit`. When the command finished running, a code coverage report will be generated in `server/coverageIcov-report/server`. open the `index.html` file in this directory to view the code coverage report

## Extra Credit Section (if applicable)