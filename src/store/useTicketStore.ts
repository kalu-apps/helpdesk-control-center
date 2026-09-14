import { create } from "zustand";
import {
  generateMockTickets,
  formatToRussianDate,
  type HelpDeskTicket,
  type CitizenRecord,
} from "../utils/mockGenerator";

// Интерфейс заявки
export interface HelpDeskTicketUI extends Omit<HelpDeskTicket, "createdAt"> {
  createdAtFormatted: string;
  createdAtTimestamp: number;
  citizen: CitizenRecord;
}

// Контракт глобального состояния хранилища Zustand
interface TicketState {
  tickets: HelpDeskTicket[];
  citizens: Record<string, CitizenRecord>;
  filteredTickets: HelpDeskTicketUI[];
  selectedTicket: HelpDeskTicketUI | null;
  searchQuery: string;
  statusFilter: string;
  isLoading: boolean;
  dashboardCategoryFilter: string;
  dashboardTimePeriod: number;

  initTickets: (count: number) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setDashboardCategoryFilter: (category: string) => void;
  setDashboardTimePeriod: (period: number) => void;
  selectTicket: (ticket: HelpDeskTicketUI | null) => void;
  applyFilters: () => void;
  updateTicketFields: (
    ticketId: string,
    updatedTicketFields: Partial<HelpDeskTicket>,
    updatedCitizenFields: Partial<CitizenRecord>,
  ) => void;
}

//Стейт-менеджер
export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: [],
  citizens: {},
  filteredTickets: [],
  selectedTicket: null,
  searchQuery: "",
  statusFilter: "all",
  isLoading: true,
  dashboardCategoryFilter: "all",
  dashboardTimePeriod: 7, //По умолчанию "неделя" в дашборд

  // Первоначальное асинхронное наполнение базы данных через макротаску
  initTickets: async (count) => {
    set({ isLoading: true });
    return new Promise((resolve) => {
      setTimeout(() => {
        const { tickets, citizens } = generateMockTickets(count);
        set({
          tickets,
          citizens,
          selectedTicket: null,
          isLoading: false,
        });
        get().applyFilters();
        resolve();
      }, 0);
    });
  },

  // Двухфазная синхронизация измененных полей формы
  updateTicketFields: (ticketId, updatedTicketFields, updatedCitizenFields) => {
    const { tickets, citizens, selectedTicket } = get();

    // Находим ID гражданина, привязанного к текущему инциденту
    const currentCitizenId =
      selectedTicket?.citizenId ||
      tickets.find((t) => t.id === ticketId)?.citizenId;

    //Обновление карточки гражданина
    const updatedCitizens = { ...citizens };
    if (currentCitizenId && citizens[currentCitizenId]) {
      updatedCitizens[currentCitizenId] = {
        ...citizens[currentCitizenId],
        ...updatedCitizenFields,
      };
    }

    //Обновление свойств заявки в массиве
    const updatedTickets = tickets.map((t) =>
      t.id === ticketId ? { ...t, ...updatedTicketFields } : t,
    );

    //Синхронный пересчет временных шкал при изменении срока ответа
    let extraFields: Partial<HelpDeskTicketUI> = {};
    if (
      updatedTicketFields.createdAt &&
      !updatedTicketFields.createdAt.includes("undefined")
    ) {
      extraFields = {
        createdAtTimestamp: Date.parse(updatedTicketFields.createdAt),
        createdAtFormatted: formatToRussianDate(updatedTicketFields.createdAt),
      };
    }
    //Принудительное накатывание изменений активной заявки
    let nextSelectedTicket = selectedTicket;
    if (selectedTicket && selectedTicket.id === ticketId) {
      nextSelectedTicket = {
        ...selectedTicket,
        ...updatedTicketFields,
        ...extraFields,
        citizen: {
          ...selectedTicket.citizen,
          ...updatedCitizenFields,
        },
      };
    }

    set({
      tickets: updatedTickets,
      citizens: updatedCitizens,
      selectedTicket: nextSelectedTicket,
    });

    get().applyFilters(); // Перестраиваем поисковые индексы для моментального обновления таблицы реестра
  },
  // Изменение поисковой строки диспетчера
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters();
  },
  // Изменение глобального статус-фильтра таблицы реестра
  setStatusFilter: (status) => {
    set({ statusFilter: status });
    get().applyFilters();
  },
  // Изменение ведомственного фильтра категорий СЭД для графиков дашборда
  setDashboardCategoryFilter: (category) => {
    set({ dashboardCategoryFilter: category });
  },
  // Изменение временного масштаба аналитики (Неделя/Месяц)
  setDashboardTimePeriod: (period) => {
    set({ dashboardTimePeriod: period });
  },

  selectTicket: (ticket) => {
    set({ selectedTicket: ticket });
  },

  // Универсальная фильтрация, сортировка при текстовом поиске
  applyFilters: () => {
    const { tickets, citizens, searchQuery, statusFilter } = get();

    const result = tickets.filter(
      (t) => statusFilter === "all" || t.status === statusFilter,
    );

    const uiResult: HelpDeskTicketUI[] = result.map((t) => {
      const citizen = citizens[t.citizenId];
      return {
        ...t,
        createdAtTimestamp: Date.parse(t.createdAt),
        createdAtFormatted: formatToRussianDate(t.createdAt),
        citizen,
      };
    });

    let searchedResult = uiResult;
    if (searchQuery.trim() !== "") {
      const rawQuery = searchQuery.trim().toLowerCase();
      const normalizedQuery = rawQuery.replace(/[./\s,-]/g, "");

      searchedResult = uiResult.filter((t) => {
        const fullName = t.citizen.fullName.toLowerCase();
        const ticketNumber = t.ticketNumber.toLowerCase();
        const normalizedDate = t.createdAtFormatted.replace(/\./g, "");

        return (
          fullName.includes(rawQuery) ||
          ticketNumber.includes(rawQuery) ||
          (normalizedQuery !== "" && normalizedDate.includes(normalizedQuery))
        );
      });
    }

    searchedResult.sort((a, b) => b.createdAtTimestamp - a.createdAtTimestamp);

    set({ filteredTickets: searchedResult });
  },
}));
