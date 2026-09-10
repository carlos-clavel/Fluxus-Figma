import { useState } from "react";
import ReceptionPanel from "./components/ReceptionPanel";
import StudentsPage from "./components/StudentsPage";
import ReportsPage from "./components/ReportsPage";
import GuardiansPage from "./components/GuardiansPage";
import { students as initialStudents, receptions } from "./data";
import type { Student } from "./data";

type Page = "reception" | "students" | "guardians" | "reports";

export default function App() {
  const [page, setPage] = useState<Page>("reception");
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [selectedReceptionId, setSelectedReceptionId] = useState("r1");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleStatusChange = (studentId: string, newStatus: Student["status"]) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const now = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
        return {
          ...s,
          status: newStatus,
          exitTime: newStatus === "out" ? now : s.exitTime,
        };
      })
    );
  };

  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: "reception", label: "Painel da Recepção", icon: "🖥️" },
    { id: "students", label: "Alunos", icon: "🎒" },
    { id: "guardians", label: "Responsáveis", icon: "👤" },
    { id: "reports", label: "Relatórios", icon: "📊" },
  ];

  return (
    <div className="flex h-full bg-[var(--slate-100)]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-[var(--navy-900)] transition-all duration-300 ${
          sidebarOpen ? "w-56" : "w-16"
        } lg:relative lg:w-56 lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="flex-shrink-0 w-8 h-8 bg-[var(--blue-500)] rounded-lg flex items-center justify-center">
            <FluxusIcon />
          </div>
          <div className={`overflow-hidden transition-all duration-300 ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"} lg:w-auto lg:opacity-100`}>
            <p className="font-display font-700 text-white text-lg leading-none">Fluxus</p>
            <p className="text-[var(--slate-300)] text-xs">Gestão Escolar</p>
          </div>
        </div>

        {/* Reception selector */}
        <div className={`px-3 py-3 border-b border-white/10 ${sidebarOpen ? "" : "hidden"} lg:block`}>
          <p className="text-[var(--slate-300)] text-xs font-500 uppercase tracking-wider mb-2 px-1">Recepção ativa</p>
          <div className="space-y-1">
            {receptions.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedReceptionId(r.id)}
                className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                  selectedReceptionId === r.id
                    ? "bg-[var(--blue-500)] text-white font-500"
                    : "text-[var(--slate-300)] hover:bg-white/10 hover:text-white"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setPage(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-500 transition-all ${
                page === item.id
                  ? "bg-[var(--blue-500)] text-white shadow-sm"
                  : "text-[var(--slate-300)] hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              <span className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"} lg:w-auto lg:opacity-100`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className={`px-4 py-4 border-t border-white/10 ${sidebarOpen ? "" : "hidden"} lg:block`}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[var(--blue-400)] rounded-full flex items-center justify-center text-white text-xs font-600">
              ES
            </div>
            <div>
              <p className="text-white text-xs font-500">Escola Boa Vista</p>
              <p className="text-[var(--slate-300)] text-xs">Administrador</p>
            </div>
          </div>
        </div>

        {/* Toggle button (mobile) */}
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="absolute top-5 -right-3 w-6 h-6 bg-[var(--navy-700)] border border-white/20 rounded-full flex items-center justify-center text-white text-xs lg:hidden"
        >
          {sidebarOpen ? "‹" : "›"}
        </button>
      </aside>

      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-[var(--slate-300)] shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--slate-100)] text-[var(--navy-800)]"
            >
              ☰
            </button>
            <div>
              <h1 className="font-display font-700 text-[var(--navy-900)] text-base leading-tight">
                {navItems.find((n) => n.id === page)?.label}
              </h1>
              {page === "reception" && (
                <p className="text-xs text-[var(--text-muted)]">
                  {receptions.find((r) => r.id === selectedReceptionId)?.location}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-500 text-[var(--green-500)]">
              <span className="live-dot inline-block w-2 h-2 rounded-full bg-[var(--green-500)]" />
              ao vivo
            </span>
            <div className="font-mono text-xs text-[var(--text-muted)] hidden sm:block">
              {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {page === "reception" && (
            <ReceptionPanel
              students={students}
              receptionId={selectedReceptionId}
              onStatusChange={handleStatusChange}
            />
          )}
          {page === "students" && (
            <StudentsPage students={students} setStudents={setStudents} />
          )}
          {page === "guardians" && <GuardiansPage />}
          {page === "reports" && <ReportsPage students={students} />}
        </div>
      </main>
    </div>
  );
}

function FluxusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}
