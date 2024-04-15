import React from "react";
import NewQuestion from "../../src/components/main/newQuestion";


it('mounts', () => {
    cy.mount(<NewQuestion/>)
    cy.get('#formTitleInput')
    cy.get('#formTextInput')
    cy.get('#formTagInput')
    cy.get('.form_postBtn');
})

it('shows title input by user', () => {
    cy.mount(<NewQuestion/>)
    cy.get('#formTitleInput').should('have.value', '')
    cy.get('#formTitleInput').type('test')
    cy.get('#formTitleInput').should('have.value', 'test')
})

it('shows text input by user', () => {
    cy.mount(<NewQuestion/>)
    cy.get('#formTextInput').should('have.value', '')
    cy.get('#formTextInput').type('testValue')
    cy.get('#formTextInput').should('have.value', 'testValue')
})

it('shows tags input by user', () => {
    cy.mount(<NewQuestion/>)
    cy.get('#formTagInput').should('have.value', '')
    cy.get('#formTagInput').type('test')
    cy.get('#formTagInput').should('have.value', 'test')
})

it('shows error message when inputs are empty', () => {
    cy.mount(<NewQuestion/>)
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('Title cannot be empty')
    cy.get('div .input_error').contains('Question text cannot be empty')
})

it('shows error message when title is more than 100 characters', () => {
    cy.mount(<NewQuestion/>)
    cy.get('#formTitleInput').type('a'.repeat(101))
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('Title cannot be more than 100 characters')
})

it('shows error message when there are more than five tags', () => {
    cy.mount(<NewQuestion/>)
    cy.get('#formTagInput').type('a b c d e f')
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('Cannot have more than 5 tags')
})

it('shows error message when a tag is longer than 20 characters', () => {
    cy.mount(<NewQuestion/>)
    cy.get('#formTagInput').type('a'.repeat(21))
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('New tag length cannot be more than 20')
})




