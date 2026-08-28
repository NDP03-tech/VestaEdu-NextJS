import Login from "@/components/authentication/login";
import { useAuth } from "@/context/AuthContext";

export default function Page() {
  const { handleLogin } = useAuth();
  return <Login onLogin={handleLogin} setIsLoggedIn={handleLogin} />;
}
