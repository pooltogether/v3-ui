// import { reportToSentry } from '../reportToSentry'

// jest.mock('@sentry/browser', () => ({
//   captureException: jest.fn(),
//   configureScope: jest.fn(),
// }));

describe('reportToSentry', () => {
  xit('works', async () => {
    await reportToSentry('1')
  })
})
