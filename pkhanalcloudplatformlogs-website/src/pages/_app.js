import '../styles/global.css'; // If you have global styles

export default function MyApp({ Component, pageProps }) {
  // No useEffect needed since we're not using Mermaid or client-side diagramming anymore
  return <Component {...pageProps} />;
}