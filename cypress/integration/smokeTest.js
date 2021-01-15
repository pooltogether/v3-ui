describe('Smoke Test', () => {
  it('successfully loads & deploys a USDC pool', () => {
    cy.visit('/')

    /* Connect Wallet */
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
    cy.wait(4000)
    cy.scrollTo(0, 50000)
    cy.wait(2000)
    cy.scrollTo(0, 50000)
    cy.get('#_revokePoolAllowance').click()
    cy.wait(12000)
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
    cy.contains('Withdraw anyway').click()
    cy.get('#_withdrawIUnderstand').click()
    cy.contains('Continue').click()
    cy.contains('Successfully withdrawn!')
    cy.contains('Back to my account').click()
  })
})
