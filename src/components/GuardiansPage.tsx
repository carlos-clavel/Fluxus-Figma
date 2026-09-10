import { useState } from "react";
import { guardians as initialGuardians } from "../data";
import type { Guardian } from "../data";

export default function GuardiansPage() {
  const [guardians, setGuardians] = useState<Guardian[]>(initialGuardians);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = guardians.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.relation.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (name: string, relation: string, phone: string) => {
    setGuardians((prev) => [...prev, { id: `g${Date.now()}`, name, relation, phone }]);
    setShowAdd(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Buscar responsável..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--slate-300)] bg-white text-sm text-[var(--navy-900)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)]"
          />
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--navy-800)] text-white rounded-xl text-sm font-600 hover:bg-[var(--navy-900)] transition-colors"
        >
          <span className="text-lg leading-none">+</span> Cadastrar Responsável
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((g) => (
          <div key={g.id} className="bg-white rounded-xl p-4 border border-[var(--slate-300)] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[var(--blue-500)] rounded-full flex items-center justify-center text-white font-700 text-sm flex-shrink-0">
                {g.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div>
                <p className="font-600 text-[var(--navy-900)] text-sm">{g.name}</p>
                <span className="text-xs bg-[var(--slate-100)] border border-[var(--slate-300)] rounded-full px-2 py-0.5 text-[var(--text-secondary)]">{g.relation}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-mono">{g.phone}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-[var(--text-muted)] text-sm">
            Nenhum responsável encontrado.
          </div>
        )}
      </div>

      {showAdd && <AddGuardianModal onSave={handleAdd} onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function AddGuardianModal({ onSave, onClose }: { onSave: (name: string, relation: string, phone: string) => void; onClose: () => void }) {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("Mãe");
  const [phone, setPhone] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 slide-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-700 text-[var(--navy-900)] text-xl">Cadastrar Responsável</h2>
          <button onClick={onClose} className="text-[var(--text-muted)] text-xl">×</button>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-600 uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Nome completo</p>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do responsável" className="input-field" />
          </div>
          <div>
            <p className="text-xs font-600 uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Parentesco</p>
            <select value={relation} onChange={(e) => setRelation(e.target.value)} className="input-field">
              {["Mãe", "Pai", "Avó", "Avô", "Responsável", "Tio(a)", "Irmão(ã)"].map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <p className="text-xs font-600 uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Telefone</p>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(51) 99000-0000" className="input-field" />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[var(--slate-300)] text-sm font-600 text-[var(--text-secondary)] hover:bg-[var(--slate-100)] transition-colors">Cancelar</button>
          <button onClick={() => onSave(name, relation, phone)} disabled={!name.trim()} className="flex-1 py-2.5 rounded-xl bg-[var(--navy-800)] text-white text-sm font-700 hover:bg-[var(--navy-900)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Salvar</button>
        </div>
      </div>
    </div>
  );
}
