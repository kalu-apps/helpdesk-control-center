import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface LoadTimelineChartProps {
  timelineData: Array<{ date: string; count: number }>;
  timePeriod: number;
  setTimePeriod: (period: 7 | 30) => void;
}

// Линейный график «Динамика обращений» с переключателем временных рамок
export default function LoadTimelineChart({
  timelineData,
  timePeriod,
  setTimePeriod,
}: LoadTimelineChartProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <p className="text-base font-black text-slate-900 tracking-tight uppercase font-brand-heading">
            Динамика обращений
          </p>
        </div>
        
        { /* Кнопки переключатели */}
        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200/40 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTimePeriod(7)}
            className={`px-4 py-1.5 rounded-lg text-xs font-black tracking-wider uppercase transition-all ${
              timePeriod === 7
                ? "bg-white text-[var(--color-brand-purple)] shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Неделя
          </button>
          <button
            type="button"
            onClick={() => setTimePeriod(30)}
            className={`px-4 py-1.5 rounded-lg text-xs font-black tracking-wider uppercase transition-all ${
              timePeriod === 30
                ? "bg-white text-[var(--color-brand-purple)] shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Месяц
          </button>
        </div>
      </div>

      <div className="h-64 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={timelineData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              stroke="#475569" 
              tickLine={true}
              tick={{ fill: "#1e293b", fontWeight: 800, fontSize: 11 }}
              padding={{ left: 20, right: 20 }}
              tickFormatter={(value: string) => {
                if (!value) return "";
                const parts = value.split(".");
                return parts.length === 3 ? `${parts[0]}.${parts[1]}` : value;
              }}
            />
            <YAxis
              stroke="#475569" 
              tickLine={true}
              tick={{ fill: "#1e293b", fontWeight: 800, fontSize: 11 }}
              tickFormatter={(value) =>
                value === 0 ? "" : value.toLocaleString()
              }
            />
            <Tooltip trigger="hover" />
            <Line
              type="monotone"
              dataKey="count"
              name="Обращения"
              stroke="#0f172a" 
              strokeWidth={3} 
              dot={{ r: 4, stroke: "#0f172a", strokeWidth: 2, fill: "#fff" }} 
              activeDot={{
                r: 6,
                stroke: "#0f172a",
                strokeWidth: 2,
                fill: "#0f172a",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
