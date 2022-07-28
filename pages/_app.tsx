import AppBar from "@/components/AppBar";
import { ChakraProvider } from "@chakra-ui/react";
import { ProvideAuth } from "lib/Auth";

import { withTRPC } from "@trpc/next";
import { AppType } from "next/dist/shared/lib/utils";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";
import { AppRouter } from "./api/trpc/[trpc]";

// if (process.env.NODE_ENV === "development" && global.process === undefined) {
//   const { worker } = require("../mocks/browser");
//   worker.start();
// }
const queryClient = new QueryClient();
const MyApp: AppType = ({ Component, pageProps }) => {
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
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
      url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);
