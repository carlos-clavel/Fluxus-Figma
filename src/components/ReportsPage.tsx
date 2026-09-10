import type { Student } from "../data";
import { receptions, notices } from "../data";

interface Props {
  students: Student[];
}

function StatCard({ value, label, sub, color }: { value: string | number; label: string; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[var(--slate-300)] shadow-sm">
      <p className={`font-display font-800 text-4xl ${color}`}>{value}</p>
      <p className="font-600 text-[var(--navy-900)] text-sm mt-1">{label}</p>
      {sub && <p className="text-xs text-[var(--text-muted)] mt-0.5">{sub}</p>}
    </div>
  );
}

function BarChart({ data, label }: { data: { name: string; value: number; color: string }[]; label: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div>
      <p className="text-xs font-600 uppercase tracking-wider text-[var(--text-muted)] mb-3">{label}</p>
      <div className="space-y-2.5">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-3">
            <span className="text-sm text-[var(--text-secondary)] w-28 flex-shrink-0 truncate">{d.name}</span>
            <div className="flex-1 bg-[var(--slate-100)] rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${d.color}`}
                style={{ width: `${(d.value / max) * 100}%` }}
              />
            </div>
            <span className="font-mono text-xs font-600 text-[var(--navy-900)] w-6 text-right">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutSegments({ data }: { data: { label: string; value: number; color: string; bg: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <p className="text-sm text-[var(--text-muted)]">Sem dados</p>;

  let offset = 0;
  const r = 30;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-6">
      <svg width="80" height="80" viewBox="0 0 80 80">
        {data.map((d, i) => {
          const pct = d.value / total;
          const dash = pct * circumference;
          const seg = (
            <circle
              key={i}
              cx="40" cy="40" r={r}
              fill="none"
              stroke={d.color}
              strokeWidth="12"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 40 40)"
            />
          );
          offset += dash;
          return seg;
        })}
        <text x="40" y="44" textAnchor="middle" className="font-display" style={{ fontSize: 14, fontWeight: 700, fill: "var(--navy-900)", fontFamily: "Outfit, sans-serif" }}>{total}</text>
      </svg>
      <div className="space-y-1.5">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span className="text-xs text-[var(--text-secondary)]">{d.label}</span>
            <span className="font-mono text-xs font-600 text-[var(--navy-900)] ml-auto">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReportsPage({ students }: Props) {
  const total = students.length;
  const byStatus = {
    waiting: students.filter((s) => s.status === "waiting").length,
    coming: students.filter((s) => s.status === "coming").length,
    meeting: students.filter((s) => s.status === "meeting").length,
    out: students.filter((s) => s.status === "out").length,
  };

  const byReception = receptions.map((r) => ({
    name: r.name.replace("Recepção ", ""),
    value: students.filter((s) => s.receptionId === r.id && s.status === "out").length,
    color: "bg-[var(--navy-700)]",
  }));

  const byMode = [
    { name: "De carro", value: notices.filter((n) => n.mode === "car").length, color: "bg-[var(--blue-500)]" },
    { name: "A pé", value: notices.filter((n) => n.mode === "walk").length, color: "bg-[var(--blue-300)]" },
    { name: "Sem retirada", value: notices.filter((n) => n.mode === "none").length, color: "bg-[var(--slate-300)]" },
  ];

  const exitTimes = students.filter((s) => s.exitTime && s.noticeTime).map((s) => {
    const [eh, em] = (s.exitTime ?? "0:0").split(":").map(Number);
    const [nh, nm] = (s.noticeTime ?? "0:0").split(":").map(Number);
    return (eh * 60 + em) - (nh * 60 + nm);
  });
  const avgWait = exitTimes.length > 0 ? Math.round(exitTimes.reduce((a, b) => a + b, 0) / exitTimes.length) : 0;

  const recentExits = students.filter((s) => s.status === "out" && s.exitTime).sort((a, b) => (b.exitTime ?? "").localeCompare(a.exitTime ?? "")).slice(0, 8);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard value={total} label="Alunos totais" sub="neste painel" color="text-[var(--navy-900)]" />
        <StatCard value={byStatus.out} label="Saídas hoje" sub="confirmadas" color="text-[var(--green-500)]" />
        <StatCard value={byStatus.waiting + byStatus.coming + byStatus.meeting} label="Em andamento" sub="ativos agora" color="text-[var(--blue-500)]" />
        <StatCard value={`${avgWait} min`} label="Tempo médio" sub="aviso → saída" color="text-[var(--amber-500)]" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Status donut */}
        <div className="bg-white rounded-2xl p-5 border border-[var(--slate-300)] shadow-sm">
          <p className="font-display font-700 text-[var(--navy-900)] text-base mb-4">Alunos por Status</p>
          <DonutSegments data={[
            { label: "Aguardando", value: byStatus.waiting, color: "var(--navy-900)", bg: "" },
            { label: "A caminho", value: byStatus.coming, color: "var(--amber-500)", bg: "" },
            { label: "No encontro", value: byStatus.meeting, color: "var(--blue-500)", bg: "" },
            { label: "Saiu", value: byStatus.out, color: "var(--green-500)", bg: "" },
          ]} />
        </div>

        {/* Mode bar */}
        <div className="bg-white rounded-2xl p-5 border border-[var(--slate-300)] shadow-sm">
          <p className="font-display font-700 text-[var(--navy-900)] text-base mb-4">Avisos por Modo de Retirada</p>
          <BarChart data={byMode} label="Avisos enviados" />
        </div>

        {/* By reception */}
        <div className="bg-white rounded-2xl p-5 border border-[var(--slate-300)] shadow-sm">
          <p className="font-display font-700 text-[var(--navy-900)] text-base mb-4">Saídas por Recepção</p>
          <BarChart data={byReception} label="Saídas confirmadas" />
        </div>
      </div>

      {/* Recent exits table */}
      <div className="bg-white rounded-2xl border border-[var(--slate-300)] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--slate-100)] flex items-center justify-between">
          <p className="font-display font-700 text-[var(--navy-900)]">Saídas Recentes</p>
          <span className="text-xs text-[var(--text-muted)]">Hoje</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--slate-100)] bg-[var(--slate-100)]">
                <th className="text-left px-5 py-2.5 text-xs font-700 uppercase tracking-wider text-[var(--text-muted)]">Aluno</th>
                <th className="text-left px-5 py-2.5 text-xs font-700 uppercase tracking-wider text-[var(--text-muted)] hidden sm:table-cell">Turma</th>
                <th className="text-left px-5 py-2.5 text-xs font-700 uppercase tracking-wider text-[var(--text-muted)] hidden md:table-cell">Responsável</th>
                <th className="text-left px-5 py-2.5 text-xs font-700 uppercase tracking-wider text-[var(--text-muted)]">Horário</th>
                <th className="text-left px-5 py-2.5 text-xs font-700 uppercase tracking-wider text-[var(--text-muted)] hidden sm:table-cell">Modo</th>
              </tr>
            </thead>
            <tbody>
              {recentExits.map((s) => {
                const guardian = s.confirmedBy ? s.guardians.find((g) => g.id === s.confirmedBy) ?? s.guardians[0] : s.guardians[0];
                return (
                  <tr key={s.id} className="border-b border-[var(--slate-100)] hover:bg-[var(--slate-100)] transition-colors">
                    <td className="px-5 py-3 font-500 text-[var(--navy-900)]">{s.name}</td>
                    <td className="px-5 py-3 text-[var(--text-secondary)] hidden sm:table-cell">{s.grade}</td>
                    <td className="px-5 py-3 text-[var(--text-secondary)] hidden md:table-cell">{guardian?.name ?? "—"}</td>
                    <td className="px-5 py-3 font-mono font-600 text-[var(--green-500)]">{s.exitTime}</td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      {s.mode === "car" && <span className="text-xs bg-[var(--blue-100)] text-[var(--navy-800)] border border-[var(--blue-300)] rounded-full px-2 py-0.5">🚗 Carro</span>}
                      {s.mode === "walk" && <span className="text-xs bg-[var(--slate-100)] text-[var(--text-secondary)] border border-[var(--slate-300)] rounded-full px-2 py-0.5">🚶 A pé</span>}
                      {!s.mode && <span className="text-xs text-[var(--text-muted)]">—</span>}
                    </td>
                  </tr>
                );
              })}
              {recentExits.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-[var(--text-muted)]">Nenhuma saída registrada ainda.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flow explanation */}
      <div className="bg-[var(--navy-900)] rounded-2xl p-6 text-white">
        <p className="font-display font-700 text-xl mb-1">Fluxo de Retirada</p>
        <p className="text-[var(--slate-300)] text-sm mb-5">Como o Fluxus organiza a saída dos alunos</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { step: "01", label: "Aviso de Chegada", desc: "Responsável notifica o modo de retirada: carro ou a pé", icon: "📱" },
            { step: "02", label: "Direcionamento", desc: "Equipe escolar encaminha o aluno ao ponto de encontro", icon: "🏫" },
            { step: "03", label: "Validação", desc: "Responsável autorizado é confirmado pela recepção", icon: "🛡️" },
            { step: "04", label: "Saída Registrada", desc: "Retirada concluída e registrada com horário e responsável", icon: "✅" },
          ].map((s) => (
            <div key={s.step} className="relative">
              <div className="bg-white/10 rounded-xl p-4 h-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-[var(--blue-300)] font-600">{s.step}</span>
                  <span className="text-lg">{s.icon}</span>
                </div>
                <p className="font-600 text-white text-sm mb-1">{s.label}</p>
                <p className="text-xs text-[var(--slate-300)] leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-4">
          {[
            { label: "AGUARDANDO", color: "bg-[var(--navy-700)]" },
            { label: "A CAMINHO", color: "bg-[var(--blue-500)]" },
            { label: "NO ENCONTRO", color: "bg-[var(--blue-400)]" },
            { label: "SAÍDA", color: "bg-[var(--green-500)]" },
          ].map((s, i, arr) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className={`${s.color} text-white text-xs font-700 px-2.5 py-1 rounded-lg`}>{s.label}</span>
              {i < arr.length - 1 && <span className="text-[var(--slate-500)] text-sm">→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
