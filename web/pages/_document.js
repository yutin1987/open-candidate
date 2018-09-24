/* eslint-disable react/no-danger */

import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page =
      renderPage(App => props => sheet.collectStyles(<App {...props} />));
    const styles = sheet.getStyleElement();

    return { ...page, styles };
  }

  render() {
    return (
      <html lang="zh-TW">
        <Head>
          <meta property="og:title" content="全台最大募款遊戲上線啦！" />
          <meta property="og:description" content="你好，我是曾柏瑜！目前是新北市第8選區市議員候選人" />
          <meta property="og:image" content="/static/fb.png" />
          <link rel="stylesheet" type="text/css" href="static/reset.css" />
          <link rel="stylesheet" type="text/css" href="/static/pace/pace.css" />
        </Head>
        <body>
          <Main />
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-126257898-1" />
          <script dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'UA-126257898-1');
            `,
          }}
          />
          <script type="text/javascript" src="/static/pace/pace.min.js" />
          <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/phaser/3.10.1/phaser.min.js" />
          <NextScript />
        </body>
      </html>
    );
  }
}
