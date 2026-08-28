import "@/styles/globals.css";
import "antd/dist/reset.css";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/context/AuthContext";
import Preloader from "@/components/Preloader";
import LoadTop from "@/components/ScrollTop/LoadTop";

export default function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <AuthProvider>
      {isLoading ? <Preloader /> : null}
      <LoadTop />
      {getLayout(<Component {...pageProps} />)}
    </AuthProvider>
  );
}
