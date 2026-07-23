import { useState } from "react";
import { useAuth } from "../lib/AuthContext";

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) setError("E-mail ou senha inválidos.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900 px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img src="/assets/logo-2m.png" alt="2M Freight and Logistics" className="h-20 w-auto" />
        </div>
        <div className="manifest-strip mb-8" />

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-xl">
          <h1 className="font-display text-lg font-bold text-navy-800 mb-1">Acessar o ERP</h1>
          <p className="text-sm text-navy-400 mb-5">Entre com suas credenciais da 2M Freight.</p>

          <label className="block mb-3">
            <span className="block text-xs font-medium text-navy-500 mb-1">E-mail</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              placeholder="voce@2mfreight.com"
            />
          </label>

          <label className="block mb-4">
            <span className="block text-xs font-medium text-navy-500 mb-1">Senha</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              placeholder="••••••••"
            />
          </label>

          {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold text-sm py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="text-center text-navy-400 text-xs mt-5">
          Usuários são criados manualmente no painel do Supabase (Authentication → Users).
        </p>
      </div>
    </div>
  );
}
