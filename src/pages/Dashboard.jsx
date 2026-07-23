import Layout from "../components/Layout";
import { StatCard, StatusBadge } from "../components/ui";
import { useTable } from "../lib/useTable";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { rows: shipments, loading: l1 } = useTable("shipments");
  const { rows: quotes, loading: l2 } = useTable("quotes");
  const { rows: invoices, loading: l3 } = useTable("financial_entries");

  const loading = l1 || l2 || l3;

  const emTransito = shipments.filter((s) => s.status === "em_transito").length;
  const cotacoesAbertas = quotes.filter((q) => q.status === "enviada" || q.status === "rascunho").length;
  const aReceber = invoices
    .filter((i) => i.type === "receivable" && i.status !== "pago")
    .reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const aPagar = invoices
    .filter((i) => i.type === "payable" && i.status !== "pago")
    .reduce((sum, i) => sum + Number(i.amount || 0), 0);

  const monthly = buildMonthlySeries(invoices);

  return (
    <Layout eyebrow="Visão geral" title="Painel 2M Freight">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Embarques em trânsito" value={loading ? "…" : emTransito} accent="gold" />
        <StatCard label="Cotações em aberto" value={loading ? "…" : cotacoesAbertas} />
        <StatCard
          label="A receber"
          value={loading ? "…" : formatUSD(aReceber)}
          accent="gold"
        />
        <StatCard label="A pagar" value={loading ? "…" : formatUSD(aPagar)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-navy-100 p-5 shadow-sm">
          <h2 className="font-display font-semibold text-navy-800 mb-4">
            Fluxo financeiro (últimos meses)
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthly}>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#4d6f93" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#4d6f93" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => formatUSD(v)} />
              <Bar dataKey="receber" name="A receber" fill="#F26F21" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pagar" name="A pagar" fill="#122F54" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-sm">
          <h2 className="font-display font-semibold text-navy-800 mb-4">Últimos embarques</h2>
          <ul className="space-y-3">
            {shipments.slice(0, 6).map((s) => (
              <li key={s.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-mono text-navy-700">{s.reference}</p>
                  <p className="text-navy-400 text-xs">{s.origin} → {s.destination}</p>
                </div>
                <StatusBadge status={s.status} />
              </li>
            ))}
            {!shipments.length && !loading && (
              <p className="text-navy-400 text-sm">Nenhum embarque cadastrado ainda.</p>
            )}
          </ul>
        </div>
      </div>
    </Layout>
  );
}

function formatUSD(v) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v || 0);
}

function buildMonthlySeries(invoices) {
  const buckets = {};
  invoices.forEach((inv) => {
    const d = new Date(inv.due_date || inv.created_at);
    const key = d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
    if (!buckets[key]) buckets[key] = { month: key, receber: 0, pagar: 0 };
    if (inv.type === "receivable") buckets[key].receber += Number(inv.amount || 0);
    if (inv.type === "payable") buckets[key].pagar += Number(inv.amount || 0);
  });
  return Object.values(buckets).slice(-6);
}
