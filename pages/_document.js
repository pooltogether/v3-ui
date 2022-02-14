// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

import Document, { Html, Head, Main, NextScript } from 'next/document'

import { Meta } from 'lib/components/Meta'
import React from 'react'

class MyDocument extends Document {
  render() {
    const title = 'PoolTogether App'
    const url = `https://app.pooltogether.com`
    const description = `Win $ every week just by saving your money.`
    const keywords = 'ethereum'
    const twitterHandle = '@PoolTogether_'

    return (
      <Html>
        <Head>
          <link rel='icon' href='/favicon.png' type='image/x-icon' />
          <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
          <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
          <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
          <link rel='manifest' href='/site.webmanifest' />

          <meta httpEquiv='Pragma' content='no-cache' />
          <meta httpEquiv='cache-control' content='no-cache, no-store, must-revalidate' />

          <meta name='theme-color' content='#1e0b43' />
          <meta name='description' content={description} />
          <meta name='keywords' content={keywords} />
          <meta name='author' content='PoolTogether' />

          <meta property='og:title' content={title} />
          <meta property='og:description' content={description} />
          <meta property='og:site_name' content={title} />
          <meta property='og:url' content={url} />
          <meta property='og:type' content='website' />
          <meta
            property='og:image'
            content={`${url}/pooltogether-facebook-share-image-1200-630@2x.png`}
          />
          <meta property='og:rich_attachment' content='true' />
          <meta property='og:image:width' content='1200' />
          <meta property='og:image:height' content='630' />

          <meta property='twitter:title' content={title} />
          <meta property='twitter:description' content={description} />
          <meta property='twitter:card' content='summary_large_image' />
          <meta property='twitter:site' content={twitterHandle} />
          <meta
            property='twitter:image:src'
            content={`${url}/pooltogether-twitter-share-image-1200-675@2x.png`}
          />
          <meta property='twitter:url' content={url} />
          <meta property='twitter:creator' content={twitterHandle} />
        </Head>
        <body className='bg-body text-inverse'>
          <Meta />

          <Main />
          <NextScript />
          <script src='/confetti.js'></script>

          <canvas className='confettiCanvas' width='1' height='1' />
        </body>
      </Html>
    )
  }
}

export default MyDocument
