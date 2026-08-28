import { useRouter } from "next/router";
import CourseDetails from "@/components/course/course-details";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;
  if (!router.isReady) return null;
  return <CourseDetails id={id} />;
}
