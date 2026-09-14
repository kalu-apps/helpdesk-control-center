import { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTicketStore } from "../../store/useTicketStore";
import { SERVICE_FIELDS } from "../ticket/fields.config";

interface ExecutorEfficiencyChartProps {
  executorData: Array<{ name: string; resolved: number; overdue: number }>;
}

// Столбчатый график «Нагрузка на сотрудников» с фильтром 
export default function ExecutorEfficiencyChart({
  executorData,
}: ExecutorEfficiencyChartProps) {
  const { dashboardCategoryFilter, setDashboardCategoryFilter } =
    useTicketStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const incidentField = SERVICE_FIELDS.find((f) => f.name === "incidentType");
  const currentCategoryLabel =
    dashboardCategoryFilter === "all"
      ? "Все категории СЭД"
      : dashboardCategoryFilter;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col w-full h-[390px] justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 shrink-0">
        <div>
          <p className="text-base font-black text-slate-900 tracking-tight uppercase font-brand-heading">
            Нагрузка на сотрудников
          </p>
        </div>

        <div ref={dropdownRef} className="relative select-none z-30">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center bg-slate-50 px-4 py-1.5 rounded-xl border transition-all text-xs font-black tracking-wider uppercase cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_16px] bg-[position:right_12px_center] bg-no-repeat pr-8 ${
              isDropdownOpen || dashboardCategoryFilter !== "all"
                ? "border-slate-400 text-slate-900 bg-slate-100/50"
                : "border-slate-200/40 text-slate-600 hover:bg-slate-100/80"
            }`}
          >
            {currentCategoryLabel}
          </button>

          {isDropdownOpen && (
            <ul className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200/80 rounded-xl shadow-xl py-1 text-[11px] font-bold tracking-wider uppercase text-slate-600 max-h-60 overflow-y-auto z-50">
              <li
                onClick={() => {
                  setDashboardCategoryFilter("all");
                  setIsDropdownOpen(false);
                }}
                className={`px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                  dashboardCategoryFilter === "all"
                    ? "bg-slate-50 text-slate-900 font-black border-l-2 border-slate-800"
                    : ""
                }`}
              >
                Все категории СЭД
              </li>

              {incidentField?.options?.map((opt) => (
                <li
                  key={opt}
                  onClick={() => {
                    setDashboardCategoryFilter(opt);
                    setIsDropdownOpen(false);
                  }}
                  className={`px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors normal-case text-xs text-slate-700 font-semibold ${
                    dashboardCategoryFilter === opt
                      ? "bg-slate-50 text-slate-900 font-black border-l-2 border-slate-800"
                      : ""
                  }`}
                >
                  {opt}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Контейнер Recharts для построения столбчатых диаграмм */}
      <div className="h-64 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={executorData}
            margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />

            {/* Горизонтальная ось X с полным скрытием ФИО для исключения визуальной каши */}
            <XAxis
              dataKey="name"
              stroke="#475569"
              tickLine={false}
              tick={false}
            />
            <YAxis
              stroke="#475569"
              tickLine={true}
              tick={{ fill: "#334155", fontWeight: 700, fontSize: 10 }}
              tickFormatter={(value) =>
                value === 0 ? "" : value.toLocaleString()
              }
            />
            <Tooltip cursor={{ fill: "#f1f5f9" }} trigger="hover" />
            <Legend
              iconType="circle"
              wrapperStyle={{
                paddingTop: "5px",
                fontWeight: 600,
                color: "#334155",
              }}
            />
            <Bar
              dataKey="resolved"
              name="Выполнено"
              fill="var(--color-ui-resolved)"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            />
            <Bar
              dataKey="overdue"
              name="Просрочено"
              fill="var(--color-ui-overdue)"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
