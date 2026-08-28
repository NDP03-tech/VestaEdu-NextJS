import { useRouter } from "next/router";
import QuizAnswerTable from "@/components/QuizAnswerTable";

export default function Page() {
  const router = useRouter();
  const { quizId } = router.query;
  if (!router.isReady) return null;
  return <QuizAnswerTable quizId={quizId} />;
}
