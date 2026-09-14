import { type CitizenRecord } from "../../utils/mockGenerator";

type EducationRecord = CitizenRecord["education"][number];

interface TabEducationProps {
  education: EducationRecord[];
}

// Вкладка просмотра данных об образовании заявителя
export default function TabEducation({ education }: TabEducationProps) {
  return (
    <div className="space-y-6 pt-1 select-none">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-brand-heading">
        Сведения о квалификации и высшем образовании
      </h4>

      {/* Циклический рендеринг карточек */}
      {education.map((edu, idx) => (
        <div
          key={edu.id}
          className={`${idx > 0 ? "border-t border-slate-100 pt-5" : ""} space-y-4`}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="relative col-span-2">
              <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-slate-400 z-10">
                Наименование учебного заведения
              </label>
              <input
                type="text"
                value={edu.institution}
                disabled
                className="w-full text-sm px-3 py-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-medium cursor-not-allowed shadow-inner"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-slate-400 z-10">
                Присвоенная степень / Квалификация
              </label>
              <input
                type="text"
                value={edu.degree}
                disabled
                className="w-full text-sm px-3 py-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-medium cursor-not-allowed shadow-inner"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-slate-400 z-10">
                Год окончания обучения
              </label>
              <input
                type="text"
                value={`${edu.yearEnd} г.`}
                disabled
                className="w-full text-sm px-3 py-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-medium cursor-not-allowed shadow-inner"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
