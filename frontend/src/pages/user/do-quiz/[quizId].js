import { useRouter } from "next/router";
import QuizPreviewWrapper from "@/components/QuizPreviewWrapper";
import withAuth from "@/components/ProtectedRoute/withAuth";

function Page() {
  const router = useRouter();
  const { quizId } = router.query;
  if (!router.isReady) return null;
  return <QuizPreviewWrapper quizId={quizId} />;
}

export default withAuth(Page);
