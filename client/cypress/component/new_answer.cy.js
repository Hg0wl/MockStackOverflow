import React from "react";
import NewAnswer from "../../src/components/main/newAnswer";

it('mounts', () => {
    cy.mount(<NewAnswer/>)
    cy.get('#answerTextInput')
    cy.get('.form_postBtn')
})

it('shows error message when both input is empty', () => {
    cy.mount(<NewAnswer/>)
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('Answer text cannot be empty')
})

it('shows error message when text is empty', () => {
    cy.mount(<NewAnswer/>)
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('Answer text cannot be empty')
})

it('shows text inputted by user', () => {
    cy.mount(<NewAnswer/>)
    cy.get('#answerTextInput').should('have.value', '')
    cy.get('#answerTextInput').type('abc')
    cy.get('#answerTextInput').should('have.value', 'abc')
})

