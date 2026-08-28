import { useRouter } from "next/router";
import EventDetails from "@/components/event/event-details";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;
  if (!router.isReady) return null;
  return <EventDetails id={id} />;
}
