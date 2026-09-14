import type { UseFormRegister, FieldValues, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CITIZEN_SERVICE_FIELDS } from "./fields.config";
import { User } from "lucide-react"
import CustomSelect from "./CustomSelect";

interface TabCitizenProfileProps {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  currentFullName: string;
  birthDateFormatted: string;
  phoneFormatted: string;
  setValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
}

// Вкладка профиля заявителя, паспортных данных и адресов
export default function TabCitizenProfile({
  register,
  errors,
  currentFullName,
  birthDateFormatted,
  phoneFormatted,
  setValue,
  watch,
}: TabCitizenProfileProps) {
  const hasInnError = !!errors.innNumber;

  const nameParts = currentFullName.trim().split(/\s+/);
  const lastName = nameParts[0] || "";
  const firstName = nameParts[1] || "";
  const patronymic = nameParts[2] || "";

  return (
    <div className="space-y-6 pt-1 select-none">
      {/* Скрытые инпуты для регистрации кастомных селекторов */}
      <input type="hidden" {...register("citizenType")} />
      <input type="hidden" {...register("regOperator")} />
      <input type="hidden" {...register("loyaltyLevel")} />
      <input type="hidden" {...register("snilsCheck")} />
      <input type="hidden" {...register("regionCode")} />
      <input type="hidden" {...register("addressRegistration")} />
      <input type="hidden" {...register("addressActual")} />

      <div className="grid grid-cols-3 gap-x-5 items-start bg-white">
        <div className="col-span-1 h-full self-stretch rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center relative overflow-hidden select-none">
          <User size={110} strokeWidth={1.5} className="text-slate-400" />
        </div>

        {/* Инпуты вывода данных гражданина */}
        <div className="col-span-2 grid grid-cols-2 gap-x-4 gap-y-3.5">
          <div className="relative col-span-2">
            <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-slate-400 z-10">
              Фамилия
            </label>
            <input
              type="text"
              value={lastName}
              disabled
              className="w-full text-sm px-3 py-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-semibold cursor-not-allowed shadow-inner"
            />
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-slate-400 z-10">
              Имя
            </label>
            <input
              type="text"
              value={firstName}
              disabled
              className="w-full text-sm px-3 py-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-semibold cursor-not-allowed shadow-inner"
            />
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-slate-400 z-10">
              Отчество
            </label>
            <input
              type="text"
              value={patronymic}
              disabled
              className="w-full text-sm px-3 py-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-semibold cursor-not-allowed shadow-inner"
            />
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-slate-400 z-10">
              Дата рождения
            </label>
            <input
              type="text"
              value={birthDateFormatted}
              disabled
              className="w-full text-sm px-3 py-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-semibold cursor-not-allowed shadow-inner"
            />
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-slate-400 z-10">
              Контактный телефон
            </label>
            <input
              type="text"
              value={phoneFormatted}
              disabled
              className="w-full text-sm px-3 py-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-semibold cursor-not-allowed shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Блок вывода паспортных данных */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-brand-heading">
          Удостоверение личности гражданина
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-slate-400 z-10">
              Тип документа
            </label>
            <input
              type="text"
              {...register("docType")}
              disabled
              className="w-full text-sm px-3 py-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-semibold cursor-not-allowed shadow-inner"
            />
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-slate-400 z-10">
              Серия и номер
            </label>
            <input
              type="text"
              {...register("docSeriesNumber")}
              disabled
              className="w-full text-sm px-3 py-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-semibold cursor-not-allowed shadow-inner"
            />
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-slate-400 z-10">
              Дата выдачи
            </label>
            <input
              type="text"
              {...register("docIssueDate")}
              disabled
              className="w-full text-sm px-3 py-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-semibold cursor-not-allowed shadow-inner"
            />
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-slate-400 z-10">
              Код подразделения
            </label>
            <input
              type="text"
              {...register("docSubCode")}
              disabled
              className="w-full text-sm px-3 py-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-semibold cursor-not-allowed shadow-inner"
            />
          </div>

          <div className="relative col-span-2">
            <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-slate-400 z-10">
              Кем выдан
            </label>
            <input
              type="text"
              {...register("docIssuedBy")}
              disabled
              className="w-full text-sm px-3 py-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-semibold cursor-not-allowed shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Блок вывода адресов */}
      <div className="space-y-4 border-t border-slate-100 pt-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-brand-heading">
          Адресные сведения заявителя (ФИАС)
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative col-span-2">
            <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-slate-400 z-10">
              Адрес регистрации по месту жительства (по паспорту)
            </label>
            <input
              type="text"
              {...register("addressRegistration")}
              disabled
              className="w-full text-sm px-3 py-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-semibold cursor-not-allowed shadow-inner"
            />
          </div>
          <div className="relative col-span-2">
            <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-slate-400 z-10">
              Адрес фактического проживания
            </label>
            <input
              type="text"
              {...register("addressActual")}
              disabled
              className="w-full text-sm px-3 py-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-semibold cursor-not-allowed shadow-inner"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 font-brand-heading">
          Ведомственный профиль заявителя
        </h4>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {CITIZEN_SERVICE_FIELDS.map((f) => (
            <div key={f.name} className="relative">
              <CustomSelect
                label={f.label}
                name={f.name}
                options={f.options || []}
                watch={watch}
                setValue={setValue}
              />
            </div>
          ))}

          <div className="relative">
            <CustomSelect
              label="Статус верификации ЕСИА"
              name="snilsCheck"
              options={[
                "Подтверждено Госуслугами",
                "Ошибка валидации СНИЛС",
                "Анонимный профиль",
              ]}
              watch={watch}
              setValue={setValue}
            />
          </div>

          <div className="relative">
            <CustomSelect
              label="Субъект РФ"
              name="regionCode"
              options={[
                "77 (г. Москва)",
                "50 (Московская область)",
                "78 (г. Санкт-Петербург)",
                "23 (Краснодарский край)",
                "54 (Новосибирская область)",
              ]}
              watch={watch}
              setValue={setValue}
            />
          </div>

          <div className="relative">
            <label
              className={`absolute -top-2 left-3 bg-white px-1 text-xs font-semibold z-10 ${hasInnError ? "text-rose-500 font-bold" : "text-slate-400"}`}
            >
              ИНН организации / лица *
            </label>
            <input
              type="text"
              {...register("innNumber", {
                required: "ИНН обязателен",
                pattern: {
                  value: /^(\d{10}|\d{12})$/,
                  message: "ИНН должен содержать 10 или 12 цифр",
                },
              })}
              placeholder="10 или 12 цифр"
              className="w-full text-sm px-3 py-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-semibold cursor-not-allowed shadow-inner"
            />
            {hasInnError && (
              <span className="text-[10px] text-rose-500 font-bold block mt-1 ml-1">
                {errors.innNumber?.message as string}
              </span>
            )}
          </div>
        </div>

        <div className="relative border-t border-slate-100 pt-4">
          <label className="absolute top-2 left-3 bg-white px-1 text-xs font-semibold text-slate-400 z-10">
            Служебная отметка оператора
          </label>
          <textarea
            {...register("internalNote")}
            rows={4}
            className="w-full text-sm px-3 py-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 font-semibold cursor-not-allowed shadow-inner"
          />
        </div>
      </div>
    </div>
  );
}

