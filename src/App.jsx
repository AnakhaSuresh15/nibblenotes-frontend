import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./components/Dashboard";
import CreateLog from "./components/CreateLog/CreateLog";
import Register from "./components/Register";
import Login from "./components/Login";
import Log from "./components/Log";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Insights from "./components/Insights/Insights";
import Recipes from "./components/Recipes/Recipes";
import RecipePage from "./components/Recipes/RecipePage";
import Settings from "./components/Settings/Settings";

import { SidebarProvider, useSidebar } from "./contexts/SidebarContext";
import { AuthProvider } from "./contexts/AuthContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

/* ---------------- APP LAYOUT (USES CONTEXTS) ---------------- */

function AppLayout() {
  const { isSidebarOpen, closeSidebar } = useSidebar();

  return (
    <div className="min-h-screen flex flex-col h-full">
      <Header />

      <div
        className="flex-1 flex pt-14"
        onClick={() => {
          if (isSidebarOpen) closeSidebar();
        }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-log" element={<CreateLog />} />
            <Route path="/edit-log/:logId" element={<CreateLog />} />
            <Route path="/log/:date" element={<Log />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipe/:id" element={<RecipePage />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

/* ---------------- ROOT APP (PROVIDERS ONLY) ---------------- */

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <Router>
        <AuthProvider>
          <SidebarProvider>
            <AppLayout />
          </SidebarProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
