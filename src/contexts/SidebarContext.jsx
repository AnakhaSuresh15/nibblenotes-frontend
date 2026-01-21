import { createContext, useContext, useState, useEffect, use } from "react";
import { useAuth } from "./AuthContext";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  const toggleSidebar = () => {
    if (!user) return;
    setIsSidebarOpen((prev) => !prev);
  };
  const openSidebar = () => {
    if (!user) return;
    setIsSidebarOpen(true);
  };
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    if (!loading && !user) {
      setIsSidebarOpen(false);
    }
  }, [user, loading]);

  return (
    <SidebarContext.Provider
      value={{ isSidebarOpen, toggleSidebar, openSidebar, closeSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

// custom hook
export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}
