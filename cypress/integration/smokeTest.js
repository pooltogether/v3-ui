describe('Smoke Test', () => {
  // it('connects wallet and revokes token allowance', () => {
  //   cy.visit('/')

  //   // /* Connect Wallet */
  //   cy.get('#_navAccountButton').click()
  //   cy.contains('Connect wallet').click()
  //   cy.contains('Show More').click()
  //   cy.contains('Web3 Wallet').click()
  //   cy.contains('0x0fd1..c048')

  //   /* View Pools#index & DAI Pool#show */
  //   cy.get('#_navPoolsButton').click()
  //   cy.wait(2000)
  //   cy.get('#_viewPT-cDAIPool').click()
    
  //   /* Revoke Previous Allowance */
  //   cy.wait(10000)
  //   cy.scrollTo(0, 50000)
  //   cy.wait(2000)
  //   cy.scrollTo(0, 50000)
  //   cy.get('#_revokePoolAllowance')
  //     .should(($btn) => {
  //       $btn.click()
  //     })
  // })

  // it('approves and deposits', () => {
  //   cy.visit('/')

  //   // /* Connect Wallet */
  //   cy.get('#_navAccountButton').click()
  //   cy.contains('Connect wallet').click()
  //   cy.contains('Show More').click()
  //   cy.contains('Web3 Wallet').click()
  //   cy.contains('0x0fd1..c048')

  //   /* View Pools#index & DAI Pool#show */
  //   cy.get('#_navPoolsButton').click()
  //   cy.wait(2000)
  //   cy.get('#_viewPT-cDAIPool').click()

  //   /* Get Tickets */
  //   cy.get('#_getTickets').click()
  //   cy.get('#_setMaxDepositAmount').click()
  //   cy.contains('Continue').click()

  //   // If we successfully revoked the allowance in test #1 then we can approve allowance here
  //   cy.get('#_approveTokenAllowance')
  //     .should(($btn) => {
  //       $btn.click()
  //     })

  //   // If user's DAI balance is 0 the Deposit button will be disabled, skip to withdrawal test
  //   cy.get('#_depositToken')
  //     .should(($btn) => {
  //       $btn.click()

  //       /* Order Complete & View Account */
  //       cy.contains('You got')
  //       cy.contains('View your account').click()
  //       cy.contains('Winning odds:')
  //     })
  // })

  it('withdraws', () => {
    cy.visit('/')

    // /* Connect Wallet */
    cy.get('#_navAccountButton').click()
    cy.contains('Connect wallet').click()
    cy.contains('Show More').click()
    cy.contains('Web3 Wallet').click()
    cy.contains('0x0fd1..c048')

    /* Withdraw */
    cy.get('#_accountPT-cDAITicket').click()
    cy.get('#_setMaxWithdrawAmount').click()
    cy.contains('Continue').click()

    // wait()
    // const listItemTitle = '[data-cy-component=list-item-title]';
    // if (Cypress.$(listItemTitle).length > 0) {
    //   cy.get(listItemTitle).each(($el, index, $list) => {
    //     cy.wrap($el).then(($span) => {
    //       const spanText = $span.text();
    //       cy.log(`index: ` + index + ' ' + spanText);
    //     });
    //   });
    // }

    // Path 1: Getting dinged early exit fee:
    cy.get('#_withdrawAnywayBtn').then(($btn) => {
      console.log($btn)
      if ($btn) {
        console.log('yes')
        $btn.click()
        cy.get('#_withdrawIUnderstand').click()
        cy.contains('Continue').click()
      }
    })

    // Path 2: No early exit fee, full withdrawal amount
    cy.get('#_confirmWithdrawalBtn').then(($btn) => {
      console.log($btn)
      if ($btn) {
        console.log('yes')
        $btn.click()
        // cy.contains('Continue').click()
      }
    })

    cy.contains('Successfully withdrawn!')
    cy.contains('Back to my account').click()
  })
})
