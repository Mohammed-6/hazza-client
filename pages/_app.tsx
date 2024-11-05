import { AuthContextProvider } from "@/context/authContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import "react-toastify/dist/ReactToastify.css";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}
