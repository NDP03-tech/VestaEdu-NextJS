import { useRouter } from "next/router";
import BlogDetails from "@/components/blog/blog-details";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;
  if (!router.isReady) return null;
  return <BlogDetails id={id} />;
}
