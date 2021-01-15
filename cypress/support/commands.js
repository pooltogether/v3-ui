// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import Web3 from 'web3'
import PrivateKeyProvider from 'truffle-privatekey-provider'

const INFURA_ID = Cypress.env('infura_id')

// This is a Rinkeby address: _never_ send real ether to this! obviously :)
const PRIVATE_KEY_TEST_NEVER_USE =
  'd28009de0cb6b100f521c275a9c68d2990be141a840f6ad8365822f08b47b461'

// sets up the injected provider to be a mock ethereum provider with the given mnemonic/index
Cypress.Commands.overwrite('visit', (original, url, options) => {
  return original(
    url.startsWith('/') && url.length > 2 && !url.startsWith('/#') ? `/#${url}` : url,
    {
      ...options,
      onBeforeLoad(win) {
        options && options.onBeforeLoad && options.onBeforeLoad(win)
        win.localStorage.clear()
        const p = new PrivateKeyProvider(PRIVATE_KEY_TEST_NEVER_USE, `https://rinkeby.infura.io/v3/${INFURA_ID}`)
        win.web3 = new Web3(p)
      }
    }
  )
})
