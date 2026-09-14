import { useRef, useState, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useTicketStore } from "../store/useTicketStore";
import { Search, Filter } from "lucide-react";
import TicketDetails from "./TicketDetails";
import Spinner from "./ui/Spinner";

//вывод списка всех заявок с поиском и фильтрацией
export default function Catalog() {
  const {
    filteredTickets,
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
    selectTicket,
    selectedTicket,
  } = useTicketStore();

  const filterContainerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Хук закрытия фильтра при клике в пустую область экрана
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterContainerRef.current &&
        !filterContainerRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //Плагин виртуализации, чтобы рендерились только видимые строки
  const rowVirtualizer = useVirtualizer({
    count: filteredTickets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 5,
  });

  //Визуализации статусов заявок
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: "bg-slate-100 text-slate-600 border-slate-200/80",
      in_progress: "bg-slate-600 text-white border-slate-700",
      overdue:
        "bg-rose-50 text-[var(--color-ui-overdue)] border-rose-200 font-extrabold",
      resolved: "bg-white text-slate-500 border-slate-200",
    };

    const labels: Record<string, string> = {
      new: "Новая",
      in_progress: "В работе",
      overdue: "Просрочена",
      resolved: "Решена",
    };

    return (
      <span
        className={`px-2.5 py-1 rounded border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap text-center min-w-[110px] block ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  const isDetailsOpen = !!selectedTicket;

  return (
    <div className="h-full flex gap-6 overflow-hidden items-start w-full">
      {/* Левая колонка: Реестр */}
      <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
        {/* Панель управления с поиском */}
        <div className="flex gap-3 items-center justify-between shrink-0 select-none">
          <div className="relative flex-1 flex items-center bg-white border border-slate-200/80 rounded-xl pl-3 pr-4 py-2 shadow-sm focus-within:border-slate-800 transition-all">
            <Search className="text-slate-400 shrink-0" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по ФИО, номеру или дате..."
              className="w-full bg-transparent text-sm pl-2.5 pr-4 py-1 focus:outline-none text-slate-800 font-medium placeholder:text-slate-400"
            />
            {/* Объем выборки */}
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-l border-slate-200 pl-3 shrink-0 select-none">
              Записей:{" "}
              <span className="text-slate-700 font-black font-mono">
                {filteredTickets.length.toLocaleString()}
              </span>
            </span>
          </div>

          {/* Кнопка фильтрации статусов */}
          <div ref={filterContainerRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center justify-center w-11 h-11 bg-white border rounded-xl cursor-pointer transition-all shadow-sm ${
                isFilterOpen || statusFilter !== "all"
                  ? "border-slate-800 text-slate-900 bg-slate-50/50"
                  : "border-slate-200/80 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Filter size={16} />
            </button>

            {isFilterOpen && (
              <ul className="absolute right-0 z-50 mt-1.5 w-48 bg-white border border-slate-200/80 rounded-xl shadow-xl py-1 text-xs text-slate-700 font-medium select-none">
                {(
                  [
                    { value: "all", label: "Все статусы" },
                    { value: "new", label: "Новые" },
                    { value: "in_progress", label: "В работе" },
                    { value: "overdue", label: "Просроченные" },
                    { value: "resolved", label: "Решенные" },
                  ] as const
                ).map((item) => (
                  <li
                    key={item.value}
                    onClick={() => {
                      setStatusFilter(item.value);
                      setIsFilterOpen(false);
                    }}
                    className={`px-3 py-2 hover:bg-slate-50 cursor-pointer transition-colors ${
                      statusFilter === item.value
                        ? "bg-slate-50 text-slate-900 font-bold"
                        : ""
                    }`}
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Контейнер виртуальной таблицы */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="w-full flex flex-col flex-1 overflow-hidden">
            {/* ШАПКА ТАБЛИЦЫ */}
            <div className="flex gap-4 px-6 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 tracking-wider shrink-0 items-center uppercase select-none font-brand-heading">
              <div className="flex-[1.5] min-w-0">Номер</div>
              <div className="flex-[3.5] min-w-0">Заявитель</div>

              {!isDetailsOpen && (
                <>
                  <div className="flex-[3.5] min-w-0">Тема обращения</div>
                  <div className="flex-[1.5] min-w-0">Дата создания</div>
                </>
              )}

              <div className="flex-[1.5] min-w-0 text-center">Статус</div>
            </div>

            {/* Скролл-контейнер строк */}
            {useTicketStore((state) => state.isLoading) ? (
              <Spinner message="Синхронизация картотеки..." />
            ) : (
              <div
                ref={parentRef}
                className="flex-1 overflow-y-auto overflow-x-hidden"
                style={{ contain: "strict" }}
              >
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const ticket = filteredTickets[virtualRow.index];
                    const isSelected = selectedTicket?.id === ticket.id;

                    return (
                      <div
                        key={virtualRow.key}
                        onClick={() => {
                          selectTicket(ticket);
                          window.dispatchEvent(
                            new CustomEvent("reset-ticket-tab"),
                          );
                        }}
                        className={`flex gap-4 px-6 items-center text-sm text-slate-700 border-b border-slate-100 hover:bg-slate-50/80 cursor-pointer transition-colors absolute top-0 left-0 w-full ${
                          isSelected ? "bg-slate-100/70" : ""
                        }`}
                        style={{
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        {/* СТРОКИ ТАБЛИЦЫ */}
                        <div className="flex-[1.5] min-w-0 font-semibold text-slate-900">
                          {ticket.ticketNumber}
                        </div>
                        <div className="flex-[3.5] min-w-0 font-medium text-slate-900 truncate">
                          {ticket.citizen.fullName}
                        </div>

                        {!isDetailsOpen && (
                          <>
                            <div className="flex-[3.5] min-w-0 truncate text-slate-600">
                              {ticket.title}
                            </div>
                            <div className="flex-[1.5] min-w-0 text-slate-500 truncate">
                              {ticket.createdAtFormatted}{" "}
                            </div>
                          </>
                        )}

                        <div className="flex-[1.5] min-w-0 flex justify-center">
                          {getStatusBadge(ticket.status)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Правая колонка */}
      <TicketDetails />
    </div>
  );
}
