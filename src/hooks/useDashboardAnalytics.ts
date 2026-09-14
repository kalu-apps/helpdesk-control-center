import { useMemo } from "react";
import { useTicketStore } from "../store/useTicketStore";
import { formatToRussianDate } from "../utils/mockGenerator";

//Хук для расчета аналитики для дашбордов на Главной странице
export function useDashboardAnalytics() {
  const { tickets, dashboardCategoryFilter, dashboardTimePeriod } =
    useTicketStore();

  // Кэширование расчетов без лишнего перерендеринга 
  return useMemo(() => {
    let newCount = 0;
    let inProgressCount = 0;
    let overdueCount = 0;
    let resolvedCount = 0;

    //Временные объекты для кэша
    const executorMap: Record<
      string,
      { name: string; resolved: number; overdue: number; totalTasks: number }
    > = {};
    const dateMap: Record<string, number> = {};

    //Цикл сбора
    tickets.forEach((ticket) => {
      if (ticket.status === "new") newCount++;
      if (ticket.status === "in_progress") inProgressCount++;
      if (ticket.status === "overdue") overdueCount++;
      if (ticket.status === "resolved") resolvedCount++;

      //Фильтр по выбранной категории СЭД
      if (
        dashboardCategoryFilter === "all" ||
        ticket.title === dashboardCategoryFilter
      ) {
        if (!executorMap[ticket.assignedExecutor]) {
          executorMap[ticket.assignedExecutor] = {
            name: ticket.assignedExecutor,
            resolved: 0,
            overdue: 0,
            totalTasks: 0,
          };
        }
        if (ticket.status === "resolved")
          executorMap[ticket.assignedExecutor].resolved++;
        if (ticket.status === "overdue")
          executorMap[ticket.assignedExecutor].overdue++;

        executorMap[ticket.assignedExecutor].totalTasks++;
      }

      const cleanDay = formatToRussianDate(ticket.createdAt);
      dateMap[cleanDay] = (dateMap[cleanDay] || 0) + 1;
    });

    //Группируем данные
    const executorData = Object.values(executorMap).sort(
      (a, b) => b.totalTasks - a.totalTasks,
    );

    //Массив для графика "Динамика обращений"
    const timelineData = Object.entries(dateMap)
      .map(([date, count]) => {
        const [day, month, year] = date.split(".");
        const timestamp = new Date(`${year}-${month}-${day}`).getTime();
        return { date, count, timestamp };
      })
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-dashboardTimePeriod) 
      .map(({ date, count }) => ({ date, count }));

      //Массив для графика "Статусы системы"
    const pieData = [
      { name: "Новые", value: newCount, color: "#cbd5e1" },
      { name: "В работе", value: inProgressCount, color: "#475569" },
      { name: "Просрочено", value: overdueCount, color: "#df4a4a" },
      { name: "Решено", value: resolvedCount, color: "#94a3b8" },
    ];

    return {
      counters: {
        total: tickets.length,
        newCount,
        inProgressCount,
        overdueCount,
        resolvedCount,
      },
      executorData,
      timelineData,
      pieData,
    };
  }, [tickets, dashboardTimePeriod, dashboardCategoryFilter]); 
}
