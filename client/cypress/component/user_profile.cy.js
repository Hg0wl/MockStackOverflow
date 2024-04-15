import UserProfile from "../../src/components/main/userProfile";
import UserHeader from "../../src/components/main/userProfile/userHeader";
import ListItem from "../../src/components/main/userProfile/userHeader/qaList/listItem";

it('User Profile Header contains username, joinDate, and reputation', () => {
    const username = 'testUser'
    const joinDate = new Date('Jan 17, 2024 03:24')
    const reputation = 42

    cy.mount(<UserHeader
        username={username}
        joinDate={joinDate}
        reputation={reputation}
    />)
    cy.get('.header-username').contains('testUser')
    cy.get('.user-header-meta').contains('Joined Jan 17 at 03:24')
    cy.get('.user-header-meta').contains(`${reputation} Reputation`)

})

it('Clicking edit icon turns on editing mode', () => {
    const username = 'testUser'
    const joinDate = new Date('Jan 17, 2024 03:24')
    const reputation = 42
    const profile_pic = "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg"

    cy.mount(<UserHeader
        picture={profile_pic}
        username={username}
        joinDate={joinDate}
        reputation={reputation}
        currentUser={true}
    />)
    cy.get('#startEditing').click()
    cy.get('.username-input').should('have.value', username)
    cy.get('.username-input').should('have.attr', 'placeholder').and('equal', 'Enter Username...')
    cy.get('#changeProfileDoneBtn')
    cy.get('#changeProfileCancelBtn')
})

it('New usernames cannot be empty error message renders', () => {
    const username = 'testUser'
    const joinDate = new Date('Jan 17, 2024 03:24')
    const reputation = 42
    const profile_pic = "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg"

    cy.mount(<UserHeader
        picture={profile_pic}
        username={username}
        joinDate={joinDate}
        reputation={reputation}
        currentUser={true}
    />)
    cy.get('#startEditing').click()
    cy.get('#newUsernameInput').clear()
    cy.get('#changeProfileDoneBtn').click()
    cy.get('.username-error-profile').contains('New username cannot be empty')
})

it('List Items includes votes, date, and responds to function call', () => {
    const votes = 42
    const date = new Date('Jan 17, 2024 03:24')
    const handleAnswerSpy = cy.spy().as('handleAnswerSpy')
    const title = 'test title'


    cy.mount(<ListItem
        votes={votes}
        title={title}
        date={date}
        handleAnswer={handleAnswerSpy}
    />)
    cy.get('.list-votes').contains(votes)
    cy.get('.list-title').click()
    cy.get('@handleAnswerSpy').should('have.been.called')
    cy.get('.list-title').contains(title)
    cy.get('.list-meta').contains('Jan 17')
})