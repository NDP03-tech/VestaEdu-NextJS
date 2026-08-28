import { useRouter } from "next/router";
import QuizBuilder from "@/components/QuizBuilder";
import AdminLayout from "@/components/admin/AdminLayout";
import withAdminAuth from "@/components/ProtectedRoute/withAdminAuth";
import { useAuth } from "@/context/AuthContext";

function Page() {
  const router = useRouter();
  const { quizId } = router.query;
  if (!router.isReady) return null;
  return <QuizBuilder quizId={quizId} />;
}

function AdminLayoutWithAuth({ children }) {
  const { handleLogout } = useAuth();
  return <AdminLayout onLogout={handleLogout}>{children}</AdminLayout>;
}

Page.getLayout = function getLayout(page) {
  return <AdminLayoutWithAuth>{page}</AdminLayoutWithAuth>;
};

export default withAdminAuth(Page);
