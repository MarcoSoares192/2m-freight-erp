import { useState } from "react";
import Layout from "../components/Layout";
import { Table, StatusBadge, Modal, Field, inputClass, PrimaryButton } from "../components/ui";
import { useTable } from "../lib/useTable";
import { Plus } from "lucide-react";

const STATUS_OPTIONS = ["pendente", "em_transito", "no_porto", "entregue"];

const emptyForm = {
  reference: "",
  origin: "",
  destination: "",
  container_type: "",
  bl_number: "",
  carrier: "",
  status: "pendente",
  etd: "",
  eta: "",
};

export default function Shipments() {
  const { rows, loading, insertRow, updateRow, deleteRow } = useTable("shipments");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm(row);
    setOpen(true);
  };

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
    { key: "reference", header: "Referência", render: (r) => <span className="font-mono">{r.reference}</span> },
    { key: "route", header: "Rota", render: (r) => `${r.origin} → ${r.destination}` },
    { key: "container_type", header: "Container" },
    { key: "bl_number", header: "BL", render: (r) => <span className="font-mono">{r.bl_number || "—"}</span> },
    { key: "carrier", header: "Armador" },
    { key: "eta", header: "ETA" },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <Layout eyebrow="Operações" title="Embarques & Containers">
      <div className="flex justify-end mb-4">
        <PrimaryButton onClick={openNew}>
          <span className="flex items-center gap-2"><Plus size={16} /> Novo embarque</span>
        </PrimaryButton>
      </div>

      {loading ? (
        <p className="text-navy-400 text-sm">Carregando…</p>
      ) : (
        <Table columns={columns} rows={rows} onRowClick={openEdit} emptyLabel="Nenhum embarque cadastrado ainda." />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Editar embarque" : "Novo embarque"}>
        <form onSubmit={handleSave}>
          <Field label="Referência interna">
            <input required className={inputClass} value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Origem">
              <input required className={inputClass} value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })} />
            </Field>
            <Field label="Destino">
              <input required className={inputClass} value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo de container">
              <input className={inputClass} placeholder="40HC, 20DV, Flat Rack…" value={form.container_type || ""}
                onChange={(e) => setForm({ ...form, container_type: e.target.value })} />
            </Field>
            <Field label="Nº do BL">
              <input className={inputClass} value={form.bl_number || ""}
                onChange={(e) => setForm({ ...form, bl_number: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Armador / Carrier">
              <input className={inputClass} value={form.carrier || ""}
                onChange={(e) => setForm({ ...form, carrier: e.target.value })} />
            </Field>
            <Field label="Status">
              <select className={inputClass} value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="ETD">
              <input type="date" className={inputClass} value={form.etd || ""}
                onChange={(e) => setForm({ ...form, etd: e.target.value })} />
            </Field>
            <Field label="ETA">
              <input type="date" className={inputClass} value={form.eta || ""}
                onChange={(e) => setForm({ ...form, eta: e.target.value })} />
            </Field>
          </div>

          <div className="flex justify-between items-center mt-5">
            {editing ? (
              <button type="button" onClick={() => { deleteRow(editing.id); setOpen(false); }}
                className="text-sm text-red-600 hover:underline">
                Excluir
              </button>
            ) : <span />}
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? "Salvando…" : "Salvar"}
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
