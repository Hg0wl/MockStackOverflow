import AnswerPage from "../../src/components/main/answerPage";
import AnswerHeader from "../../src/components/main/answerPage/header";
import QuestionBody from "../../src/components/main/answerPage/questionBody";
import Vote from "../../src/components/main/answerPage/vote";

it('Answer Header component shows question title, number of views, and onclick function', () => {
    const title = 'android studio save string shared preference, start activity and load the saved string';
    const handleNewQuestionSpy = cy.spy().as('handleNewQuestionSpy');
    const views = 42;
    const asked = new Date('Jan 17, 2024 03:24')
    
    cy.mount(<AnswerHeader 
        title_text={title}
        handleNewQuestion={handleNewQuestionSpy}
        views={views}
        ask_date_time={asked}
    />);
        
    cy.get('.a_header_row .bold_title').contains(title);
    cy.get('.bluebtn').click();
    cy.get('@handleNewQuestionSpy').should('have.been.called');
    cy.get('.a_header_second_row').contains(`Viewed ${views} times`)
    cy.get('#ask_time').contains('Asked Jan 17 at 03:24')
})

it ('Component should have a question body which shows question text, asked by, asked time, and tags', () => {
    const text = 'test text'
    const askedBy = {
        _id: 3,
        username: 'testuser',
        // default profile picture source
        profile_pic: "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg"
    }
    const askDate = new Date()
    const tags = [{
        _id: 3,
        name: 'shared-preferences'
    },
    {
        _id: 1,
        name: 'javascript'
    }]
    const numAnswers = 42

    cy.mount(<QuestionBody
        text={text}
        askBy={askedBy}
        tagsInit={tags}
        numAnswers={numAnswers}
        meta={askDate}
    />)
    cy.get('.answer_question_text > div').contains(text);
    cy.get('.num_answers').contains(numAnswers + ' Answers')
    cy.get('.question_author').contains(askedBy.username)
    cy.get('.profile_image').should('exist')
    cy.get('.question_tags').contains(tags[0].name)
    cy.get('.question_tags').contains(tags[1].name)

})

it('QuestionBody has voting buttons and vote count', () => {
    const text = 'test text'
    const askedBy = {
        _id: 3,
        username: 'testuser',
        // default profile picture source
        profile_pic: "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg",
        reputation: 11000
    }
    const tags = [{
        _id: 3,
        name: 'shared-preferences'
    },
    {
        _id: 1,
        name: 'javascript'
    }]
    const initVotes = 42



    cy.mount(<QuestionBody
        text={text}
        askBy={askedBy}
        tagsInit={tags}
        initVotes={initVotes}
    />)

    cy.get('.big-vote-count').contains(initVotes)
})

it('Voting buttons correspond to appropriate function calls', () => {
    const handleUpvoteSpy = cy.spy().as('handleUpvoteSpy')
    const handleDownvoteSpy = cy.spy().as('handleDownvoteSpy')
    const handleLoginSpy = cy.spy().as('handleLoginSpy')
    const initVoteStatus = "upvote"
    const initVotes = 42

    cy.mount(<Vote
        handleUpvote={handleUpvoteSpy}
        handleDownvote={handleDownvoteSpy}
        initVoteStatus={initVoteStatus}
        initVotes={initVotes}
        handleLogin={handleLoginSpy}
        loggedInUser={""}
    />)

    cy.get('.vote-button').click()
    cy.get('@handleLoginSpy').should('have.been.called')
    cy.get('.selected-vote-button').click()
    cy.get('@handleLoginSpy').should('have.been.called')

})