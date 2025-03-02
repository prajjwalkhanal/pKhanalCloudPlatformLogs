// src/pages/_app.js
import '../styles/global.css';  // Import the global CSS here

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
