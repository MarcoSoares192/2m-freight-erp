import { useState } from "react";
import Layout from "../components/Layout";
import { Table, StatusBadge, Modal, Field, inputClass, PrimaryButton } from "../components/ui";
import { useTable } from "../lib/useTable";
import { Plus } from "lucide-react";

const STATUS_OPTIONS = ["rascunho", "enviada", "aprovada", "recusada"];

const emptyForm = {
  quote_number: "",
  client_name: "",
  route: "",
  cargo_description: "",
  amount: "",
  currency: "USD",
  status: "rascunho",
  valid_until: "",
};

export default function Quotes() {
  const { rows, loading, insertRow, updateRow, deleteRow } = useTable("quotes");
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

  const columns = [
    { key: "quote_number", header: "Nº Cotação", render: (r) => <span className="font-mono">{r.quote_number}</span> },
    { key: "client_name", header: "Cliente" },
    { key: "route", header: "Rota" },
    { key: "amount", header: "Valor", render: (r) => `${r.currency} ${Number(r.amount).toLocaleString("en-US")}` },
    { key: "valid_until", header: "Válida até" },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <Layout eyebrow="Comercial" title="Cotações de Frete">
      <div className="flex justify-end mb-4">
        <PrimaryButton onClick={openNew}>
          <span className="flex items-center gap-2"><Plus size={16} /> Nova cotação</span>
        </PrimaryButton>
      </div>

      {loading ? (
        <p className="text-navy-400 text-sm">Carregando…</p>
      ) : (
        <Table columns={columns} rows={rows} onRowClick={openEdit} emptyLabel="Nenhuma cotação cadastrada ainda." />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Editar cotação" : "Nova cotação"}>
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nº da cotação">
              <input required className={inputClass} value={form.quote_number}
                onChange={(e) => setForm({ ...form, quote_number: e.target.value })} />
            </Field>
            <Field label="Cliente">
              <input required className={inputClass} value={form.client_name}
                onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
            </Field>
          </div>
          <Field label="Rota">
            <input className={inputClass} placeholder="Santos → Luanda" value={form.route || ""}
              onChange={(e) => setForm({ ...form, route: e.target.value })} />
          </Field>
          <Field label="Descrição da carga">
            <textarea className={inputClass} rows={2} value={form.cargo_description || ""}
              onChange={(e) => setForm({ ...form, cargo_description: e.target.value })} />
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
            <Field label="Status">
              <select className={inputClass} value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Válida até">
            <input type="date" className={inputClass} value={form.valid_until || ""}
              onChange={(e) => setForm({ ...form, valid_until: e.target.value })} />
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
    </Layout>
  );
}
