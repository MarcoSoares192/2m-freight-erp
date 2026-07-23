import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Processes from "./pages/Processes";
import Shipments from "./pages/Shipments";
import Quotes from "./pages/Quotes";
import Financials from "./pages/Financials";
import CRM from "./pages/CRM";
import Documents from "./pages/Documents";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/processos" element={<Processes />} />
        <Route path="/embarques" element={<Shipments />} />
        <Route path="/cotacoes" element={<Quotes />} />
        <Route path="/financeiro" element={<Financials />} />
        <Route path="/crm" element={<CRM />} />
        <Route path="/documentos" element={<Documents />} />
      </Routes>
    </BrowserRouter>
  );
}
