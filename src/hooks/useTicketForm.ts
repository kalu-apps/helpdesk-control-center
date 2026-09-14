import { useEffect, useState } from "react";
import {
  useForm,
  type FieldValues,
  type FieldErrors,
  type UseFormRegister,
  type UseFormHandleSubmit,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import { type HelpDeskTicketUI, useTicketStore } from "../store/useTicketStore";
import { formatToRussianDate } from "../utils/mockGenerator";

// Интерфейс возвращаемого контракта хука управления формой
interface UseTicketFormReturn {
  register: UseFormRegister<FieldValues>;
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  errors: FieldErrors<FieldValues>;
  onSubmit: (data: FieldValues) => void;
  isSavedSuccessfully: boolean;
  setIsSavedSuccessfully: React.Dispatch<React.SetStateAction<boolean>>;
  clearErrors: () => void;
  setValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  isSubmitting: boolean;
}

//Управление содержимым заявки
export function useTicketForm(
  selectedTicket: HelpDeskTicketUI | null,
): UseTicketFormReturn {
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); //Контроль сохранения изменений

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState,
    setValue,
    watch,
  } = useForm<FieldValues>({
    mode: "onChange",
    shouldUnregister: false,
  });

  const updateTicketFields = useTicketStore((s) => s.updateTicketFields);

  //Автозаполенение полей заявки 
  useEffect(() => {
    if (selectedTicket) {
      clearErrors();
      const nameParts = selectedTicket.citizen.fullName.trim().split(/\s+/);
      const lastName = nameParts[0] || "";
      const firstName = nameParts[1] || "";
      const patronymic = nameParts[2] || "";

      reset({
        ticketNumber: selectedTicket.ticketNumber,
        title: selectedTicket.title,
        status: selectedTicket.status,
        fullName: selectedTicket.citizen.fullName,
        lastName,
        firstName,
        patronymic,
        birthDate: formatToRussianDate(selectedTicket.citizen.birthDate),
        phone: selectedTicket.citizen.phone,
        email: selectedTicket.citizen.email,
        assignedExecutor: selectedTicket.assignedExecutor,
        description: selectedTicket.description,
        regionCode: selectedTicket.regionCode,
        controlTerm: formatToRussianDate(
          new Date(selectedTicket.createdAtTimestamp).toISOString(),
        ),

        addressRegistration: selectedTicket.citizen.addressRegistration,
        addressActual: selectedTicket.citizen.addressActual,

        innNumber: selectedTicket.citizen.innNumber,
        internalNote: selectedTicket.citizen.internalNote,
        incidentType: selectedTicket.title,
        urgencyLevel:
          selectedTicket.urgencyLevel ||
          (selectedTicket.status === "overdue"
            ? "Высокий (Критичный)"
            : "Регламентный (Стандарт)"),

        sourceChannel: selectedTicket.sourceChannel || "РЭО Радар",
        resolutionType: selectedTicket.resolutionType || "Разъяснение",
        citizenType:
          selectedTicket.citizen.citizenType || "Физическое лицо (Гражданин)",
        regOperator: selectedTicket.citizen.regOperator || "ООО ЭкоЛайн",
        loyaltyLevel: selectedTicket.citizen.loyaltyLevel || "Стандартный",
        snilsCheck:
          selectedTicket.citizen.snilsCheck || "Подтверждено Госуслугами",

        // Паспортные данные
        docType: selectedTicket.citizen.passport.docType,
        docSeriesNumber: selectedTicket.citizen.passport.seriesNumber,
        docIssueDate: formatToRussianDate(
          selectedTicket.citizen.passport.issueDate,
        ),
        docIssuedBy: selectedTicket.citizen.passport.issuedBy,
        docSubCode: selectedTicket.citizen.passport.subCode,
      });
    }
  }, [selectedTicket, reset, clearErrors]);

  //Функция сохранения изменений 
  const onSubmit = (data: FieldValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Данные СЭД успешно зафиксированы в ИС ОВД:", data);

      if (selectedTicket?.id) {
        let isoCreatedAt = selectedTicket
          ? new Date(selectedTicket.createdAtTimestamp).toISOString() //Возвращаем тип даты
          : "";
        if (data.controlTerm && typeof data.controlTerm === "string") {
          const cleanDate = data.controlTerm.trim();
          const parts = cleanDate.split(/[./\s-]/); 
          if (parts.length === 3) {
            const [day, month, year] = parts;
            if (day && month && year && year.length === 4) {
              isoCreatedAt = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00.000Z`;
            }
          }
        }
        //Собираем обновленные данные
        const updatedTicketPayload = {
          status: data.status,
          assignedExecutor: data.assignedExecutor,
          title: data.incidentType,
          regionCode: data.regionCode,
          description: data.description,
          sourceChannel: data.sourceChannel,
          resolutionType: data.resolutionType,
          urgencyLevel: data.urgencyLevel,
          createdAt: isoCreatedAt, 
        };

        const updatedCitizenPayload = {
          innNumber: data.innNumber,
          internalNote: data.internalNote,
          citizenType: data.citizenType,
          regOperator: data.regOperator,
          loyaltyLevel: data.loyaltyLevel,
          snilsCheck: data.snilsCheck,
        };
        
        //Отпарвление обновления в стор
        updateTicketFields(
          selectedTicket.id,
          updatedTicketPayload,
          updatedCitizenPayload,
        );
      }

      setIsSubmitting(false);
      setIsSavedSuccessfully(true);
      setTimeout(() => setIsSavedSuccessfully(false), 2500);
    }, 800);
  };

  return {
    register,
    handleSubmit,
    errors: formState.errors,
    onSubmit,
    isSavedSuccessfully,
    setIsSavedSuccessfully,
    clearErrors,
    setValue,
    watch,
    isSubmitting,
  };
}
