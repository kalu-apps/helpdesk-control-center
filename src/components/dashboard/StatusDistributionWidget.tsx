import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface StatusDistributionWidgetProps {
  counters: {
    total: number;
    newCount: number;
    inProgressCount: number;
    overdueCount: number;
    resolvedCount: number;
  };
  pieData: Array<{ name: string; value: number; color: string }>;
}

// Виджет «Статусы системы» с круговой диаграммой и детальной расшифровкой
export default function StatusDistributionWidget({
  counters,
  pieData,
}: StatusDistributionWidgetProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center h-[390px] justify-between overflow-hidden">
      <div className="w-full text-left mb-2 shrink-0">
        <p className="text-base font-black text-slate-900 tracking-tight uppercase font-brand-heading">
          Статусы системы
        </p>
      </div>

      {/* Центральный блок внутри кольца диаграммы, отображающий сумму всех заявок */}
      <div className="h-44 w-full flex items-center justify-center relative select-none shrink-0">
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-[24px] font-black text-slate-800 ...">
            {counters.total.toLocaleString()}
          </span>
          <span className="text-[10px] font-bold text-slate-400 ...">
            Всего заявок
          </span>
        </div>
        {/* Контейнер Recharts для построения круговой диаграммы */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={72}
              paddingAngle={4}
              dataKey="value"
            >
              {pieData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip trigger="hover" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Блок статистики и расчетов */}
      <div className="w-full space-y-2.5 text-sm border-t border-slate-100 pt-4 flex-1 flex flex-col justify-center">
        {[
          {
            label: "Новые заявки",
            count: counters.newCount,
            color: "#cbd5e1",
            isCritical: false,
          },
          {
            label: "В работе",
            count: counters.inProgressCount,
            color: "#475569",
            isCritical: false,
          },
          {
            label: "Критичные (Просрочено)",
            count: counters.overdueCount,
            color: "#df4a4a",
            isCritical: true,
          },
          {
            label: "Успешно решено",
            count: counters.resolvedCount,
            color: "#94a3b8",
            isCritical: false,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between py-0.5"
          >
            <div className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span
                className={`font-medium ${item.isCritical ? "text-rose-600 font-bold" : "text-slate-500"}`}
              >
                {item.label}
              </span>
            </div>
            <span
              className={`font-bold tracking-tight ${item.isCritical ? "text-rose-600 font-extrabold" : "text-slate-800"}`}
            >
              {item.count.toLocaleString()}{" "}
              <span className="text-slate-400 font-medium ml-1">
                (
                {counters.total > 0
                  ? ((item.count / counters.total) * 100).toFixed(1)
                  : "0.0"}
                %)
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
