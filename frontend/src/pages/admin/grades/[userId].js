import { useRouter } from "next/router";
import GradesPage from "@/components/GradesPage";
import AdminLayout from "@/components/admin/AdminLayout";
import withAdminAuth from "@/components/ProtectedRoute/withAdminAuth";
import { useAuth } from "@/context/AuthContext";

function Page() {
  const router = useRouter();
  const { userId } = router.query;
  if (!router.isReady) return null;
  return <GradesPage userId={userId} />;
}

function AdminLayoutWithAuth({ children }) {
  const { handleLogout } = useAuth();
  return <AdminLayout onLogout={handleLogout}>{children}</AdminLayout>;
}

Page.getLayout = function getLayout(page) {
  return <AdminLayoutWithAuth>{page}</AdminLayoutWithAuth>;
};

export default withAdminAuth(Page);
