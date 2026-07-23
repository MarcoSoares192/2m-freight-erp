import { Modal } from "./ui";
import { COMPANY } from "../lib/company";
import { resolveMaster, resolveHouse, formatMoney } from "../lib/documentLogic";
import { PrimaryButton } from "./ui";
import { Printer } from "lucide-react";

const printStyles = `
  @media print {
    body * { visibility: hidden; }
    #print-area, #print-area * { visibility: visible; }
    #print-area { position: absolute; top: 0; left: 0; width: 100%; }
  }
`;

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0", borderBottom: "1px solid #eee" }}>
      <span style={{ color: "#555" }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value || "—"}</span>
    </div>
  );
}

function Box({ title, children }) {
  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 4, padding: 10, marginBottom: 10 }}>
      <p style={{ fontSize: 10, textTransform: "uppercase", color: "#888", marginBottom: 6 }}>{title}</p>
      {children}
    </div>
  );
}

function DocHeader({ title, subtitle }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
      <div>
        <h1 style={{ fontSize: 18, margin: 0 }}>{COMPANY.name}</h1>
        <p style={{ fontSize: 11, color: "#666", margin: 0 }}>{COMPANY.address}</p>
        <p style={{ fontSize: 11, color: "#666", margin: 0 }}>{COMPANY.phone} · {COMPANY.email}</p>
      </div>
      <div style={{ textAlign: "right" }}>
        <h2 style={{ fontSize: 16, margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 12, color: "#666", margin: 0 }}>{subtitle}</p>}
      </div>
    </div>
  );
}

function MasterDoc({ p }) {
  const r = resolveMaster(p);
  const label = p.mode === "maritimo" ? "MBL" : "MAWB";
  return (
    <div>
      <DocHeader title={label} subtitle={p.master_number} />
      <Box title="Shipper">
        <Row label="Nome" value={r.shipperName} />
        <Row label="Endereço" value={r.shipperAddress} />
      </Box>
      <Box title="Consignee">
        <Row label="Nome" value={r.consigneeName} />
        <Row label="Endereço" value={r.consigneeAddress} />
      </Box>
      <Box title="Transporte">
        <Row label="Carrier" value={p.carrier_name} />
        <Row label="Origem" value={p.origin} />
        <Row label="Destino" value={p.destination} />
        <Row label="Voo/Navio" value={p.flight_or_vessel} />
        <Row label="Data" value={p.transport_date} />
      </Box>
      <Box title="Carga">
        <Row label="Peças" value={p.pieces} />
        <Row label="Peso bruto" value={p.gross_weight ? `${p.gross_weight} kg` : ""} />
        <Row label="Peso taxado" value={p.chargeable_weight ? `${p.chargeable_weight} kg` : ""} />
        <Row label="Rate" value={p.rate ? formatMoney(p.rate, p.currency) : ""} />
        <Row label="Total frete" value={formatMoney(p.freight_total, p.currency)} />
        <Row label="Descrição" value={p.goods_description} />
      </Box>
    </div>
  );
}

function HouseDoc({ p }) {
  const r = resolveHouse(p);
  const label = p.mode === "maritimo" ? "HBL" : "HAWB";
  return (
    <div>
      <DocHeader title={label} subtitle={p.house_number} />
      <Box title="Shipper">
        <Row label="Nome" value={r.shipperName} />
        <Row label="Endereço" value={r.shipperAddress} />
      </Box>
      <Box title="Consignee">
        <Row label="Nome" value={r.consigneeName} />
        <Row label="Endereço" value={r.consigneeAddress} />
        <Row label="Tax ID" value={p.consignee_tax_id} />
      </Box>
      <Box title="Referência ao Master">
        <Row label="Master number" value={p.master_number} />
        <Row label="Carrier" value={p.carrier_name} />
      </Box>
      <Box title="Carga">
        <Row label="Peças" value={p.pieces} />
        <Row label="Peso bruto" value={p.gross_weight ? `${p.gross_weight} kg` : ""} />
        <Row label="Descrição" value={p.goods_description} />
      </Box>
    </div>
  );
}

function InvoiceDoc({ p }) {
  const total = Number(p.freight_total || 0) + Number(p.origin_charges || 0)
    + Number(p.destination_charges || 0) + Number(p.inland_freight || 0);
  return (
    <div>
      <DocHeader title="Invoice / Debit Note" subtitle={p.process_ref} />
      <Box title="Faturado para">
        <Row label="Nome" value={p.real_consignee_name} />
        <Row label="Endereço" value={p.real_consignee_address} />
      </Box>
      <Box title="Referência">
        <Row label="Processo" value={p.process_ref} />
        <Row label="Master" value={p.master_number} />
        <Row label="House" value={p.house_number} />
        <Row label="Rota" value={`${p.origin} → ${p.destination}`} />
      </Box>
      <Box title="Cobrança">
        <Row label="Frete" value={formatMoney(p.freight_total, p.currency)} />
        <Row label="Taxas de origem" value={formatMoney(p.origin_charges, p.currency)} />
        <Row label="Taxas de destino" value={formatMoney(p.destination_charges, p.currency)} />
        <Row label="Inland freight" value={formatMoney(p.inland_freight, p.currency)} />
        <Row label="TOTAL" value={formatMoney(total, p.currency)} />
      </Box>
      <Box title="Dados bancários">
        <Row label="Banco" value={COMPANY.bank.bankName} />
        <Row label="Titular" value={COMPANY.bank.accountName} />
        <Row label="Conta" value={COMPANY.bank.accountNumber} />
        <Row label="Routing" value={COMPANY.bank.routingNumber} />
        {COMPANY.bank.swift && <Row label="Swift" value={COMPANY.bank.swift} />}
      </Box>
    </div>
  );
}

function ManifestDoc({ p }) {
  const r = resolveMaster(p);
  return (
    <div>
      <DocHeader title="Cargo Manifest" subtitle="U.S. Customs" />
      <Box title="Transporte">
        <Row label="Master number" value={p.master_number} />
        <Row label="Carrier / Owner-Operator" value={p.carrier_name} />
        <Row label="Voo/Navio" value={p.flight_or_vessel} />
        <Row label="Data" value={p.transport_date} />
        <Row label="Port of lading" value={p.port_of_lading} />
        <Row label="Port of unloading" value={p.port_of_unloading} />
      </Box>
      <Box title="Shipper / Consignee (Master)">
        <Row label="Shipper" value={r.shipperName} />
        <Row label="Consignee" value={r.consigneeName} />
      </Box>
      <Box title="Mercadoria">
        <Row label="Peças" value={p.pieces} />
        <Row label="Peso" value={p.gross_weight ? `${p.gross_weight} kg` : ""} />
        <Row label="Descrição" value={p.goods_description} />
        <Row label="ITN" value={p.itn_number} />
      </Box>
    </div>
  );
}

function LabelsDoc({ p }) {
  const r = resolveMaster(p);
  return (
    <div>
      <div style={{ border: "2px solid #000", borderRadius: 4, padding: 14, marginBottom: 14 }}>
        <p style={{ fontSize: 11, margin: "2px 0" }}><b>Shipper:</b> {r.shipperName}</p>
        <p style={{ fontSize: 11, margin: "2px 0" }}><b>Carrier:</b> {p.carrier_name}</p>
        <p style={{ fontSize: 11, margin: "2px 0" }}><b>Consignee:</b> {r.consigneeName}</p>
        <p style={{ fontSize: 11, margin: "2px 0" }}><b>Master:</b> {p.master_number}</p>
        <p style={{ fontSize: 11, margin: "2px 0" }}><b>House:</b> {p.house_number || "—"}</p>
        <p style={{ fontSize: 20, margin: "8px 0 0", textAlign: "center" }}><b>{p.destination}</b></p>
        <p style={{ fontSize: 11, margin: "2px 0", textAlign: "center" }}>Peças: {p.pieces} — Total: {p.pieces}</p>
      </div>
    </div>
  );
}

const RENDERERS = {
  master: MasterDoc,
  house: HouseDoc,
  invoice: InvoiceDoc,
  manifest: ManifestDoc,
  labels: LabelsDoc,
};

const TITLES = {
  master: "Master AWB/BL",
  house: "House AWB/HBL",
  invoice: "Invoice / Debit Note",
  manifest: "Cargo Manifest",
  labels: "Labels",
};

export default function DocumentPreview({ docType, process, onClose }) {
  if (!docType || !process) return null;
  const Renderer = RENDERERS[docType];

  const handlePrint = () => window.print();

  return (
    <Modal open={!!docType} onClose={onClose} title={TITLES[docType]}>
      <style>{printStyles}</style>
      <div id="print-area" style={{ fontFamily: "Arial, sans-serif", color: "#111" }}>
        <Renderer p={process} />
      </div>
      <div className="flex justify-end mt-4">
        <PrimaryButton onClick={handlePrint}>
          <span className="flex items-center gap-2"><Printer size={16} /> Imprimir / Salvar PDF</span>
        </PrimaryButton>
      </div>
    </Modal>
  );
}
