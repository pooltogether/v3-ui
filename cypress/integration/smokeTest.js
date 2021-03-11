describe('Smoke Test', () => {
  // If user's DAI balance is 0 the Deposit button will be disabled, skip to withdrawal test
  function _connectWallet() {
    cy.visit('/')

    // /* Connect Wallet */
    cy.get('#_navAccountButton').click()
    cy.contains('Connect wallet').click()
    cy.contains('Web3 Wallet').click()
    cy.contains('0x0fd1..c048')
  }

  it('connects wallet and revokes token allowance', () => {
    _connectWallet()

    /* View Pools#index & DAI Pool#show */
    cy.get('#_navPoolsButton').click()
    cy.wait(2000)
    cy.get('#_viewPT-cDAIPool').click()

    /* Revoke Previous Allowance */
    cy.wait(10000)
    cy.scrollTo(0, 50000)
    cy.wait(2000)
    cy.scrollTo(0, 50000)

    cy.get('body').then((body) => {
      if (body.find('#_revokePoolAllowance').length > 0) {
        cy.get('#_revokePoolAllowance').click()

        cy.get('body').should('not.contain', 'Revoke DAI allowance')
      }
    })
  })

  it('approves and deposits', () => {
    _connectWallet()

    /* View Pools#index & DAI Pool#show */
    cy.get('#_navPoolsButton').click()
    cy.wait(2000)
    cy.get('#_viewPT-cDAIPool').click()

    /* Get Tickets */
    cy.get('#_getTickets').click()
    cy.get('#_setMaxDepositAmount').click()
    cy.contains('Continue').click()

    // If we successfully revoked the allowance in test #1 then we can approve allowance here
    cy.get('body').then((body) => {
      if (body.find('#_approveTokenAllowance').is(':not(:disabled)')) {
        cy.get('#_approveTokenAllowance').click()
        cy.wait(40000)

        _tryDeposit()
      } else {
        _tryDeposit()
      }
    })
  })

  // If user's DAI balance is 0 the Deposit button will be disabled, skip to withdrawal test
  function _tryDeposit() {
    cy.get('body').then((body) => {
      if (body.find('#_depositToken').is(':not(:disabled)')) {
        cy.get('#_depositToken').click()

        /* Order Complete & View Account */
        cy.contains('You got')
        cy.contains('View your account').click()
        cy.contains('Winning odds:')
      }
    })
  }

  it('withdraws', () => {
    _connectWallet()

    // Wait for subgraph state to settle
    cy.wait(5000)

    cy.get('body').then((body) => {
      if (body.find('#_ticketsBlankState').length > 0) {
        cy.contains('You currently have no tickets')
      }
    })

    /* Withdraw */
    cy.get('body').then((body) => {
      if (body.find('#_accountPT-cDAITicket').length > 0) {
        cy.get('#_accountPT-cDAITicket').then(($btn) => {
          $btn.click()

          cy.get('#_setMaxWithdrawAmount').click()
          cy.contains('Continue').click()

          cy.get('._withdrawBtn').then(($btn) => {
            // Path 1: No early exit fee, full withdrawal amount
            if ($btn.hasClass('_confirmNoFee')) {
              $btn.click()
              // Path 2: Getting dinged early exit fee:
            } else if ($btn.hasClass('_confirmWithFee')) {
              $btn.click()
              cy.get('#_withdrawIUnderstand').click()
              cy.contains('Continue').click()
            }

            cy.contains('Successfully withdrawn!')
            cy.contains('Back to my account').click()
          })
        })
      }
    })
  })
})
