import type {
  UseFormRegister,
  FieldValues,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { SERVICE_FIELDS } from "./fields.config";
import CustomSelect from "./CustomSelect";
import { EXECUTORS } from "../../utils/mockGenerator";

//Вкладка параметров СЭД и текста обращения
interface TabSEDParamsProps {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
}

export default function TabSEDParams({
  register,
  errors,
  setValue,
  watch,
}: TabSEDParamsProps) {
  const hasDescriptionError = !!errors.description;

  return (
    <div className="space-y-6 pt-1 select-none">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Скрытые инпуты для регистрации кастомных селекторов */}
          <input type="hidden" {...register("status")} />
          <input type="hidden" {...register("assignedExecutor")} />
          <input type="hidden" {...register("sourceChannel")} />
          <input type="hidden" {...register("resolutionType")} />
          <input type="hidden" {...register("incidentType")} />
          <input type="hidden" {...register("urgencyLevel")} />

          <CustomSelect
            label="Статус рассмотрения"
            name="status"
            options={[
              { value: "new", label: "Новая" },
              { value: "in_progress", label: "В работе" },
              { value: "overdue", label: "Просрочена" },
              { value: "resolved", label: "Решена" },
            ]}
            watch={watch}
            setValue={setValue}
          />

          <CustomSelect
            label="Ответственный исполнитель"
            name="assignedExecutor"
            options={EXECUTORS}
            watch={watch}
            setValue={setValue}
          />

          {SERVICE_FIELDS.map((f) => {
            const hasError = !!errors[f.name];

            return (
              <div key={f.name} className="relative">
                {f.type === "select" ? (
                  <>
                    <input type="hidden" {...register(f.name)} />
                    <CustomSelect
                      label={f.label}
                      name={f.name}
                      options={f.options || []}
                      watch={watch}
                      setValue={setValue}
                      error={hasError}
                    />
                  </>
                ) : (
                  <>
                    <label
                      className={`absolute -top-2 left-3 bg-white px-1 text-xs font-semibold z-10 truncate max-w-[220px] ${hasError ? "text-rose-500 font-bold" : "text-slate-400"}`}
                    >
                      {f.label} {f.name === "controlTerm" && "*"}
                    </label>
                    <input
                      type="text"
                      {...register(
                        f.name,
                        f.name === "controlTerm"
                          ? {
                              required: "Поле обязательно",
                              pattern: {
                                value:
                                  /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d\d$/,
                                message: "Неверный формат даты (ДД.ММ.ГГГГ)",
                            },
                              //Запрет на указание прошедшей даты
                              validate: (value) => {
                                if (!value) return true;
                                const [day, month, year] = value.split(".");
                                const inputDate = new Date(
                                  `${year}-${month}-${day}T00:00:00.000Z`,
                                );
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return (
                                  inputDate >= today ||
                                  "Срок ответа не может быть раньше текущей даты"
                                );
                              },
                            }
                          : {},
                      )}
                      className={`w-full text-sm px-3 py-3 bg-white border rounded-lg focus:outline-none text-slate-800 font-semibold transition-colors 
                        ${
                          hasError
                            ? "border-rose-400 focus:border-rose-500 bg-rose-50/10"
                            : "border-slate-200 focus:border-slate-800"
                        }`}
                      placeholder="ДД.ММ.ГГГГ"
                    />
                  </>
                )}

                {f.name === "controlTerm" && hasError && (
                  <span className="text-[10px] text-rose-500 font-bold block mt-1 ml-1">
                    {errors[f.name]?.message as string}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative border-t border-slate-100 pt-4">
        <label
          className={`absolute top-2 left-3 bg-white px-1 text-xs font-semibold text-slate-400 z-10 ${hasDescriptionError ? "text-rose-500 font-bold" : "text-slate-400"}`}
        >
          Содержание обращения *
        </label>
        <textarea
          {...register("description", {
            required: "Содержание обращения не может быть пустым",
          })}
          rows={10}
          className={`w-full text-sm px-4 py-3.5 mt-4 bg-slate-50 border rounded-lg focus:outline-none text-slate-800 font-medium leading-relaxed resize-y min-h-[220px] max-h-96 transition-colors ${
            hasDescriptionError
              ? "border-rose-400 focus:border-rose-500 bg-rose-50/10"
              : "border-slate-200 focus:border-slate-800"
          }`}
        />
        {hasDescriptionError && (
          <span className="text-[10px] text-rose-500 font-bold block mt-1 ml-1">
            {errors.description?.message as string}
          </span>
        )}
      </div>
    </div>
  );
}
