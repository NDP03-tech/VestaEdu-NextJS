import { useRouter } from "next/router";
import QuizResultTable from "@/components/QuizAnswerTable";
import AdminLayout from "@/components/admin/AdminLayout";
import withAdminAuth from "@/components/ProtectedRoute/withAdminAuth";
import { useAuth } from "@/context/AuthContext";

function Page() {
  const router = useRouter();
  const { userId, quizId } = router.query;
  if (!router.isReady) return null;
  return <QuizResultTable userId={userId} quizId={quizId} />;
}

function AdminLayoutWithAuth({ children }) {
  const { handleLogout } = useAuth();
  return <AdminLayout onLogout={handleLogout}>{children}</AdminLayout>;
}

Page.getLayout = function getLayout(page) {
  return <AdminLayoutWithAuth>{page}</AdminLayoutWithAuth>;
};

export default withAdminAuth(Page);
