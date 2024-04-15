import Tag from "../../src/components/main/tagPage/tag";

it('Rendering Tag Component', () => {
    const tag = {
        name: 'testTag',
        qcnt: 4
    }
    const clickTagSpy = cy.spy().as('clickTagSpy')

    cy.mount(<Tag
        t={tag}
        clickTag={clickTagSpy}
    />)

    cy.get('.tagName').contains(tag.name)
    cy.get('.tagNode').contains(`${tag.qcnt} questions`)
    cy.get('.tagNode').click()
    cy.get('@clickTagSpy').should('have.been.called')

})