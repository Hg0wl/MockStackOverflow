import Header from '../../src/components/header'

it('header shows search bar and title', () => {
    const setQuestionPageSpy = cy.spy().as('setQuestionPageSpy')
    const searchQuery = ''
    
    cy.mount(<Header search={searchQuery} setQuestionPage={setQuestionPageSpy} />)
    cy.get('#searchBar').should('have.value', searchQuery)
    cy.get('#searchBar').shuold('have.attr', 'placeholder')
})

it('search bar shows search text entered by user', () => {
    const setQuesitonPageSpy = cy.spy().as('setQuesitonPageSpy')
    const searchQuery = 'test search'
    cy.mount(<Header 
                search={searchQuery} 
                setQuesitonPage={setQuesitonPageSpy}/>)
    cy.get('#searchBar').should('have.value', searchQuery)
    cy.get('#searchBar').should('have.attr', 'placeholder');
    cy.get('#searchBar').clear()
    cy.get('#searchBar').type('Search change')
    cy.get('#searchBar').should('have.value', 'Search change')
})