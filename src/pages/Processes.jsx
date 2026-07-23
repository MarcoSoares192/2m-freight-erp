import { useState } from "react";
import Layout from "../components/Layout";
import { Table, StatusBadge, Modal, Field, inputClass, PrimaryButton } from "../components/ui";
import { useTable } from "../lib/useTable";
import DocumentPreview from "../components/DocumentPreview";
import { Plus } from "lucide-react";

const MODE_OPTIONS = [
  { value: "aereo", label: "Aéreo" },
  { value: "maritimo", label: "Marítimo" },
];
const TYPE_OPTIONS = [
  { value: "direto", label: "Master direto (sem House)" },
  { value: "com_house", label: "Com House (consolidado)" },
];
const STATUS_OPTIONS = ["rascunho", "docs_emitidos", "em_transito", "entregue"];

const emptyForm = {
  process_ref: "",
  mode: "aereo",
  process_type: "direto",
  master_number: "",
  house_number: "",
  real_shipper_name: "",
  real_shipper_address: "",
  real_consignee_name: "",
  real_consignee_address: "",
  consignee_tax_id: "",
  destination_agent_name: "",
  destination_agent_address: "",
  carrier_name: "",
  origin: "",
  destination: "",
  port_of_lading: "",
  port_of_unloading: "",
  flight_or_vessel: "",
  transport_date: "",
  pieces: "",
  gross_weight: "",
  chargeable_weight: "",
  rate: "",
  currency: "USD",
  freight_total: "",
  origin_charges: "",
  destination_charges: "",
  inland_freight: "",
  goods_description: "",
  itn_number: "",
  status: "rascunho",
};

export default function Processes() {
  const { rows, loading, insertRow, updateRow, deleteRow } = useTable("processes");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [docType, setDocType] = useState(null);
  const [docProcess, setDocProcess] = useState(null);

  const openNew = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (row) => { setEditing(row); setForm(row); setOpen(true); };
  const openDoc = (row, type) => { setDocProcess(row); setDocType(type); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const numericFields = ["pieces", "gross_weight", "chargeable_weight", "rate", "freight_total", "origin_charges", "destination_charges", "inland_freight"];
      const payload = { ...form };
      numericFields.forEach((f) => { payload[f] = Number(payload[f]) || 0; });
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
    { key: "process_ref", header: "Processo", render: (r) => <span className="font-mono">{r.process_ref}</span> },
    { key: "mode", header: "Modo", render: (r) => MODE_OPTIONS.find((m) => m.value === r.mode)?.label },
    { key: "process_type", header: "Tipo", render: (r) => r.process_type === "com_house" ? "Com House" : "Direto" },
    { key: "route", header: "Rota", render: (r) => `${r.origin || "—"} → ${r.destination || "—"}` },
    { key: "master_number", header: "Master", render: (r) => <span className="font-mono">{r.master_number || "—"}</span> },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "docs",
      header: "Documentos",
      render: (r) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <DocButton label="M" title="Master AWB/BL" onClick={() => openDoc(r, "master")} />
          {r.process_type === "com_house" && (
            <DocButton label="H" title="House AWB/HBL" onClick={() => openDoc(r, "house")} />
          )}
          <DocButton label="Inv" title="Invoice / Debit Note" onClick={() => openDoc(r, "invoice")} />
          <DocButton label="Man" title="Cargo Manifest" onClick={() => openDoc(r, "manifest")} />
          <DocButton label="Lbl" title="Labels" onClick={() => openDoc(r, "labels")} />
        </div>
      ),
    },
  ];

  return (
    <Layout eyebrow="Operações" title="Processos">
      <div className="flex justify-end mb-4">
        <PrimaryButton onClick={openNew}>
          <span className="flex items-center gap-2"><Plus size={16} /> Novo processo</span>
        </PrimaryButton>
      </div>

      {loading ? (
        <p className="text-navy-400 text-sm">Carregando…</p>
      ) : (
        <Table columns={columns} rows={rows} onRowClick={openEdit} emptyLabel="Nenhum processo cadastrado ainda." />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Editar processo" : "Novo processo"}>
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Referência do processo">
              <input required className={inputClass} placeholder="2M-PRC-0001" value={form.process_ref}
                onChange={(e) => setForm({ ...form, process_ref: e.target.value })} />
            </Field>
            <Field label="Modo">
              <select className={inputClass} value={form.mode}
                onChange={(e) => setForm({ ...form, mode: e.target.value })}>
                {MODE_OPTIONS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Tipo de processo">
            <select className={inputClass} value={form.process_type}
              onChange={(e) => setForm({ ...form, process_type: e.target.value })}>
              {TYPE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label={form.mode === "maritimo" ? "Nº MBL (Master)" : "Nº MAWB (Master)"}>
              <input className={inputClass} value={form.master_number}
                onChange={(e) => setForm({ ...form, master_number: e.target.value })} />
            </Field>
            {form.process_type === "com_house" && (
              <Field label={form.mode === "maritimo" ? "Nº HBL (House)" : "Nº HAWB (House)"}>
                <input className={inputClass} value={form.house_number}
                  onChange={(e) => setForm({ ...form, house_number: e.target.value })} />
              </Field>
            )}
          </div>

          <p className="text-xs font-medium text-navy-500 uppercase tracking-wide mt-4 mb-2">Dados reais (comercial)</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fornecedor real (shipper)">
              <input className={inputClass} value={form.real_shipper_name}
                onChange={(e) => setForm({ ...form, real_shipper_name: e.target.value })} />
            </Field>
            <Field label="Endereço do fornecedor">
              <input className={inputClass} value={form.real_shipper_address}
                onChange={(e) => setForm({ ...form, real_shipper_address: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Comprador real (consignee)">
              <input className={inputClass} value={form.real_consignee_name}
                onChange={(e) => setForm({ ...form, real_consignee_name: e.target.value })} />
            </Field>
            <Field label="Endereço do comprador">
              <input className={inputClass} value={form.real_consignee_address}
                onChange={(e) => setForm({ ...form, real_consignee_address: e.target.value })} />
            </Field>
          </div>
          <Field label="Tax ID do comprador">
            <input className={inputClass} value={form.consignee_tax_id}
              onChange={(e) => setForm({ ...form, consignee_tax_id: e.target.value })} />
          </Field>

          {form.process_type === "com_house" && (
            <>
              <p className="text-xs font-medium text-navy-500 uppercase tracking-wide mt-4 mb-2">Agente no destino (aparece no Master)</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nome do agente">
                  <input className={inputClass} value={form.destination_agent_name}
                    onChange={(e) => setForm({ ...form, destination_agent_name: e.target.value })} />
                </Field>
                <Field label="Endereço do agente">
                  <input className={inputClass} value={form.destination_agent_address}
                    onChange={(e) => setForm({ ...form, destination_agent_address: e.target.value })} />
                </Field>
              </div>
            </>
          )}

          <p className="text-xs font-medium text-navy-500 uppercase tracking-wide mt-4 mb-2">Transporte</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Carrier">
              <input className={inputClass} value={form.carrier_name}
                onChange={(e) => setForm({ ...form, carrier_name: e.target.value })} />
            </Field>
            <Field label="Voo / Navio">
              <input className={inputClass} value={form.flight_or_vessel}
                onChange={(e) => setForm({ ...form, flight_or_vessel: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Origem">
              <input className={inputClass} value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })} />
            </Field>
            <Field label="Destino">
              <input className={inputClass} value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Port of lading">
              <input className={inputClass} value={form.port_of_lading}
                onChange={(e) => setForm({ ...form, port_of_lading: e.target.value })} />
            </Field>
            <Field label="Port of unloading">
              <input className={inputClass} value={form.port_of_unloading}
                onChange={(e) => setForm({ ...form, port_of_unloading: e.target.value })} />
            </Field>
          </div>
          <Field label="Data de transporte">
            <input type="date" className={inputClass} value={form.transport_date || ""}
              onChange={(e) => setForm({ ...form, transport_date: e.target.value })} />
          </Field>

          <p className="text-xs font-medium text-navy-500 uppercase tracking-wide mt-4 mb-2">Carga e valores</p>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Peças">
              <input type="number" className={inputClass} value={form.pieces}
                onChange={(e) => setForm({ ...form, pieces: e.target.value })} />
            </Field>
            <Field label="Peso bruto (kg)">
              <input type="number" step="0.01" className={inputClass} value={form.gross_weight}
                onChange={(e) => setForm({ ...form, gross_weight: e.target.value })} />
            </Field>
            <Field label="Peso taxado (kg)">
              <input type="number" step="0.01" className={inputClass} value={form.chargeable_weight}
                onChange={(e) => setForm({ ...form, chargeable_weight: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Rate">
              <input type="number" step="0.01" className={inputClass} value={form.rate}
                onChange={(e) => setForm({ ...form, rate: e.target.value })} />
            </Field>
            <Field label="Moeda">
              <select className={inputClass} value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                <option value="USD">USD</option>
                <option value="BRL">BRL</option>
                <option value="EUR">EUR</option>
              </select>
            </Field>
            <Field label="Total frete">
              <input type="number" step="0.01" className={inputClass} value={form.freight_total}
                onChange={(e) => setForm({ ...form, freight_total: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Taxas de origem">
              <input type="number" step="0.01" className={inputClass} value={form.origin_charges}
                onChange={(e) => setForm({ ...form, origin_charges: e.target.value })} />
            </Field>
            <Field label="Taxas de destino">
              <input type="number" step="0.01" className={inputClass} value={form.destination_charges}
                onChange={(e) => setForm({ ...form, destination_charges: e.target.value })} />
            </Field>
            <Field label="Inland freight">
              <input type="number" step="0.01" className={inputClass} value={form.inland_freight}
                onChange={(e) => setForm({ ...form, inland_freight: e.target.value })} />
            </Field>
          </div>

          <Field label="Descrição da mercadoria">
            <textarea rows={2} className={inputClass} value={form.goods_description}
              onChange={(e) => setForm({ ...form, goods_description: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="ITN (customs)">
              <input className={inputClass} value={form.itn_number}
                onChange={(e) => setForm({ ...form, itn_number: e.target.value })} />
            </Field>
            <Field label="Status">
              <select className={inputClass} value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}
              </select>
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

      <DocumentPreview docType={docType} process={docProcess} onClose={() => setDocType(null)} />
    </Layout>
  );
}

function DocButton({ label, title, onClick }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-8 h-7 rounded-md border border-navy-200 text-xs font-medium text-navy-600 hover:bg-navy-50 hover:border-navy-400 flex items-center justify-center"
    >
      {label}
    </button>
  );
}
