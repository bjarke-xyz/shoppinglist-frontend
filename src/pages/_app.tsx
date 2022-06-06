import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Shopping List" />
        <meta name="keywords" content="Shopping list" />
        <title>Shopping List</title>

        <link rel="manifest" href="/manifest.json" />
        <link
          href="/AppImages/ios/16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/AppImages/ios/32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/AppImages/ios/512.png"></link>
        <meta name="theme-color" content="#34D399" />
      </Head>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default MyApp;
