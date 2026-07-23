import { useState } from "react";
import Layout from "../components/Layout";
import { Table, StatusBadge, Modal, Field, inputClass, PrimaryButton } from "../components/ui";
import { useTable } from "../lib/useTable";
import { Plus } from "lucide-react";

const TYPE_OPTIONS = [
  { value: "cliente", label: "Cliente" },
  { value: "agente", label: "Agente de carga" },
  { value: "armador", label: "Armador / Carrier" },
];

const emptyForm = {
  name: "",
  type: "cliente",
  country: "",
  contact_name: "",
  email: "",
  phone: "",
  status: "ativo",
  notes: "",
};

export default function CRM() {
  const { rows, loading, insertRow, updateRow, deleteRow } = useTable("contacts");
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
      if (editing) await updateRow(editing.id, form);
      else await insertRow(form);
      setOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: "name", header: "Nome" },
    { key: "type", header: "Tipo", render: (r) => TYPE_OPTIONS.find((t) => t.value === r.type)?.label || r.type },
    { key: "country", header: "País" },
    { key: "contact_name", header: "Contato" },
    { key: "email", header: "E-mail" },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <Layout eyebrow="Relacionamento" title="Clientes & Agentes">
      <div className="flex justify-end mb-4">
        <PrimaryButton onClick={openNew}>
          <span className="flex items-center gap-2"><Plus size={16} /> Novo contato</span>
        </PrimaryButton>
      </div>

      {loading ? (
        <p className="text-navy-400 text-sm">Carregando…</p>
      ) : (
        <Table columns={columns} rows={rows} onRowClick={openEdit} emptyLabel="Nenhum contato cadastrado ainda." />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Editar contato" : "Novo contato"}>
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nome (empresa)">
              <input required className={inputClass} value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Tipo">
              <select className={inputClass} value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {TYPE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="País">
              <input className={inputClass} value={form.country || ""}
                onChange={(e) => setForm({ ...form, country: e.target.value })} />
            </Field>
            <Field label="Pessoa de contato">
              <input className={inputClass} value={form.contact_name || ""}
                onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="E-mail">
              <input type="email" className={inputClass} value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Telefone">
              <input className={inputClass} value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
          </div>
          <Field label="Status">
            <select className={inputClass} value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </Field>
          <Field label="Observações">
            <textarea rows={3} className={inputClass} value={form.notes || ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })} />
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
