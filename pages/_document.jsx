// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { Meta } from 'lib/components/Meta'

class MyDocument extends Document {

  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />
        <body
          className='bg-body'
        >
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
