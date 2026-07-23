import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Ship,
  FileSpreadsheet,
  Wallet,
  Users,
  FolderClosed,
  LogOut,
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";

const links = [
  { to: "/", label: "Painel", icon: LayoutDashboard, end: true },
  { to: "/embarques", label: "Embarques & Containers", icon: Ship },
  { to: "/cotacoes", label: "Cotações de Frete", icon: FileSpreadsheet },
  { to: "/financeiro", label: "Financeiro", icon: Wallet },
  { to: "/crm", label: "Clientes & Agentes", icon: Users },
  { to: "/documentos", label: "Documentação", icon: FolderClosed },
];

export default function Sidebar() {
  const { signOut } = useAuth();

  return (
    <aside className="w-64 shrink-0 bg-navy-800 text-white flex flex-col h-screen sticky top-0">
      <div className="px-5 pt-6 pb-4">
        <img src="/assets/logo-2m.png" alt="2M Freight and Logistics" className="h-12 w-auto" />
        <div className="manifest-strip mt-4" />
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gold-500 text-navy-900"
                  : "text-navy-100 hover:bg-navy-700"
              }`
            }
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-navy-600">
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-navy-200 hover:bg-navy-700 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
}
