import Signup from "../../src/components/main/signupPage";

it('show input text by user', () => {
    
    const fakeFn = cy.spy().as('fakeFn')

    cy.mount(<Signup
        handleLogin={fakeFn}
        setLoggedInUser={fakeFn}
        handleQuestions={fakeFn}
    />)
    cy.get('#signupUsernameInput').should('have.value', '')
    cy.get('#signupUsernameInput').type('abc')
    cy.get('#signupUsernameInput').should('have.value', 'abc')
    cy.get('#signupPasswordInput').should('have.value', '')
    cy.get('#signupPasswordInput').type('abc')
    cy.get('#signupPasswordInput').should('have.value', 'abc')
    cy.get('#signupPasswordConfirm').should('have.value', '')
    cy.get('#signupPasswordConfirm').type('abc')
    cy.get('#signupPasswordConfirm').should('have.value', 'abc')

})

it('Clicking link to login calls appropriate function', () => {
    const handleLoginSpy = cy.spy().as('handleLoginSpy')
    const fakeFn = () => {return;}

    cy.mount(<Signup
        handleLogin={handleLoginSpy}
        setLoggedInUser={fakeFn}
        handleQuestions={fakeFn}
    />)
    
    cy.get('.link').click()
    cy.get('@handleLoginSpy').should('have.been.called')
})

it('Error message appears for non-matching passwords', () => {
    const fakeFn = () => {return;}

    cy.mount(<Signup
        handleLogin={fakeFn}
        setLoggedInUser={fakeFn}
        handleQuestions={fakeFn}
    />)
    
    cy.get('#signupUsernameInput').type('testUser')
    cy.get('#signupPasswordInput').type('testPassword')
    cy.get('#signupPasswordConfirm').type('test')
    cy.get('.login-form-button').click()
    cy.get('#signupErr').contains("Passwords don't match")
})