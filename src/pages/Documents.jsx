import { useState } from "react";
import Layout from "../components/Layout";
import { Table, Modal, Field, inputClass, PrimaryButton } from "../components/ui";
import { useTable } from "../lib/useTable";
import { supabase } from "../lib/supabaseClient";
import { Plus, Download } from "lucide-react";

const DOC_TYPES = [
  { value: "packing_list", label: "Packing List" },
  { value: "invoice", label: "Invoice" },
  { value: "bl", label: "Bill of Lading" },
  { value: "certificate", label: "Certificado" },
  { value: "outro", label: "Outro" },
];

const BUCKET = "documents";

const emptyForm = { name: "", doc_type: "packing_list", reference: "", file_path: "" };

export default function Documents() {
  const { rows, loading, insertRow, deleteRow } = useTable("documents");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const openNew = () => { setForm(emptyForm); setFile(null); setOpen(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let file_path = "";
      if (file) {
        const path = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file);
        if (uploadError) throw new Error(uploadError.message);
        file_path = path;
      }
      await insertRow({ ...form, file_path });
      setOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const download = async (row) => {
    if (!row.file_path) return;
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(row.file_path, 60);
    if (error) return alert(error.message);
    window.open(data.signedUrl, "_blank");
  };

  const columns = [
    { key: "name", header: "Documento" },
    { key: "doc_type", header: "Tipo", render: (r) => DOC_TYPES.find((t) => t.value === r.doc_type)?.label || r.doc_type },
    { key: "reference", header: "Referência" },
    { key: "created_at", header: "Data", render: (r) => new Date(r.created_at).toLocaleDateString("pt-BR") },
    {
      key: "actions",
      header: "",
      render: (r) => r.file_path && (
        <button onClick={(e) => { e.stopPropagation(); download(r); }} className="text-navy-500 hover:text-gold-600">
          <Download size={16} />
        </button>
      ),
    },
  ];

  return (
    <Layout eyebrow="Documentação" title="Packing List, Invoice & Certificados">
      <p className="text-sm text-navy-400 mb-4 max-w-2xl">
        Antes do primeiro upload, crie um bucket chamado <span className="font-mono">documents</span> em
        Supabase → Storage (veja instruções no README).
      </p>

      <div className="flex justify-end mb-4">
        <PrimaryButton onClick={openNew}>
          <span className="flex items-center gap-2"><Plus size={16} /> Novo documento</span>
        </PrimaryButton>
      </div>

      {loading ? (
        <p className="text-navy-400 text-sm">Carregando…</p>
      ) : (
        <Table
          columns={columns}
          rows={rows}
          onRowClick={(r) => { if (confirm(`Excluir "${r.name}"?`)) deleteRow(r.id); }}
          emptyLabel="Nenhum documento enviado ainda."
        />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Novo documento">
        <form onSubmit={handleSave}>
          <Field label="Nome do documento">
            <input required className={inputClass} value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo">
              <select className={inputClass} value={form.doc_type}
                onChange={(e) => setForm({ ...form, doc_type: e.target.value })}>
                {DOC_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Referência (embarque, cotação…)">
              <input className={inputClass} value={form.reference}
                onChange={(e) => setForm({ ...form, reference: e.target.value })} />
            </Field>
          </div>
          <Field label="Arquivo">
            <input type="file" className={inputClass} onChange={(e) => setFile(e.target.files[0])} />
          </Field>

          <div className="flex justify-end mt-5">
            <PrimaryButton type="submit" disabled={saving}>{saving ? "Enviando…" : "Salvar"}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
