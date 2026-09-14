import { useState, useEffect } from "react";
import { useTicketStore } from "../store/useTicketStore";
import { useTicketForm } from "../hooks/useTicketForm";
import { formatToRussianDate } from "../utils/mockGenerator";
import { Save, Check, X, Loader2 } from "lucide-react";
import TabSEDParams from "./ticket/TabSEDParams";
import TabCitizenProfile from "./ticket/TabCitizenProfile";
import TabRelations from "./ticket/TabRelations";
import TabEducation from "./ticket/TabEducation";

//Вкладки шапки 
type ActiveTabType = "main" | "citizen" | "family" | "education";

// Боковая панель детального просмотра и редактирования выбранной заявки
export default function TicketDetails() {
  const { selectedTicket, selectTicket } = useTicketStore();
  const [activeSubTab, setActiveSubTab] = useState<ActiveTabType>("citizen");

  // Подключение изолированной логики управления полями формы и сохранения данных
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isSavedSuccessfully,
    setIsSavedSuccessfully,
    clearErrors,
    setValue,
    watch,
    isSubmitting,
  } = useTicketForm(selectedTicket);

  // Слушатель события для сброса активной вкладки на "Профиль заявителя" при выборе новой заявки в таблице
  useEffect(() => {
    function handleResetTab() {
      setActiveSubTab("citizen");
    }
    window.addEventListener("reset-ticket-tab", handleResetTab);
    return () => window.removeEventListener("reset-ticket-tab", handleResetTab);
  }, []);

  if (!selectedTicket) return null;
  // Переключение вкладок с одновременным сбросом статуса валидации
  const handleTabChange = (tab: ActiveTabType) => {
    setActiveSubTab(tab);
    setIsSavedSuccessfully(false);
    clearErrors();
  };

  return (
    <div className="w-[650px] bg-white border-l border-slate-200 shadow-2xl h-full flex flex-col z-20 shrink-0">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0 select-none">
        <div className="text-xs font-bold text-slate-400 tracking-wider font-brand-heading">
          Заявка №{" "}
          <span className="text-slate-900">{selectedTicket.ticketNumber}</span>{" "}
          от{" "}
          <span className="text-slate-900">
            {selectedTicket.createdAtFormatted}
          </span>
        </div>

        <button
          type="button"
          onClick={() => selectTicket(null)}
          className="p-1.5 hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 rounded-xl transition-colors shrink-0"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex justify-between border-b border-slate-100 px-3 bg-slate-50/30 text-xs shrink-0 select-none">
        {(["main", "citizen", "family", "education"] as const).map((tab) => {
          const labels: Record<ActiveTabType, string> = {
            main: "Параметры СЭД",
            citizen: "Профиль заявителя",
            family: "Состав семьи",
            education: "Образование",
          };
          return (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabChange(tab)}
              className={`px-3.5 py-3.5 border-b-2 font-bold tracking-wider uppercase font-brand-heading ${
                activeSubTab === tab
                  ? "border-slate-800 text-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>
      
      {/* Контентная область */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 overflow-y-auto p-6 space-y-6 relative"
      >
        {/* Блокируем область видимости данных на процесс сохранения */}
        <div
          className={`space-y-6 transition-all duration-300 ${isSubmitting ? "opacity-60 pointer-events-none select-none" : ""}`}
        >
          {activeSubTab === "main" && (
            <TabSEDParams
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
          )}

          {activeSubTab === "citizen" && (
            <TabCitizenProfile
              register={register}
              errors={errors}
              currentFullName={selectedTicket.citizen.fullName}
              birthDateFormatted={formatToRussianDate(
                selectedTicket.citizen.birthDate,
              )}
              phoneFormatted={selectedTicket.citizen.phone}
              setValue={setValue}
              watch={watch}
            />
          )}

          {activeSubTab === "family" && (
            <TabRelations
              familyMembers={selectedTicket.citizen.familyMembers}
            />
          )}
          {activeSubTab === "education" && (
            <TabEducation education={selectedTicket.citizen.education} />
          )}
        </div>

        {isSubmitting && (
          <div className="absolute inset-0 bg-transparent cursor-wait z-50" />
        )}
      </form>

      <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end shrink-0 select-none">
        <button
          type="button"
          disabled={isSubmitting || isSavedSuccessfully}
          onClick={handleSubmit(onSubmit)}
          className={`flex items-center gap-2 font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.98] uppercase font-brand-heading tracking-wider duration-300 ${
            isSavedSuccessfully
              ? "bg-emerald-600 border border-emerald-700 text-white shadow-none cursor-default"
              : isSubmitting
                ? "bg-slate-400 border border-slate-500 text-white cursor-wait"
                : "bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white cursor-pointer"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Отправка...
            </>
          ) : isSavedSuccessfully ? (
            <>
              <Check size={14} />
              Изменения сохранены
            </>
          ) : (
            <>
              <Save size={14} />
              Сохранить данные
            </>
          )}
        </button>
      </div>
    </div>
  );
}
