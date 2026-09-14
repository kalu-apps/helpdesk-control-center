import { useState, useRef, useEffect } from "react";
import {
  type UseFormSetValue,
  type UseFormWatch,
  type FieldValues,
} from "react-hook-form";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label: string;
  name: string;
  options: string[] | SelectOption[];
  watch: UseFormWatch<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  error?: boolean;
  disabled?: boolean;
}

// Кастомный селектор со встроенной фильтрацией и поиском по буквам
export default function CustomSelect({
  label,
  name,
  options,
  watch,
  setValue,
  error,
  disabled,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentValue = watch(name);

  // Приводим любые варианты к единому формату
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt,
  );

  const selectedOption = normalizedOptions.find(
    (o) => o.value === currentValue,
  );
  const [searchTerm, setSearchTerm] = useState("");

  // фильтрация списка по мере ввода букв
  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const displayValue = isOpen
    ? searchTerm
    : selectedOption
      ? selectedOption.label
      : "";

  //Автоматическое закрытие списка при клике вне селектора
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <label
        className={`absolute -top-2 left-3 bg-white px-1 text-xs font-semibold z-10 truncate max-w-[220px] transition-colors ${
          error ? "text-rose-500 font-bold" : "text-slate-400"
        }`}
      >
        {label}
      </label>

      <div className="relative w-full flex items-center">
        <input
          type="text"
          value={displayValue}
          disabled={disabled}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            if (disabled) return;
            setIsOpen(true);
            setSearchTerm("");
          }}
          placeholder={disabled ? "Сохранение..." : "Введите для поиска..."}
          className={`w-full text-sm pl-3 pr-10 py-3 border rounded-lg text-left font-semibold transition-all appearance-none select-text focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800/20 ${
            disabled
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-white cursor-text text-slate-800"
          } ${
            error ? "border-rose-400 bg-rose-50/10" : "border-slate-200"
          } ${isOpen && !disabled ? "border-slate-800 ring-1 ring-slate-800/20" : ""}`}
        />

        <ChevronDown
          size={14}
          className={`absolute right-3 text-slate-400 pointer-events-none transition-transform duration-200 ${
            isOpen && !disabled ? "rotate-180 text-slate-800" : ""
          }`}
        />
      </div>

      {isOpen && (
        <ul className="absolute left-0 right-0 z-50 mt-1 bg-white border border-slate-200/80 rounded-xl shadow-xl max-h-56 overflow-y-auto py-1 text-xs text-slate-700 font-medium">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  setValue(name, opt.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  setSearchTerm("");
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-sm hover:bg-slate-50 cursor-pointer transition-colors ${
                  currentValue === opt.value
                    ? "bg-slate-50 text-slate-900 font-bold"
                    : ""
                }`}
              >
                {opt.label}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-slate-400 cursor-default select-none text-center italic">
              Совпадений не найдено
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
