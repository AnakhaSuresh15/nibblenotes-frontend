import { AuthProvider } from "../contexts/AuthContext";
import { SidebarProvider } from "../contexts/SidebarContext";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </AuthProvider>
  );
}
