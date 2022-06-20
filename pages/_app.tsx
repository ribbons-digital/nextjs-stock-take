import AppBar from "@/components/AppBar";
import { ChakraProvider } from "@chakra-ui/react";
import { ProvideAuth } from "lib/Auth";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

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
