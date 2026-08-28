import UserDashboard from "@/components/user/UserDashbroad";
import UserLayout from "@/components/User/UserLayout";
import withUserAuth from "@/components/ProtectedRoute/withUserAuth";
import { useAuth } from "@/context/AuthContext";

function Page() {
  return <UserDashboard />;
}

function UserLayoutWithAuth({ children }) {
  const { handleLogout } = useAuth();
  return <UserLayout onLogout={handleLogout}>{children}</UserLayout>;
}

Page.getLayout = function getLayout(page) {
  return <UserLayoutWithAuth>{page}</UserLayoutWithAuth>;
};

export default withUserAuth(Page);
