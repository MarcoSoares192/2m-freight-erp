import { X } from "lucide-react";

export function StatCard({ label, value, sublabel, accent = "navy" }) {
  const accentClass = accent === "gold" ? "text-gold-600" : "text-navy-700";
  return (
    <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-sm">
      <p className="text-xs font-medium text-navy-400 uppercase tracking-wide">{label}</p>
      <p className={`font-display text-2xl font-bold mt-1 ${accentClass}`}>{value}</p>
      {sublabel && <p className="text-xs text-navy-400 mt-1">{sublabel}</p>}
    </div>
  );
}

const STATUS_STYLES = {
  // Embarques
  pendente: "bg-navy-50 text-navy-600",
  em_transito: "bg-gold-50 text-gold-700",
  no_porto: "bg-blue-50 text-blue-700",
  entregue: "bg-green-50 text-green-700",
  // Cotações
  rascunho: "bg-navy-50 text-navy-500",
  enviada: "bg-gold-50 text-gold-700",
  aprovada: "bg-green-50 text-green-700",
  recusada: "bg-red-50 text-red-700",
  // Financeiro
  aberto: "bg-gold-50 text-gold-700",
  pago: "bg-green-50 text-green-700",
  vencido: "bg-red-50 text-red-700",
  // Genérico
  ativo: "bg-green-50 text-green-700",
  inativo: "bg-navy-50 text-navy-500",
};

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || "bg-navy-50 text-navy-600";
  const label = (status || "").replaceAll("_", " ");
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${style}`}>
      {label}
    </span>
  );
}

export function Table({ columns, rows, onRowClick, emptyLabel = "Nenhum registro ainda" }) {
  if (!rows.length) {
    return (
      <div className="bg-white rounded-xl border border-navy-100 p-12 text-center text-navy-400 text-sm">
        {emptyLabel}
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl border border-navy-100 overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-navy-50 text-navy-500 text-xs uppercase tracking-wide">
            {columns.map((c) => (
              <th key={c.key} className="text-left font-medium px-4 py-3">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={`border-t border-navy-50 ${onRowClick ? "cursor-pointer hover:bg-navy-50/60" : ""}`}
            >
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 text-navy-700">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 px-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-navy-100">
          <h2 className="font-display font-semibold text-navy-800">{title}</h2>
          <button onClick={onClose} className="text-navy-400 hover:text-navy-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="block mb-3">
      <span className="block text-xs font-medium text-navy-500 mb-1">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400";

export function PrimaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="bg-navy-700 hover:bg-navy-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
    >
      {children}
    </button>
  );
}
