import AppBar from "@/components/AppBar";
import { ChakraProvider } from "@chakra-ui/react";
import { ProvideAuth } from "lib/Auth";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";

// if (process.env.NODE_ENV === "development" && global.process === undefined) {
//   const { worker } = require("../mocks/browser");
//   worker.start();
// }
const queryClient = new QueryClient();
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ProvideAuth>
        <ChakraProvider>
          <AppBar />
          <div className="container mx-auto max-w-4xl p-4">
            <Component {...pageProps} />
          </div>
        </ChakraProvider>
      </ProvideAuth>
    </QueryClientProvider>
  );
}

export default MyApp;
