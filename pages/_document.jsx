// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { Meta } from 'lib/components/Meta'

import TheGraphLogo from 'assets/images/thegraphlogo.png'

class MyDocument extends Document {

  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <>
            <script
              type="text/javascript"
              src="/graph-error-modal.js"
            />
          </>
        </Head>
        <body
          className='bg-body'
        >
          <div
            id='graph-error-modal'
            className='hidden w-screen h-screen'
            style={{
              zIndex: 199
            }}
          >
            <div
              className={'fixed t-0 l-0 r-0 b-0 w-full h-full z-30 bg-overlay bg-blur'}
              style={{
                zIndex: 198
              }}
            />

            <div
              className='graph-modal fixed xs:inset-4 bg-black text-white border-2 border-green rounded-lg px-6 py-4 font-bold mt-32'
              style={{
                height: '20rem',
                zIndex: 200
              }}
            >
              <div
                className='flex flex-col items-center justify-center h-full text-center'
              >
                <span>
                  <img
                    src={TheGraphLogo}
                    alt='The Graph Protocol'
                    className='w-24 h-auto mx-auto mb-4'
                  />
                  PoolTogether relies on The Graph Protocol. Unfortunately, we are temporarily unable to fetch data from The Graph Protocol. 
                  <div
                    className='mt-4'
                  >
                    Please try again soon...
                  </div>
                  <a
                    href='https://status.thegraph.com/'
                    className='inline-block border-b border-green hover:border-0 text-xxs mt-10'
                    target='_blank'
                    rel='noreferrer noopener'
                  >View Graph status</a>
                </span>
              </div>
            </div>
          </div>

          <Main />
          <NextScript />
          <script src='/confetti.js'></script>

          <canvas
            className='confettiCanvas'
            width='1'
            height='1'
          />
          <Meta />

          {/* <div
            className='sm:hidden h-20 l-0 r-0 b-0 fixed flex items-center justify-center'
            id='button-portal'
            style={{
              zIndex: 123141241
            }}
          /> */}
        </body>
      </Html>
    )
  }

}

export default MyDocument
