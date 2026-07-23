import { useState } from "react";
import Layout from "../components/Layout";
import { Table, StatusBadge, Modal, Field, inputClass, PrimaryButton, StatCard } from "../components/ui";
import { useTable } from "../lib/useTable";
import { Plus } from "lucide-react";
import VisaExpenses from "./VisaExpenses";

const STATUS_OPTIONS = ["aberto", "pago", "vencido"];
const TYPE_OPTIONS = [
  { value: "receivable", label: "A receber" },
  { value: "payable", label: "A pagar" },
];

const emptyForm = {
  description: "",
  type: "receivable",
  amount: "",
  currency: "USD",
  status: "aberto",
  due_date: "",
  counterparty: "",
};

function AccountsPayableReceivable() {
  const { rows, loading, insertRow, updateRow, deleteRow } = useTable("financial_entries");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openNew = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (row) => { setEditing(row); setForm(row); setOpen(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, amount: Number(form.amount) || 0 };
      if (editing) await updateRow(editing.id, payload);
      else await insertRow(payload);
      setOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const totalReceber = rows.filter((r) => r.type === "receivable" && r.status !== "pago")
    .reduce((s, r) => s + Number(r.amount || 0), 0);
  const totalPagar = rows.filter((r) => r.type === "payable" && r.status !== "pago")
    .reduce((s, r) => s + Number(r.amount || 0), 0);

  const columns = [
    { key: "description", header: "Descrição" },
    { key: "counterparty", header: "Cliente/Fornecedor" },
    { key: "type", header: "Tipo", render: (r) => TYPE_OPTIONS.find((t) => t.value === r.type)?.label || r.type },
    { key: "amount", header: "Valor", render: (r) => `${r.currency} ${Number(r.amount).toLocaleString("en-US")}` },
    { key: "due_date", header: "Vencimento" },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard label="Total a receber" value={`USD ${totalReceber.toLocaleString("en-US")}`} accent="gold" />
        <StatCard label="Total a pagar" value={`USD ${totalPagar.toLocaleString("en-US")}`} />
      </div>

      <div className="flex justify-end mb-4">
        <PrimaryButton onClick={openNew}>
          <span className="flex items-center gap-2"><Plus size={16} /> Novo lançamento</span>
        </PrimaryButton>
      </div>

      {loading ? (
        <p className="text-navy-400 text-sm">Carregando…</p>
      ) : (
        <Table columns={columns} rows={rows} onRowClick={openEdit} emptyLabel="Nenhum lançamento cadastrado ainda." />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Editar lançamento" : "Novo lançamento"}>
        <form onSubmit={handleSave}>
          <Field label="Descrição">
            <input required className={inputClass} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="Cliente / Fornecedor">
            <input className={inputClass} value={form.counterparty || ""}
              onChange={(e) => setForm({ ...form, counterparty: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo">
              <select className={inputClass} value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {TYPE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select className={inputClass} value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Valor">
              <input type="number" step="0.01" className={inputClass} value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </Field>
            <Field label="Moeda">
              <select className={inputClass} value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                <option value="USD">USD</option>
                <option value="BRL">BRL</option>
                <option value="EUR">EUR</option>
              </select>
            </Field>
            <Field label="Vencimento">
              <input type="date" className={inputClass} value={form.due_date || ""}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
            </Field>
          </div>

          <div className="flex justify-between items-center mt-5">
            {editing ? (
              <button type="button" onClick={() => { deleteRow(editing.id); setOpen(false); }}
                className="text-sm text-red-600 hover:underline">
                Excluir
              </button>
            ) : <span />}
            <PrimaryButton type="submit" disabled={saving}>{saving ? "Salvando…" : "Salvar"}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}

const TABS = [
  { key: "contas", label: "Contas a Pagar & Receber" },
  { key: "visto", label: "Despesas VISTO" },
];

export default function Financials() {
  const [tab, setTab] = useState("contas");

  return (
    <Layout eyebrow="Financeiro" title="Financeiro">
      <div className="flex gap-1 mb-6 border-b border-navy-100">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key
                ? "border-gold-500 text-navy-800"
                : "border-transparent text-navy-400 hover:text-navy-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "contas" ? <AccountsPayableReceivable /> : <VisaExpenses />}
    </Layout>
  );
}
