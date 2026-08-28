import { useRouter } from "next/router";
import InstructorDetails from "@/components/instructor/instructor-details";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;
  if (!router.isReady) return null;
  return <InstructorDetails id={id} />;
}
