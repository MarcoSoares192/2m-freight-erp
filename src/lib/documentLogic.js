import { COMPANY } from "./company";

// Resolve quem aparece como shipper/consignee no MASTER,
// conforme a regra: direto = dados reais; com_house = 2M -> agente destino.
export function resolveMaster(process) {
  if (process.process_type === "com_house") {
    return {
      shipperName: COMPANY.name,
      shipperAddress: COMPANY.address,
      consigneeName: process.destination_agent_name || "",
      consigneeAddress: process.destination_agent_address || "",
    };
  }
  return {
    shipperName: process.real_shipper_name || "",
    shipperAddress: process.real_shipper_address || "",
    consigneeName: process.real_consignee_name || "",
    consigneeAddress: process.real_consignee_address || "",
  };
}

// O House sempre reflete a verdade comercial (fornecedor real -> comprador real).
export function resolveHouse(process) {
  return {
    shipperName: process.real_shipper_name || "",
    shipperAddress: process.real_shipper_address || "",
    consigneeName: process.real_consignee_name || "",
    consigneeAddress: process.real_consignee_address || "",
  };
}

export function formatMoney(value, currency = "USD") {
  const n = Number(value || 0);
  return `${currency} ${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}
