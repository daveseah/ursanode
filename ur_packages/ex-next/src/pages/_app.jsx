/*///////////////////////////////// ABOUT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*\

  NextJS Material UI Custom Application Template
  based on:
  https://github.com/mui-org/material-ui/blob/master/examples/nextjs

\*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ * /////////////////////////////////////*/

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import App from 'next/app';
import Head from 'next/head';
///
import fetch from 'cross-fetch';
import UR from '@ursanode/ursys/client';
///
import { create } from 'jss';
import extend from 'jss-plugin-extend';
import {
  StylesProvider,
  jssPreset,
  ThemeProvider
} from '@material-ui/core/styles';
///
import CssBaseline from '@material-ui/core/CssBaseline';
import { useURSubscribe } from '../hooks/use-ursys';
///
import theme from '../modules/style/theme';
import { SITE } from './_navmenu.json';
// simulation components
import APPSTATE from '../modules/appstate';
import SIM from '../modules/sim/_sim_system';

/// DEBUG UTILS ///////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const PR = UR.util.PROMPTS.makeLogHelper('_APP');
UR.util.PROMPTS.printTagColors();

/// EXTRA: ADD EXTRA JSS PLUGINS //////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/// from https://material-ui.com/styles/advanced/#jss-plugins
const jss = create({
  plugins: [...jssPreset().plugins, extend()]
});

/// COMPONENT EXPORT //////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export default function MyApp(props) {
  const { Component, pageProps, netProps } = props;
  // NOTE: effects execute only on client after MyApp has completely rendered,
  // but window is not accessible in

  // client-side remove the server-side injected CSS (_app mounts once)
  useEffect(() => {
    // MUI styles
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    // URSYS start
    // 1. Boot URSYS lifecycle independ nt of React
    if (UR.URSYS_Initialize([SIM, APPSTATE])) {
      UR.SystemBoot({
        autoRun: true,
        netProps
      });
    }

    // useEffect unmounting action: URSYS shutdown
    return function cleanup() {
      console.log(...PR('unmounting _app'));
      UR.SystemUnload();
      UR.URSYS_Shutdown();
    };
  }, []);

  function handleHello(data) {
    console.log(...PR('RESPONSE "HELLO_URSYS"'));
    let out = '. got';
    Object.keys(data).forEach(key => {
      out += ` [${key}]:${data[key]}`;
    });
    console.log(...PR(out));
    data._app = 'hello from _app';
    return data;
  }
  useURSubscribe('HELLO_URSYS', handleHello);

  // render app wrapped with our providers
  return (
    <StylesProvider jss={jss}>
      <Head>
        <title>{SITE.title}</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} store={APPSTATE} />
      </ThemeProvider>
    </StylesProvider>
  );
}

/// GET URSYS INFO ////////////////////////////////////////////////////////////
/// NOTE: this disables automatic static optimization
/// in the _app.js context, getInitialProps doesn't have pageProps ever
/// This ONLY EXECUTES ON THE SERVER and props are sent as a bundle to
/// hydrate MyApp
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
MyApp.getInitialProps = async ctx => {
  // ctx contains Component, router, pageProps
  const appProps = await App.getInitialProps(ctx);
  const netProps = await fetch('http://localhost:3000/urnet/getinfo').then(res =>
    res.json()
  );
  return { ...appProps, netProps };
};

/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired
};
