// Паспортные данные гражданина РФ
export interface DocRecord {
  docType: string;
  seriesNumber: string;
  issueDate: string;
  issuedBy: string;
  subCode: string;
}

// Родственные связи и состав семьи заявителя
export interface FamilyMember {
  id: string;
  relation: string;
  fullName: string;
  birthDate: string;
  document: DocRecord;
}

// Карточка образования
export interface EducationRecord {
  id: string;
  institution: string;
  degree: string;
  yearEnd: number;
}

// Полный цифровой профиль гражданина
export interface CitizenRecord {
  id: string;
  fullName: string;
  birthDate: string;
  phone: string;
  email: string;
  innNumber: string;
  internalNote: string;
  addressRegistration: string;
  addressActual: string;
  passport: DocRecord;
  familyMembers: FamilyMember[];
  education: EducationRecord[];
  citizenType?: string;
  regOperator?: string;
  loyaltyLevel?: string;
  snilsCheck?: string;
}

// Карточка инцидента 
export interface HelpDeskTicket {
  id: string;
  ticketNumber: string;
  createdAt: string;
  status: "new" | "in_progress" | "overdue" | "resolved";
  title: string;
  description: string;
  assignedExecutor: string;
  regionCode: string;
  citizenId: string;
  sourceChannel?: string;
  resolutionType?: string;
  urgencyLevel?: string;
}

// Конвертация ISO-строки даты в стандарт ДД.ММ.ГГГГ
export const formatToRussianDate = (isoStringOrDate: string): string => {
  if (!isoStringOrDate) return "";
  const dateStr = isoStringOrDate.includes("T")
    ? isoStringOrDate.split("T")[0]
    : isoStringOrDate;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return isoStringOrDate;
  const [year, month, day] = parts;
  return `${day}.${month}.${year}`;
};

// Набор сложных ФИО для генерации базы
const COMPLEX_NAMES = [
  "Мамин-Сибиряк Дмитрий Наркисович",
  "Римский-Корсаков Николай Андреевич",
  "Сухово-Кобылин Александр Васильевич",
  "Миклухо-Маклай Юрий Николаевич",
  "Салтыков-Щедрин Михаил Евграфович",
  "Иванов Сергей Александрович",
  "Петров-Водкин Кузьма Сергеевич",
  "Алексеева-Павлова Мария Дмитриевна",
  "Ковалевская Софья Владимировна",
  "Менделеев Дмитрий Иванович",
];

// Доступные сотрудники Ситуационного Центра
export const EXECUTORS = [
  "Ким К.А.",
  "Иванов С.В.",
  "Алексеева М.Д.",
  "Павлов Е.Н.",
  "Салтыков-Щедрин М.Е.",
  "Римский-Корсаков Н.А.",
  "Кузнецов Н.С.",
  "Попова О.И.",
];

// Шаблоны заголовков инцидентов в заявке
const TITLES = [
  "Нарушение графика вывоза ТКО",
  "Несанкционированная свалка",
  "Переполнение контейнерной площадки",
  "Ошибка в начислениях / Квитанция",
  "Повреждение бакового парка",
];

// Коды субъектов и наименования регионов
const RUSSIAN_REGIONS = [
  "77 (г. Москва)",
  "50 (Московская область)",
  "78 (г. Санкт-Петербург)",
  "23 (Краснодарский край)",
  "54 (Новосибирская область)",
];

// База описаний для каждого типа проблемы
const INCIDENT_DESCRIPTIONS: Record<string, string[]> = {
  "Нарушение графика вывоза ТКО": [
    "Мусоровоз не приезжает уже третьи сутки. Контейнеры переполнены, отходы разлетаются по дворовой территории, стоит сильный неприятный запах.",
    "Нарушен установленный СанПиН график вывоза твердых коммунальных отходов. Просим принять срочные меры реагирования к региональному оператору.",
  ],
  "Несанкционированная свалка": [
    "Обнаружен навал строительного и крупногабаритного мусора на опушке лесного массива вблизи жилого сектора. Объем свалки увеличивается.",
    "Зафиксирован факт незаконного сброса ТКО грузовыми автомобилями на пустыре за гаражным кооперативом. Фотофиксация прилагается.",
  ],
  "Переполнение контейнерной площадки": [
    "Площадка завалена старой мебелью, ветками и бытовыми отходами. Региональный оператор вывозит только баки, игнорируя навалы вокруг площадки.",
    "Количество установленных контейнеров не соответствует фактическому объему накопления отходов. Требуется расширение бавого парка.",
  ],
  "Ошибка в начислениях / Квитанция": [
    "В платежном документе за текущий месяц неверно указано количество зарегистрированных граждан. Начисления за обращение с ТКО завышены.",
    "Пришла квитанция с долгом за прошлый год, хотя все платежи производились вовремя через личный кабинет. Просим провести сверку.",
  ],
  "Повреждение бакового парка": [
    "В процессе механизированной погрузки мусора сотрудники компании повредили пластиковый контейнер, у него оторвана крышка и сломано колесо.",
    "На контейнерной площадке полностью сгорел один из накопительных баков для раздельного сбора пластика. Необходима замена бака.",
  ],
};

// Список адресов проживания
const MOCK_MUNICIPAL_ADDRESSES = [
  "Г. МОСКВА, УЛ. ЛЕНИНСКИЙ ПРОСПЕКТ, Д. 45, КВ. 112",
  "МОСКОВСКАЯ ОБЛ., Г. ОДИНЦОВО, УЛ. МАРШАЛА ЖУКОВА, Д. 12, КВ. 4",
  "Г. САНКТ-ПЕТЕРБУРГ, НEВСКИЙ ПРОСПЕКТ, Д. 8, КВ. 19",
  "КРАСНОДАРСКИЙ КРАЙ, Г. СОЧИ, УЛ. ВИНОГРАДНАЯ, Д. 22, КВ. 54",
  "НОВОСИБИРСКАЯ ОБЛ., Г. НОВОСИБИРСК, УЛ. КИРОВА, Д. 86, КВ. 33",
];

export interface MockDbResponse {
  tickets: HelpDeskTicket[];
  citizens: Record<string, CitizenRecord>;
}

// Алгоритм автоматического склонения фамилий по полу
const getRelativeLastName = (
  fullName: string,
  targetIsFemale: boolean,
): string => {
  const parts = fullName.trim().split(/\s+/);
  const rawLastName = parts[0] || "Римский";
  return rawLastName
    .split("-")
    .map((part) => {
      if (targetIsFemale) {
        if (part.endsWith("ий")) return part.slice(0, -2) + "ая";
        if (part.endsWith("ов") || part.endsWith("ин") || part.endsWith("ын"))
          return part + "a";
      } else {
        if (part.endsWith("ая")) return part.slice(0, -2) + "ий";
        if (
          part.endsWith("ова") ||
          part.endsWith("ина") ||
          part.endsWith("ына")
        )
          return part.slice(0, -1);
      }
      return part;
    })
    .join("-");
};

// Основной алгоритм генерации связанных данных 
export const generateMockTickets = (count: number): MockDbResponse => {
  const tickets: HelpDeskTicket[] = [];
  const citizens: Record<string, CitizenRecord> = {}; //Хранение граждан в хэш-таблице вместо массива
  const citizenCount = Math.max(10, Math.floor(count * 0.2)); // Рассчитываем оптимальное количество уникальных граждан
  
  //Цикл генерации цифровых профилей граждан
  for (let c = 0; c < citizenCount; c++) {
    const citizenId = `c-${c}`;
    const randComplexName = COMPLEX_NAMES[c % COMPLEX_NAMES.length];
    const nameParts = randComplexName.trim().split(/\s+/);
    const citizenIsFemale = nameParts[2]?.endsWith("вна") || false;

    const spouseLastName = getRelativeLastName(
      randComplexName,
      !citizenIsFemale,
    );
    const childLastName = getRelativeLastName(randComplexName, false);
    const generatedInn = `77${Math.floor(1000000000 + Math.random() * 8999999999)}`;

    const passportSeries = `${4500 + Math.floor(Math.random() * 99)}`;
    const passportNumber = `${100000 + Math.floor(Math.random() * 899999)}`;
    const spousePassportNumber = `${200000 + Math.floor(Math.random() * 899999)}`;
    const birthCertificateNumber = `${300000 + Math.floor(Math.random() * 899999)}`;

    const regAddress =
      MOCK_MUNICIPAL_ADDRESSES[c % MOCK_MUNICIPAL_ADDRESSES.length];
    const actAddress =
      Math.random() > 0.7
        ? MOCK_MUNICIPAL_ADDRESSES[(c + 1) % MOCK_MUNICIPAL_ADDRESSES.length]
        : regAddress;

    citizens[citizenId] = {
      id: citizenId,
      fullName: randComplexName,
      birthDate: `19${70 + (c % 35)}-${String((c % 12) + 1).padStart(2, "0")}-${String((c % 28) + 1).padStart(2, "0")}`,
      phone: `+7 (999) ${100 + (c % 899)}-${String(10 + (c % 89)).padStart(2, "0")}-${String(10 + (c % 89)).padStart(2, "0")}`,
      email: `user_${c}@example.com`,
      innNumber: generatedInn,
      internalNote: `Обращение зарегистрировано оператором СЦ. Требуется верификация акта фотофиксации по объекту №${100 + c}.`,
      addressRegistration: regAddress,
      addressActual: actAddress,
      passport: {
        docType: "Паспорт РФ",
        seriesNumber: `${passportSeries.slice(0, 2)}${passportSeries.slice(2, 4)} ${passportNumber}`,
        issueDate: "1998-05-14",
        issuedBy: "ОВД ХОРОШЕВСКОГО РАЙОНА Г. МОСКВЫ",
        subCode: "770-042",
      },
      citizenType: "Физическое лицо (Гражданин)",
      regOperator: "ООО ЭкоЛайн",
      loyaltyLevel: "Стандартный",
      snilsCheck: "Подтверждено Госуслугами",
      familyMembers: [
        {
          id: `f-${c}-1`,
          relation: "Супруг(а)",
          fullName: citizenIsFemale
            ? `${spouseLastName} Андрей Васильевич`
            : `${spouseLastName} Анна Викторовна`,
          birthDate: "1985-04-12",
          document: {
            docType: "Паспорт РФ",
            seriesNumber: `4515 ${spousePassportNumber}`,
            issueDate: "2005-10-22",
            issuedBy: "УФМС РОССИИ ПО Г. МОСКВЕ",
            subCode: "772-115",
          },
        },
        {
          id: `f-${c}-2`,
          relation: "Сын",
          fullName: `${childLastName} Даниил Александрович`,
          birthDate: "2012-08-24",
          document: {
            docType: "Свид. о рожд.",
            seriesNumber: `IV-МЮ № ${birthCertificateNumber}`,
            issueDate: "2012-09-04",
            issuedBy: "ОТДЕЛ ЗАГС ЦАО УПРАВЛЕНИЯ ЗАГС МОСКВЫ",
            subCode: "ЗАГС ЦАО",
          },
        },
      ],
      education: [
        {
          id: `e-${c}-1`,
          institution: "МГУ им. Ломоносова",
          degree: "Бакалавр",
          yearEnd: 2006,
        },
        {
          id: `e-${c}-2`,
          institution: "МГУ им. Ломоносова",
          degree: "Магистр",
          yearEnd: 2008,
        },
      ],
    };
  }

  //Цикл генерации инцидентов
  for (let i = 0; i < count; i++) {
    const ticketId = `t-${i}`;
    const citizenId = `c-${i % citizenCount}`;
    const randExecutor =
      EXECUTORS[Math.floor(Math.random() * EXECUTORS.length)];
    const randTitle = TITLES[Math.floor(Math.random() * TITLES.length)];
    const randRegion =
      RUSSIAN_REGIONS[Math.floor(Math.random() * RUSSIAN_REGIONS.length)];
    const randStatus = (["new", "in_progress", "overdue", "resolved"] as const)[
      Math.floor(Math.random() * 4)
    ];

    // Имитация случайного распределения дат в пределах 30 дней
    const dateOffset = Math.random() * 30 * 24 * 60 * 60 * 1000;
    const rawCreatedAt = new Date(Date.now() - dateOffset).toISOString();

    tickets.push({
      id: ticketId,
      ticketNumber: `ТЗ-${100000 + i}`,
      createdAt: rawCreatedAt,
      status: randStatus,
      title: randTitle,
      description: INCIDENT_DESCRIPTIONS[randTitle][i % 2],
      assignedExecutor: randExecutor,
      regionCode: randRegion,
      citizenId: citizenId,
      sourceChannel: "РЭО Радар",
      resolutionType: "Разъяснение",
    });
  }

  return { tickets, citizens };
};
