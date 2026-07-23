import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Shipments from "./pages/Shipments";
import Quotes from "./pages/Quotes";
import Financials from "./pages/Financials";
import CRM from "./pages/CRM";
import Documents from "./pages/Documents";

function PrivateRoute({ children }) {
  const { session } = useAuth();
  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-navy-400 text-sm">
        Carregando…
      </div>
    );
  }
  if (!session) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { session } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/embarques" element={<PrivateRoute><Shipments /></PrivateRoute>} />
      <Route path="/cotacoes" element={<PrivateRoute><Quotes /></PrivateRoute>} />
      <Route path="/financeiro" element={<PrivateRoute><Financials /></PrivateRoute>} />
      <Route path="/crm" element={<PrivateRoute><CRM /></PrivateRoute>} />
      <Route path="/documentos" element={<PrivateRoute><Documents /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
