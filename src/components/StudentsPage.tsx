import { useState } from "react";
import type { Student, Guardian } from "../data";
import { receptions, guardians as allGuardians } from "../data";

interface Props {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const statusLabel: Record<Student["status"], string> = {
  waiting: "Aguardando",
  coming: "A caminho",
  meeting: "No encontro",
  out: "Saiu",
};

const statusClass: Record<Student["status"], string> = {
  waiting: "status-badge-waiting",
  coming: "status-badge-coming",
  meeting: "status-badge-meeting",
  out: "status-badge-out",
};

export default function StudentsPage({ students, setStudents }: Props) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Student["status"] | "all">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Student | null>(null);

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.grade.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleAdd = (data: Omit<Student, "id" | "status">) => {
    const newStudent: Student = {
      ...data,
      id: `s${Date.now()}`,
      status: "waiting",
    };
    setStudents((prev) => [...prev, newStudent]);
    setShowAdd(false);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2 flex-1">
          <div className="relative flex-1 min-w-48">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nome ou turma..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--slate-300)] bg-white text-sm text-[var(--navy-900)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)]"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Student["status"] | "all")}
            className="px-3 py-2.5 rounded-xl border border-[var(--slate-300)] bg-white text-sm text-[var(--navy-900)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)]"
          >
            <option value="all">Todos os status</option>
            <option value="waiting">Aguardando</option>
            <option value="coming">A caminho</option>
            <option value="meeting">No encontro</option>
            <option value="out">Saiu</option>
          </select>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--navy-800)] text-white rounded-xl text-sm font-600 hover:bg-[var(--navy-900)] transition-colors"
        >
          <span className="text-lg leading-none">+</span> Cadastrar Aluno
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["waiting", "coming", "meeting", "out"] as const).map((status) => {
          const count = students.filter((s) => s.status === status).length;
          return (
            <div key={status} className="bg-white rounded-xl p-4 border border-[var(--slate-300)] shadow-sm text-center">
              <p className="font-display font-700 text-2xl text-[var(--navy-900)]">{count}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{statusLabel[status]}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[var(--slate-300)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--slate-300)] bg-[var(--slate-100)]">
                <th className="text-left px-4 py-3 text-xs font-700 uppercase tracking-wider text-[var(--text-muted)]">Aluno</th>
                <th className="text-left px-4 py-3 text-xs font-700 uppercase tracking-wider text-[var(--text-muted)] hidden sm:table-cell">Turma</th>
                <th className="text-left px-4 py-3 text-xs font-700 uppercase tracking-wider text-[var(--text-muted)] hidden md:table-cell">Responsáveis</th>
                <th className="text-left px-4 py-3 text-xs font-700 uppercase tracking-wider text-[var(--text-muted)] hidden lg:table-cell">Recepção</th>
                <th className="text-left px-4 py-3 text-xs font-700 uppercase tracking-wider text-[var(--text-muted)]">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const reception = receptions.find((r) => r.id === s.receptionId);
                return (
                  <tr key={s.id} className="border-b border-[var(--slate-100)] hover:bg-[var(--slate-100)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[var(--navy-800)] rounded-full flex items-center justify-center text-white text-xs font-600 flex-shrink-0">
                          {s.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <span className="font-500 text-[var(--navy-900)]">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] hidden sm:table-cell">{s.grade}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {s.guardians.slice(0, 2).map((g) => (
                          <span key={g.id} className="text-xs bg-[var(--slate-100)] border border-[var(--slate-300)] rounded-md px-1.5 py-0.5 text-[var(--text-secondary)]">{g.name.split(" ")[0]}</span>
                        ))}
                        {s.guardians.length > 2 && <span className="text-xs text-[var(--text-muted)]">+{s.guardians.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] hidden lg:table-cell">{reception?.name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-500 ${statusClass[s.status]}`}>
                        {statusLabel[s.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(s)}
                        className="text-[var(--blue-500)] hover:text-[var(--navy-800)] text-xs font-500 transition-colors"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[var(--text-muted)] text-sm">Nenhum aluno encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add modal */}
      {showAdd && <AddStudentModal onSave={handleAdd} onClose={() => setShowAdd(false)} />}
      {selected && <StudentDetailModal student={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function AddStudentModal({ onSave, onClose }: { onSave: (data: Omit<Student, "id" | "status">) => void; onClose: () => void }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [institution, setInstitution] = useState("Escola Estadual Boa Vista");
  const [receptionId, setReceptionId] = useState("r1");
  const [selectedGuardians, setSelectedGuardians] = useState<string[]>([]);

  const toggle = (id: string) => setSelectedGuardians((prev) => prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]);

  const handleSave = () => {
    if (!name.trim() || !grade.trim()) return;
    onSave({
      name,
      grade,
      institution,
      receptionId,
      guardians: allGuardians.filter((g) => selectedGuardians.includes(g.id)),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 slide-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-700 text-[var(--navy-900)] text-xl">Cadastrar Aluno</h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--navy-900)] text-xl">×</button>
        </div>
        <div className="space-y-4">
          <Field label="Nome completo"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do aluno" className="input-field" /></Field>
          <Field label="Turma"><input value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Ex: 7º ano A" className="input-field" /></Field>
          <Field label="Instituição"><input value={institution} onChange={(e) => setInstitution(e.target.value)} className="input-field" /></Field>
          <Field label="Recepção">
            <select value={receptionId} onChange={(e) => setReceptionId(e.target.value)} className="input-field">
              {receptions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </Field>
          <div>
            <p className="text-xs font-600 uppercase tracking-wider text-[var(--text-muted)] mb-2">Responsáveis autorizados</p>
            <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
              {allGuardians.map((g) => (
                <label key={g.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors text-sm ${selectedGuardians.includes(g.id) ? "border-[var(--blue-500)] bg-[var(--blue-100)]" : "border-[var(--slate-300)] hover:border-[var(--blue-300)]"}`}>
                  <input type="checkbox" checked={selectedGuardians.includes(g.id)} onChange={() => toggle(g.id)} className="hidden" />
                  <span className="font-500 text-[var(--navy-900)] truncate">{g.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[var(--slate-300)] text-sm font-600 text-[var(--text-secondary)] hover:bg-[var(--slate-100)] transition-colors">Cancelar</button>
          <button onClick={handleSave} disabled={!name.trim() || !grade.trim()} className="flex-1 py-2.5 rounded-xl bg-[var(--navy-800)] text-white text-sm font-700 hover:bg-[var(--navy-900)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Salvar Aluno</button>
        </div>
      </div>
    </div>
  );
}

function StudentDetailModal({ student, onClose }: { student: Student; onClose: () => void }) {
  const reception = receptions.find((r) => r.id === student.receptionId);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 slide-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[var(--navy-800)] rounded-full flex items-center justify-center text-white font-700">
              {student.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div>
              <h2 className="font-display font-700 text-[var(--navy-900)] text-xl">{student.name}</h2>
              <p className="text-sm text-[var(--text-muted)]">{student.grade} · {student.institution}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--navy-900)] text-xl">×</button>
        </div>
        <div className="space-y-3">
          <InfoRow label="Status"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-500 status-badge-${student.status}`}>{({ waiting: "Aguardando", coming: "A caminho", meeting: "No encontro", out: "Saiu" })[student.status]}</span></InfoRow>
          <InfoRow label="Recepção">{reception?.name ?? "—"}</InfoRow>
          {student.exitTime && <InfoRow label="Saída registrada"><span className="font-mono text-[var(--green-500)] font-600">{student.exitTime}</span></InfoRow>}
          <div className="pt-2">
            <p className="text-xs font-600 uppercase tracking-wider text-[var(--text-muted)] mb-2">Responsáveis autorizados</p>
            <div className="space-y-2">
              {student.guardians.map((g) => (
                <div key={g.id} className="flex items-center justify-between bg-[var(--slate-100)] rounded-lg px-3 py-2">
                  <div>
                    <p className="font-500 text-[var(--navy-900)] text-sm">{g.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{g.relation}</p>
                  </div>
                  <p className="text-xs font-mono text-[var(--text-secondary)]">{g.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-600 uppercase tracking-wider text-[var(--text-muted)] mb-1.5">{label}</p>
      {children}
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[var(--slate-100)]">
      <span className="text-sm text-[var(--text-muted)]">{label}</span>
      <span className="text-sm font-500 text-[var(--navy-900)]">{children}</span>
    </div>
  );
}

// Injecting a small global for input-field
const style = document.createElement("style");
style.textContent = `.input-field { width: 100%; border: 1px solid var(--slate-300); border-radius: 0.75rem; padding: 0.625rem 0.75rem; font-size: 0.875rem; color: var(--navy-900); background: white; outline: none; } .input-field:focus { box-shadow: 0 0 0 2px var(--blue-300); border-color: var(--blue-500); }`;
document.head.appendChild(style);
