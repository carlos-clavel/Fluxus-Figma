import { useState } from "react";
import type { Student, WithdrawalMode } from "../data";
import { receptions, guardians } from "../data";

interface Props {
  students: Student[];
  receptionId: string;
  onStatusChange: (id: string, status: Student["status"]) => void;
}

const ModeIcon = ({ mode }: { mode?: WithdrawalMode }) => {
  if (mode === "car") return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h11l4 4 2 1v4a2 2 0 01-2 2h-2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
    </svg>
  );
  if (mode === "walk") return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="4" r="1.5" /><path d="M9 8l3 2 2 5-2 4m-3-11l-2 5 2 1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return null;
};

const statusConfig = {
  waiting: { label: "AGUARDANDO", sub: "Aguardando aviso", bg: "bg-[var(--navy-900)]", badgeBg: "bg-[var(--navy-800)]" },
  coming: { label: "A CAMINHO", sub: "Responsável a caminho", bg: "bg-[var(--navy-700)]", badgeBg: "bg-[var(--navy-600)]" },
  meeting: { label: "NO ENCONTRO", sub: "No ponto de encontro", bg: "bg-[var(--blue-500)]", badgeBg: "bg-[var(--blue-400)]" },
  out: { label: "SAÍDAS HOJE", sub: "Saída registrada", bg: "bg-[var(--slate-500)]", badgeBg: "bg-[var(--slate-300)] !text-[var(--navy-800)]" },
};

interface NoticeModalProps {
  student: Student;
  onConfirm: (mode: WithdrawalMode, guardianId: string) => void;
  onClose: () => void;
}

function NoticeModal({ student, onConfirm, onClose }: NoticeModalProps) {
  const [mode, setMode] = useState<WithdrawalMode>("car");
  const [guardianId, setGuardianId] = useState(student.guardians[0]?.id ?? "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-700 text-[var(--navy-900)] text-xl">Registrar Aviso de Chegada</h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--navy-900)] text-xl leading-none">×</button>
        </div>

        <div className="bg-[var(--slate-100)] rounded-xl p-4 mb-5">
          <p className="font-600 text-[var(--navy-900)]">{student.name}</p>
          <p className="text-sm text-[var(--text-muted)]">{student.grade}</p>
        </div>

        <div className="mb-4">
          <p className="text-xs font-600 uppercase tracking-wider text-[var(--text-muted)] mb-2">Responsável</p>
          <select
            value={guardianId}
            onChange={(e) => setGuardianId(e.target.value)}
            className="w-full border border-[var(--slate-300)] rounded-lg px-3 py-2.5 text-sm text-[var(--navy-900)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)]"
          >
            {student.guardians.map((g) => (
              <option key={g.id} value={g.id}>{g.name} ({g.relation})</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <p className="text-xs font-600 uppercase tracking-wider text-[var(--text-muted)] mb-2">Modo de retirada</p>
          <div className="grid grid-cols-2 gap-2">
            {([["car", "🚗", "De carro"], ["walk", "🚶", "A pé"]] as const).map(([m, icon, label]) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-500 transition-all ${
                  mode === m
                    ? "border-[var(--blue-500)] bg-[var(--blue-100)] text-[var(--navy-800)]"
                    : "border-[var(--slate-300)] text-[var(--text-secondary)] hover:border-[var(--blue-300)]"
                }`}
              >
                <span className="text-lg">{icon}</span> {label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onConfirm(mode, guardianId)}
          className="w-full bg-[var(--navy-800)] hover:bg-[var(--navy-900)] text-white font-600 py-3 rounded-xl transition-colors"
        >
          Confirmar Aviso
        </button>
      </div>
    </div>
  );
}

export default function ReceptionPanel({ students, receptionId, onStatusChange }: Props) {
  const [noticeTarget, setNoticeTarget] = useState<Student | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<Student | null>(null);

  const filtered = students.filter((s) => s.receptionId === receptionId);
  const reception = receptions.find((r) => r.id === receptionId);

  const byStatus = (status: Student["status"]) => filtered.filter((s) => s.status === status);

  const waiting = byStatus("waiting");
  const coming = byStatus("coming");
  const meeting = byStatus("meeting");
  const out = byStatus("out");

  const handleNoticeConfirm = (mode: WithdrawalMode, _guardianId: string) => {
    if (!noticeTarget) return;
    onStatusChange(noticeTarget.id, "coming");
    setNoticeTarget(null);
  };

  return (
    <div className="space-y-4">
      {/* Reception info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-700 text-[var(--navy-900)] text-lg">{reception?.name}</h2>
          <p className="text-sm text-[var(--text-muted)]">{reception?.location}</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs text-[var(--text-muted)]">Total em andamento</p>
          <p className="font-display font-700 text-2xl text-[var(--navy-900)]">{waiting.length + coming.length + meeting.length}</p>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(["waiting", "coming", "meeting", "out"] as const).map((status) => {
          const cfg = statusConfig[status];
          const count = byStatus(status).length;
          const subCount = status === "out" ? out.filter((s) => s.exitTime).length : count;
          return (
            <div key={status} className={`${cfg.bg} text-white rounded-2xl p-4 text-center`}>
              <p className="font-display font-800 text-4xl mb-1">{count}</p>
              <p className="font-700 text-sm tracking-widest uppercase">{cfg.label}</p>
              <div className={`mt-3 flex items-center justify-between px-2 py-1 rounded-lg bg-black/20`}>
                <p className="text-xs opacity-80 truncate">{cfg.sub}</p>
                <span className="ml-1 bg-white/20 text-white text-xs font-600 w-5 h-5 flex-shrink-0 rounded flex items-center justify-center">{subCount}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* WAITING */}
        <div className="space-y-2">
          {waiting.map((s) => (
            <div key={s.id} className="bg-white rounded-xl p-3 shadow-sm border border-[var(--slate-300)] slide-in hover:shadow-md transition-shadow">
              <p className="font-600 text-[var(--navy-900)] text-sm">{s.name}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.grade} · {reception?.name.split(" ")[0]}</p>
              <button
                onClick={() => setNoticeTarget(s)}
                className="mt-2 w-full text-xs font-600 py-1.5 rounded-lg bg-[var(--slate-100)] text-[var(--navy-700)] hover:bg-[var(--blue-100)] hover:text-[var(--navy-800)] transition-colors border border-[var(--slate-300)]"
              >
                + Registrar Aviso
              </button>
            </div>
          ))}
          {waiting.length === 0 && <EmptyCol label="Nenhum aluno aguardando" />}
        </div>

        {/* COMING */}
        <div className="space-y-2">
          {coming.map((s) => {
            const guardian = s.confirmedBy ? guardians.find((g) => g.id === s.confirmedBy) : null;
            return (
              <div key={s.id} className="bg-white rounded-xl p-3 shadow-sm border border-[var(--slate-300)] slide-in hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-600 text-[var(--navy-900)] text-sm">{s.name}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.grade}</p>
                  </div>
                  <span className="text-[var(--navy-600)] mt-0.5"><ModeIcon mode={s.mode} /></span>
                </div>
                {guardian && (
                  <p className="text-xs text-[var(--text-secondary)] mt-1.5 bg-[var(--slate-100)] rounded-md px-2 py-1">
                    {guardian.name}
                  </p>
                )}
                {s.noticeTime && (
                  <p className="text-xs text-[var(--text-muted)] font-mono mt-1">Aviso: {s.noticeTime}</p>
                )}
                <button
                  onClick={() => onStatusChange(s.id, "meeting")}
                  className="mt-2 w-full text-xs font-600 py-1.5 rounded-lg bg-[var(--navy-700)] text-white hover:bg-[var(--navy-900)] transition-colors"
                >
                  Direcionar ao Ponto
                </button>
              </div>
            );
          })}
          {coming.length === 0 && <EmptyCol label="Nenhum responsável a caminho" />}
        </div>

        {/* MEETING */}
        <div className="space-y-2">
          {meeting.map((s) => {
            const guardian = s.confirmedBy ? guardians.find((g) => g.id === s.confirmedBy) : null;
            return (
              <div key={s.id} className="bg-white rounded-xl p-3 shadow-sm border border-[var(--blue-300)] slide-in hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-600 text-[var(--navy-900)] text-sm">{s.name}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.grade}</p>
                  </div>
                  <span className="text-[var(--blue-500)]"><ModeIcon mode={s.mode} /></span>
                </div>
                {guardian && (
                  <p className="text-xs text-[var(--text-secondary)] mt-1.5 bg-[var(--blue-100)] rounded-md px-2 py-1">
                    {guardian.name}
                  </p>
                )}
                <button
                  onClick={() => setConfirmTarget(s)}
                  className="mt-2 w-full text-xs font-700 py-1.5 rounded-lg bg-[var(--blue-500)] text-white hover:bg-[var(--navy-700)] transition-colors uppercase tracking-wide"
                >
                  Confirmar Saída
                </button>
              </div>
            );
          })}
          {meeting.length === 0 && <EmptyCol label="Nenhum aluno no ponto de encontro" />}
        </div>

        {/* OUT */}
        <div className="space-y-2">
          {out.map((s) => (
            <div key={s.id} className="bg-white rounded-xl p-3 shadow-sm border border-[var(--slate-300)] slide-in opacity-75 hover:opacity-100 transition-opacity">
              <p className="font-600 text-[var(--navy-900)] text-sm">{s.name}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.grade}</p>
              {s.exitTime && (
                <p className="text-xs font-mono text-[var(--green-500)] mt-1.5 font-600">✓ {s.exitTime}</p>
              )}
            </div>
          ))}
          {out.length === 0 && <EmptyCol label="Nenhuma saída registrada" />}
        </div>
      </div>

      {/* Notice modal */}
      {noticeTarget && (
        <NoticeModal
          student={noticeTarget}
          onConfirm={handleNoticeConfirm}
          onClose={() => setNoticeTarget(null)}
        />
      )}

      {/* Confirm exit modal */}
      {confirmTarget && (
        <ConfirmExitModal
          student={confirmTarget}
          onConfirm={() => { onStatusChange(confirmTarget.id, "out"); setConfirmTarget(null); }}
          onClose={() => setConfirmTarget(null)}
        />
      )}
    </div>
  );
}

function EmptyCol({ label }: { label: string }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-[var(--slate-300)] p-4 text-center">
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
    </div>
  );
}

function ConfirmExitModal({ student, onConfirm, onClose }: { student: Student; onConfirm: () => void; onClose: () => void }) {
  const guardian = student.confirmedBy ? guardians.find((g) => g.id === student.confirmedBy) : student.guardians[0];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 slide-in" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-5">
          <div className="w-14 h-14 bg-[var(--blue-100)] rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-[var(--blue-500)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="font-display font-700 text-[var(--navy-900)] text-xl">Confirmar Saída</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">Verifique os dados antes de confirmar</p>
        </div>

        <div className="bg-[var(--slate-100)] rounded-xl p-4 space-y-2 mb-5">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Aluno</span>
            <span className="font-600 text-[var(--navy-900)]">{student.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Turma</span>
            <span className="font-600 text-[var(--navy-900)]">{student.grade}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Responsável</span>
            <span className="font-600 text-[var(--navy-900)]">{guardian?.name ?? "—"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Vínculo</span>
            <span className="font-600 text-[var(--navy-900)]">{guardian?.relation ?? "—"}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[var(--slate-300)] text-sm font-600 text-[var(--text-secondary)] hover:bg-[var(--slate-100)] transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-[var(--green-500)] text-white text-sm font-700 hover:bg-green-600 transition-colors">
            Confirmar Saída ✓
          </button>
        </div>
      </div>
    </div>
  );
}
