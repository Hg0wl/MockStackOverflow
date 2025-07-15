# Final Team Project for CS5500

## List of features

All the features you have implemented. 

| Feature   | Description     | E2E Tests      | Component Tests | Jest Tests     |
|-----------|-----------------|----------------|-----------------|----------------|
| View Posts | A list of all questions asked can be viewed ans sorted by several criteria | client/cypress/e2e/viewPost.cy.js | client/cypress/component/question_page.cy.js | Endpoints: GET /question/getQuestion Test paths: server/tests/newQuestion.test.js  |
| Create new Post | Logged in users can post new questions | client/cypress/e2e/createPost.cy.js | client/cypress/component/new_question.cy.js | Endpoints: POST /question/addQuestion Test paths: server/tests/newQuestion.test.js |
| Search for existing posts | Users can filter questions by keywords and tags | client/cypress/e2e/searchPost.cy.js | client/cypress/component/header.cy.js, client/cypress/component/fake_so.cy.js | Endpoints: GET /question/getQuestion Test paths: server/tests/question.test.js, server/tests/newQuestion.test.js |
| Commenting on posts | Users can post answers on posted questions | client/cypress/e2e/answerPost.cy.js | client/cypress/component/answer_page.cy.js, client/cypress/component/new_answer.cy.js | Endpoints: POST /answer/addAnswer  Test paths: server/tests/answer.test.js, server/tests/newAnswer.test.js |
| Voting on posts | Users can upvote and downvote other user's posts | client/cypress/e2e/voting.cy.js | client/cypress/component/answer_page.cy.js | Endpoints: POST /question/upvote, POST /question/downvote, POST /answer/downvote, POST /answer/upvote Test paths: server/tests/question.test.js, server/tests/answer.test.js |
| Tagging posts | Users can tag questions and view all tags on the tag page | client/cypress/e2e/tagPost.cy.js | client/cypress/component/tag_page.cy.js, client/cypress/component/question_page.cy.js, client/component/answer_page.cy.js | Endpoints: POST question/addTags, GET tag/getTagsWithQuestionNumber Test paths: server/tests/newQuestion.test.js server/tests/tags.test.js |
| User profile | Users can signup, login, and view their profiles | client/cypress/e2e/userProfile.cy.js | client/cypress/component/user_profile.cy.js, client/cypress/component/login.cy.js, client/cypress/component/signup_page.cy.js | Endpoints: POST signup/signup, POST login/login, POST login/logout, POST login/csrf-token, GET user/getUserById:uid, POST user/changeUsername, POST user/changeProfilePicture Test paths: server/tests/user.test.js, server/tests/login.test.js, server/tests/signup.test.js |
| Post moderation | Users with over 10,000 can delete other user's posts and edit tags on posts | client/cypress/e2e/postModeration.cy.js | client/cypress/component/answer_page.cy.js | Endpoints: POST answer/deleteAnswer, POST question/deleteQuestion, POST question/removeTag, POST question/addTag Test paths: server/tests/answer.test.js, server/tests/newQuestion.test.js |


## Instructions to generate and view coverage report 

### Jest coverage report
Open a terminal and cd to the `/server`. Then, run the command `npx jest --coverage --runInBand --forceExit`. When the command finished running, a code coverage report will be generated in `server/coverageIcov-report/server`. Open the `index.html` file in this directory to view the code coverage report

## Extra Credit Section (if applicable)

### Accessibility
To improve the accessibility of our application, we ensured that all of the images that we used in the app had alt text such that screen readers would be able to describe the purpose of the image
for a user that was visually impaired. Additionaly, we ensured that all of our forms, which includes the login and signup, create answer, create question forms, had symbols demarkating the required fields.
We also ensured that all of our interactive elements were easily identifiable such that any users that might be using only a keyboard to navigate would not be confused on what was in focus. To do so, we 
made sure that no buttons or links were empty of text and that there was obvious visible styling when an interactable element was in focus, like making the backgrounds of buttons change colors or highlighting
a user input field. 

Accessibility Tests: /client/cypress/e2e/accessibility.cy.js
