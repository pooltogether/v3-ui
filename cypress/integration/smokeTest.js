describe('Smoke Test', () => {
  it('successfully runs through primary functionality', () => {
    cy.visit('/')

    // /* Connect Wallet */
    cy.get('#_navAccountButton').click()
    cy.contains('Connect wallet').click()
    cy.contains('Show More').click()
    cy.contains('Web3 Wallet').click()
    cy.contains('0x0fd1..c048')

    /* View Pools#index & DAI Pool#show */
    cy.get('#_navPoolsButton').click()
    cy.wait(2000)
    cy.get('#_viewPT-cDAIPool').click()
    
    /* Revoke Previous Allowance */
    cy.wait(10000)
    cy.scrollTo(0, 50000)
    cy.wait(2000)
    cy.scrollTo(0, 50000)
    cy.get('#_revokePoolAllowance')
      .should(($btn) => {
        $btn.click()
      })

    cy.wait(20000)
    cy.scrollTo(0, 0)
    cy.wait(1000)
    cy.scrollTo(0, 0)

    /* Get Tickets */
    cy.get('#_getTickets').click()
    cy.get('#_setMaxDepositAmount').click()
    cy.contains('Continue').click()
    cy.get('#_approveTokenAllowance').click()
    cy.get('#_depositToken').click()

    /* Order Complete & View Account */
    cy.contains('You got')
    cy.contains('View your account').click()
    cy.contains('Winning odds:')

    /* Withdraw */
    cy.get('#_accountPT-cDAITicket').click()
    cy.get('#_setMaxWithdrawAmount').click()
    cy.contains('Continue').click()


    
    cy.get('html')
      .should('have.id', '_withdrawAnywayBtn')
      .then(() => {
        cy.get('#_withdrawAnywayBtn').click()
        cy.get('#_withdrawIUnderstand').click()
        cy.contains('Continue').click()
      })

    cy.get('html')
      .should('have.id', '_confirmWithdrawalBtn')
      .then(() => {
        cy.get('#_confirmWithdrawalBtn').click()
      })

    cy.contains('Successfully withdrawn!')
    cy.contains('Back to my account').click()
  })
})
