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
          <link rel="stylesheet" type="text/css" href="static/reset.css" />
          <link rel="stylesheet" type="text/css" href="/static/pace/pace.css" />
        </Head>
        <body>
          <Main />
          <script type="text/javascript" src="/static/pace/pace.min.js" />
          <NextScript />
        </body>
      </html>
    );
  }
}
