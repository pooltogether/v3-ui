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
    const locizeApiKey = process.env.NEXT_JS_LOCIZE_DEV_API_KEY
    let locizeProps = {}
    if (locizeApiKey) {
      locizeProps = {
        apikey: locizeApiKey,
        saveMissing: 'true'
      }
    }
      


    return (
      <Html
        
      >
        <Head />
        <script
          {...locizeProps}
          id='locizify'
          projectid='4436efaa-7b18-4332-a5e2-57437e041619'
          debug='false'
          referencelng='en'
          fallbacklng='en'
          src='https://unpkg.com/locizify@^4.0.7'
        />
        <Meta />
        <body
          className='bg-body'
        >
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }

}

export default MyDocument
