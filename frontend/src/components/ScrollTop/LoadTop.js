import { useEffect } from 'react';
import { useRouter } from "next/router";

function LoadTop() {
  const router = useRouter();
  const pathname = router.pathname;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default LoadTop;