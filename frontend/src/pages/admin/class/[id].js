import { useRouter } from "next/router";
import ClassDetail from "@/components/ClassDetails";
import AdminLayout from "@/components/admin/AdminLayout";
import withAdminAuth from "@/components/ProtectedRoute/withAdminAuth";
import { useAuth } from "@/context/AuthContext";

function Page() {
  const router = useRouter();
  const { id } = router.query;
  if (!router.isReady) return null;
  return <ClassDetail id={id} />;
}

function AdminLayoutWithAuth({ children }) {
  const { handleLogout } = useAuth();
  return <AdminLayout onLogout={handleLogout}>{children}</AdminLayout>;
}

Page.getLayout = function getLayout(page) {
  return <AdminLayoutWithAuth>{page}</AdminLayoutWithAuth>;
};

export default withAdminAuth(Page);
