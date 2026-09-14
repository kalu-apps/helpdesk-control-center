interface ExecutorRatingWidgetProps {
  executorData: Array<{
    name: string;
    resolved: number;
    overdue: number;
    totalTasks: number;
  }>;
}

// Виджет со сводной таблицей нагрузки на сотрудников
export default function ExecutorRatingWidget({
  executorData,
}: ExecutorRatingWidgetProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col w-full select-none">
      <div className="w-full text-left mb-5">
        <p className="text-base font-black text-slate-900 tracking-tight uppercase font-brand-heading">
          Эффективность исполнителей Ситуационного Центра
        </p>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse border border-slate-200 shadow-sm rounded-lg overflow-hidden">
          <thead>
            <tr className="text-xs font-black text-slate-500 uppercase border-b-2 border-slate-300 tracking-wider font-brand-heading bg-slate-50 divide-x divide-slate-200">
              <th className="py-3.5 pl-4 text-left font-bold w-1/3">
                Сотрудник
              </th>
              <th className="py-3.5 text-right font-bold px-4">Решено задач</th>
              <th className="py-3.5 text-right font-bold px-4">Просрочено</th>
              <th className="py-3.5 text-right font-bold pr-4 pl-4">
                Всего задач
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
            {executorData.length > 0 ? (
              executorData.map((exec) => (
                <tr
                  key={exec.name}
                  className="hover:bg-slate-100/60 odd:bg-slate-50/40 transition-colors duration-150 divide-x divide-slate-200"
                >
                  <td className="py-4 text-left font-black text-slate-900 pl-4 border-x border-slate-200">
                    {exec.name}
                  </td>
                  <td className="py-4 text-right font-bold text-slate-800 px-4 border-x border-slate-200">
                    {exec.resolved.toLocaleString()}
                  </td>
                  <td className="py-4 text-right font-bold text-rose-600 px-4 bg-rose-50/10 border-x border-slate-200">
                    {exec.overdue.toLocaleString()}
                  </td>
                  <td className="py-4 text-right font-black text-slate-900 pr-4 pl-4 border-x border-slate-200">
                    {exec.totalTasks.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              //Заглушка если по фильтру данных нет
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-slate-400 italic"
                >
                  Нет данных по выбранной категории СЭД
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
