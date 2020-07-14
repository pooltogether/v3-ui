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
        <Meta />
        <body
          className='bg-body'
        >
          <script src='/confetti.js'></script>

          <canvas
            className='confettiCanvas'
            width='1'
            height='1'
          />
          
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }

}

export default MyDocument
