import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

/**
 * Hook genérico de CRUD para uma tabela do Supabase.
 * Usado por todos os módulos (embarques, cotações, financeiro, CRM, documentos)
 * para evitar repetir a mesma lógica de fetch/insert/update/delete em cada página.
 */
export function useTable(tableName, { orderBy = "created_at", ascending = false } = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .order(orderBy, { ascending });
    if (error) setError(error.message);
    else setRows(data || []);
    setLoading(false);
  }, [tableName, orderBy, ascending]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const insertRow = async (values) => {
    const { data, error } = await supabase.from(tableName).insert(values).select();
    if (error) throw new Error(error.message);
    setRows((prev) => [...(data || []), ...prev]);
    return data;
  };

  const updateRow = async (id, values) => {
    const { data, error } = await supabase
      .from(tableName)
      .update(values)
      .eq("id", id)
      .select();
    if (error) throw new Error(error.message);
    setRows((prev) => prev.map((r) => (r.id === id ? data[0] : r)));
    return data;
  };

  const deleteRow = async (id) => {
    const { error } = await supabase.from(tableName).delete().eq("id", id);
    if (error) throw new Error(error.message);
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return { rows, loading, error, refetch: fetchRows, insertRow, updateRow, deleteRow };
}
