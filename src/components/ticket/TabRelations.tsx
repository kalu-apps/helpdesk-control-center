import {
  type CitizenRecord,
  formatToRussianDate,
} from "../../utils/mockGenerator";

type FamilyMember = CitizenRecord["familyMembers"][number];

interface TabRelationsProps {
  familyMembers: FamilyMember[];
}

//Компонент вкладки для отображения информации о зарегистрированных родственниках
export default function TabRelations({ familyMembers }: TabRelationsProps) {
  return (
    <div className="space-y-6 pt-1 select-none">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-brand-heading">
        Зарегистрированные члены семьи
      </h4>

      {/* Циклический рендеринг карточек членов семьи */}
      {familyMembers.map((member, idx) => (
        <div
          key={member.id}
          className={`${idx > 0 ? "border-t border-slate-100 pt-5" : ""} space-y-4`}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="relative col-span-2">
              <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-slate-400 z-10">
                ФИО родственника
              </label>
              <input
                type="text"
                value={member.fullName}
                disabled
                className="w-full text-sm px-3 py-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-medium cursor-not-allowed shadow-inner truncate"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-slate-400 z-10">
                Степень родства
              </label>
              <input
                type="text"
                value={member.relation}
                disabled
                className="w-full text-sm px-3 py-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-medium cursor-not-allowed shadow-inner truncate"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-slate-400 z-10">
                Дата рождения
              </label>
              <input
                type="text"
                value={`${formatToRussianDate(member.birthDate)}`}
                disabled
                className="w-full text-sm px-3 py-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-medium cursor-not-allowed shadow-inner truncate"
              />
            </div>

            <div className="relative col-span-2">
              <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-slate-400 z-10">
                Удостоверение личности ({member.document.docType})
              </label>
              <input
                type="text"
                value={`${member.document.seriesNumber} выдан ${formatToRussianDate(member.document.issueDate)} г. ${member.document.issuedBy}`}
                disabled
                className="w-full text-sm px-3 py-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-medium cursor-not-allowed shadow-inner truncate"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
