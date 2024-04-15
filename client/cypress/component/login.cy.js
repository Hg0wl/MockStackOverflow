import Login from "../../src/components/main/loginPage";

it('Includes all input fields and correct button', () => {
    const handleSignupSpy = cy.spy().as('handleSignupSpy')
    const setLoggedInUserSpy = cy.spy().as('handleLoggedInUserSpy')
    const handleQuestionsSpy = cy.spy().as('handleQuestionsSpy')

    cy.mount(<Login
        handleSignup={handleSignupSpy}
        setLoggedInUser={setLoggedInUserSpy}
        handleQuestions={handleQuestionsSpy}
    />)

    cy.get('.login-panel').contains('Username')
    cy.get('.login-panel').contains('Password')
    cy.get('.link').click()
    cy.get('@handleSignupSpy').should('have.been.called')

})