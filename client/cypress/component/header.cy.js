import Header from '../../src/components/header'

it('header shows search bar and title', () => {
    const setQuestionPageSpy = cy.spy().as('setQuestionPageSpy')
    const searchQuery = ''
    
    cy.mount(<Header search={searchQuery} setQuestionPage={setQuestionPageSpy} />)
    cy.get('#searchBar').should('have.value', searchQuery)
    cy.get('.search_bar').should('have.attr', 'placeholder')
})

it('search bar shows search text entered by user', () => {
    const setQuesitonPageSpy = cy.spy().as('setQuesitonPageSpy')
    const searchQuery = 'test search'
    cy.mount(<Header 
                search={searchQuery} 
                setQuesitonPage={setQuesitonPageSpy}/>)
    cy.get('.search_bar').should('have.value', searchQuery)
    cy.get('.search_bar').should('have.attr', 'placeholder');
    cy.get('.search_bar').clear()
    cy.get('.search_bar').type('Search change')
    cy.get('.search_bar').should('have.value', 'Search change')
})