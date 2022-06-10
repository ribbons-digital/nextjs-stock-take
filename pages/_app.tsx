import { ChakraProvider } from "@chakra-ui/react";
import "../styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <div className="container mx-auto max-w-4xl p-4">
        <Component {...pageProps} />
      </div>
    </ChakraProvider>
  );
}

export default MyApp;
