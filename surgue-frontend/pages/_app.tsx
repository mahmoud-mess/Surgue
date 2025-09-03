import type { AppProps } from 'next/app';
import '../styles/globals.css';

/**
 * The custom App component initializes pages[cite: 239].
 * It's the ideal place to import global CSS files[cite: 240].
 * @param {AppProps} { Component, pageProps } - The page component and its props[cite: 240].
 * @returns The rendered page component with global styles.
 */
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;