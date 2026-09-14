import React from "react";
import { LayoutDashboard, Users, Bell } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: "dashboard" | "catalog";
  setActiveTab: (tab: "dashboard" | "catalog") => void;
}

export default function Layout({
  children,
  activeTab,
  setActiveTab,
}: LayoutProps) {

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 antialiased overflow-hidden select-none">
      {/* Боковое меню */}
      <aside className="w-64 bg-[var(--color-brand-purple)] text-slate-400 flex flex-col p-4 shadow-xl z-10">
        <div className="pt-4 pb-4 px-2 mb-6 border-b border-slate-700/40">
          <h1 className="text-base font-black text-white tracking-wider font-brand-heading uppercase">
            Государственный реестр
          </h1>
        </div>

        <nav className="space-y-1 flex-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-wider font-brand-heading uppercase ${
              activeTab === "dashboard"
                ? "bg-slate-700/60 text-white border border-slate-600/30"
                : "hover:bg-slate-700/30 hover:text-slate-200"
            }`}
          >
            <LayoutDashboard
              size={16}
              className={
                activeTab === "dashboard" ? "text-white" : "text-slate-400"
              }
            />
            Главная страница
          </button>
          <button
            onClick={() => setActiveTab("catalog")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-wider font-brand-heading uppercase ${
              activeTab === "catalog"
                ? "bg-slate-700/60 text-white border border-slate-600/30"
                : "hover:bg-slate-700/30 hover:text-slate-200"
            }`}
          >
            <Users
              size={16}
              className={
                activeTab === "catalog" ? "text-white" : "text-slate-400"
              }
            />
            Картотека заявок
          </button>
        </nav>
      </aside>

      {/* Основная область */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Верхняя шапка */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-slate-800 text-base tracking-tight font-brand-heading">
              {activeTab === "dashboard"
                ? "Аналитика"
                : "Реестр обращений граждан"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-all relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-700 font-brand-heading">
                  Иван Калугин
                </p>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-brand-heading">
                  Ведущий аналитик ситуационного центра
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 border border-slate-200/60 font-bold flex items-center justify-center text-xs shadow-inner font-brand-heading">
                ИК
              </div>
            </div>
          </div>
        </header>

        {/* Рабочая область */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#f8fafc]">
          {children}
        </main>
      </div>
    </div>
  );
}
