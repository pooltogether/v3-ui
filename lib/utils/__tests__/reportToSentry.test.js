import { reportToSentry } from '../reportToSentry'

jest.mock('@sentry/browser', () => ({
  captureException: jest.fn(),
  configureScope: jest.fn(),
}));

describe('reportToSentry', () => {
  it('works', async () => {
    await reportToSentry('1')
  })
})
