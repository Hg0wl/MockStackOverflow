import QuestionPage from "../../src/components/main/questionsPage";
import QuestionHeader from "../../src/components/main/questionsPage/header";
import OrderButton from "../../src/components/main/questionsPage/header/orderButton";
import Question from "../../src/components/main/questionsPage/question";

it('Rendering Order Button', () => {
    const message = 'Test';
    const questionOrder = 'newest'
    const setQuestionOrderSpy = cy.spy('').as('setQuestionOrderSpy');

    cy.mount(<OrderButton
        message={message}
        setQuestionOrder={setQuestionOrderSpy}
        questionOrder={questionOrder}/>)
    cy.get('.btn').click()
    cy.get('@setQuestionOrderSpy').should('have.been.calledWith', message);
})

it('Rendering Question Header', () => {
    const title = 'Sample Title'
    const count = 1
    const qOrder = 'newest'

    const handleNewQuestionSpy = cy.spy().as('handleNewQuestionSpy')
    const setQuestionOrderSpy = cy.spy().as('setQuestionOrderSpy')

    cy.mount(<QuestionHeader
        title_text={title}
        qcnt={count}
        setQuestionOrder={setQuestionOrderSpy}
        handleNewQuestion={handleNewQuestionSpy}
        questionOrder={qOrder}/>)

    cy.get('.bold_title').contains(title)
    cy.get('.bluebtn').click()
    cy.get('@handleNewQuestionSpy').should('have.been.called');
    cy.get('#question_count').contains(count + ' questions')
    cy.get('.btns .btn-select').eq(0).should('have.text', 'Newest');
    cy.get('.btns .btn').eq(0).should('have.text', 'Active');
    cy.get('.btns .btn').eq(1).should('have.text', 'Unanswered');
    cy.get('.btns .btn').each(($el, index, $list) => {
        cy.wrap($el).click();
        cy.get('@setQuestionOrderSpy').should('have.been.calledWith', $el.text());
    });
})

it('Rendering Question Body', () => {
    const answers = []
    for (let index = 1; index <= 2; index++) {
        var newanswer = {
            aid: index,
            text: 'Sample Answer Text '+index,
            ansBy: 'sampleanswereduser'+index,
            ansDate: new Date(),
        };
        answers.push(newanswer);
    }
    
    const tags = []
    for (let index = 1; index <= 1; index++) {
        var newTag = { 
            tid: index,
            name: 'Sample Tag'
        };
        tags.push(newTag);
    }

    let testuser = {
        _id: 3,
        username: 'testuser',
        profile_pic: "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg"
    }

    let question = {
        _id: 1212,
        title: 'Sample Question Title',
        text: 'Sample Question Text',
        asked_by: testuser,
        ask_date_time: new Date('Jan 17, 2024 03:24'),
        views: 150,
        answers: answers,
        tags: tags,
        upvotes: [1],
        downvotes: []
    };

    const handleAnswerSpy = cy.spy().as('handleAnswerSpy')
    const clickTagSpy = cy.spy().as('clickTagSpy')
    const handleUserSpy = cy.spy().as('handleUserSpy')

    cy.mount(<Question
        q={question}
        clickTag={clickTagSpy}
        handleAnswer={handleAnswerSpy}
        handleUser={handleUserSpy}
    />)

    cy.get('.postTitle').contains(question.title)
    cy.get('.postStats').contains(answers.length + ' answers')
    cy.get('.postStats').contains(question.views + ' views')
    cy.get('.question_tags .question_tag_button').contains('Sample Tag')
    cy.get('.question_tag_button').click()
    cy.get('@clickTagSpy').should('have.been.called');
    cy.get('.question_author').click()
    cy.get('@handleUserSpy').should('have.been.called');
    cy.get('.lastActivity .question_author').contains(question.asked_by.username)
    cy.get('.lastActivity .question_meta').contains('asked Jan 17 at 03:24')
    cy.get('.postTitle').click()
    cy.get('@handleAnswerSpy').should('have.been.calledWith', question._id)
})