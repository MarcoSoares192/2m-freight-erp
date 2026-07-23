import { useState } from "react";
import { Table, Modal, Field, inputClass, PrimaryButton, StatCard } from "../components/ui";
import { useTable } from "../lib/useTable";
import { Plus } from "lucide-react";

const emptyForm = {
  expense_type: "",
  amount: "",
  currency: "USD",
  expense_date: "",
  justification: "",
};

export default function VisaExpenses() {
  const { rows, loading, insertRow, updateRow, deleteRow } = useTable("visa_expenses", {
    orderBy: "expense_date",
  });
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

  const totalGasto = rows.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const thisMonth = new Date().toISOString().slice(0, 7);
  const totalMes = rows
    .filter((r) => (r.expense_date || "").slice(0, 7) === thisMonth)
    .reduce((sum, r) => sum + Number(r.amount || 0), 0);

  const columns = [
    { key: "expense_type", header: "Tipo de despesa" },
    { key: "amount", header: "Valor", render: (r) => `${r.currency} ${Number(r.amount).toLocaleString("en-US")}` },
    { key: "expense_date", header: "Data" },
    {
      key: "justification",
      header: "Justificativa",
      render: (r) => (
        <span className="line-clamp-1 max-w-xs inline-block text-navy-500" title={r.justification}>
          {r.justification || "—"}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard
          label="Total gasto (VISTO)"
          value={loading ? "…" : `USD ${totalGasto.toLocaleString("en-US")}`}
          accent="gold"
          sublabel={`${rows.length} lançamento(s)`}
        />
        <StatCard
          label="Gasto no mês atual"
          value={loading ? "…" : `USD ${totalMes.toLocaleString("en-US")}`}
        />
      </div>

      <div className="flex justify-end mb-4">
        <PrimaryButton onClick={openNew}>
          <span className="flex items-center gap-2"><Plus size={16} /> Nova despesa</span>
        </PrimaryButton>
      </div>

      {loading ? (
        <p className="text-navy-400 text-sm">Carregando…</p>
      ) : (
        <Table columns={columns} rows={rows} onRowClick={openEdit} emptyLabel="Nenhuma despesa de visto cadastrada ainda." />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Editar despesa" : "Nova despesa de visto"}>
        <form onSubmit={handleSave}>
          <Field label="Tipo de despesa">
            <input required className={inputClass} placeholder="Ex: Taxa consular, tradução juramentada, passagem…"
              value={form.expense_type}
              onChange={(e) => setForm({ ...form, expense_type: e.target.value })} />
          </Field>
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
            <Field label="Data">
              <input type="date" className={inputClass} value={form.expense_date || ""}
                onChange={(e) => setForm({ ...form, expense_date: e.target.value })} />
            </Field>
          </div>
          <Field label="Justificativa">
            <textarea rows={3} className={inputClass} placeholder="Motivo da despesa…"
              value={form.justification || ""}
              onChange={(e) => setForm({ ...form, justification: e.target.value })} />
          </Field>

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
