export type TeamMode =
  | "individual"
  | "optional-pair"
  | "required-pair"
  | "team-3";

export interface PrizeDefinition {
  readonly position: string;
  readonly result: string;
  readonly type: string;
  readonly quantity: number | null;
  readonly note?: string;
}

export interface SportDefinition {
  readonly key: string;
  readonly name: string;
  readonly shortName: string;
  readonly category: string;

  readonly teamMode: TeamMode;
  readonly fixedParticipants: 1 | 2 | 3;

  readonly levelOptions?: readonly string[];
  readonly levelLabel?: string;
  readonly levelPlaceholder?: string;
  readonly levelOptionLabels?: Readonly<Record<string, string>>;

  readonly requiresAge?: boolean;
  readonly registrationNote?: string;

  readonly prizes: readonly PrizeDefinition[];
  readonly prizeNote?: string;
}

const firstSecond = (
  firstQuantity: number,
  secondQuantity: number,
  firstResult = "Campeón",
  secondResult = "Subcampeón",
): readonly PrizeDefinition[] => [
  {
    position: "1º",
    result: firstResult,
    type: "Trofeo",
    quantity: firstQuantity,
  },
  {
    position: "2º",
    result: secondResult,
    type: "Medalla de plata",
    quantity: secondQuantity,
  },
];

const PADEL_LEVEL_LABELS: Readonly<Record<string, string>> = {
  A: "A · Alto/medio",
  B: "B · Medio/bajo",
};

const SPORT_DEFINITIONS = {
  "padel-masculino": {
    key: "padel-masculino",
    name: "Pádel Masculino",
    shortName: "Masculino",
    category: "Pádel",
    teamMode: "optional-pair",
    fixedParticipants: 1,
    levelOptions: ["A", "B"],
    levelLabel: "Nivel",
    levelPlaceholder: "Selecciona tu nivel",
    levelOptionLabels: PADEL_LEVEL_LABELS,
    prizes: firstSecond(
      4,
      4,
      "Campeones A y B",
      "Subcampeones A y B",
    ),
  },

  "padel-femenino": {
    key: "padel-femenino",
    name: "Pádel Femenino",
    shortName: "Femenino",
    category: "Pádel",
    teamMode: "optional-pair",
    fixedParticipants: 1,
    levelOptions: ["A", "B"],
    levelLabel: "Nivel",
    levelPlaceholder: "Selecciona tu nivel",
    levelOptionLabels: PADEL_LEVEL_LABELS,
    prizes: firstSecond(
      4,
      4,
      "Campeonas A y B",
      "Subcampeonas A y B",
    ),
  },

  "padel-mixto": {
    key: "padel-mixto",
    name: "Pádel Mixto",
    shortName: "Mixto",
    category: "Pádel",
    teamMode: "optional-pair",
    fixedParticipants: 1,
    levelOptions: ["A", "B"],
    levelLabel: "Nivel",
    levelPlaceholder: "Selecciona tu nivel",
    levelOptionLabels: PADEL_LEVEL_LABELS,
    prizes: firstSecond(2, 2),
  },

  "padel-infantil": {
    key: "padel-infantil",
    name: "Pádel Infantil",
    shortName: "Infantil",
    category: "Pádel",
    teamMode: "optional-pair",
    fixedParticipants: 1,
    requiresAge: true,
    prizes: firstSecond(2, 2),
    prizeNote:
      "En el documento original aparece marcado con interrogantes.",
  },

  "tenis-masculino": {
    key: "tenis-masculino",
    name: "Tenis Masculino",
    shortName: "Masculino",
    category: "Tenis",
    teamMode: "individual",
    fixedParticipants: 1,
    prizes: firstSecond(1, 1),
  },

  "tenis-femenino": {
    key: "tenis-femenino",
    name: "Tenis Femenino",
    shortName: "Femenino",
    category: "Tenis",
    teamMode: "individual",
    fixedParticipants: 1,
    prizes: firstSecond(1, 1),
  },

  "tenis-infantil": {
    key: "tenis-infantil",
    name: "Tenis Infantil",
    shortName: "Infantil",
    category: "Tenis",
    teamMode: "individual",
    fixedParticipants: 1,
    requiresAge: true,
    prizes: [],
  },

  "pingpong-masculino": {
    key: "pingpong-masculino",
    name: "Ping-Pong Masculino",
    shortName: "Masculino",
    category: "Ping-Pong",
    teamMode: "individual",
    fixedParticipants: 1,
    prizes: firstSecond(1, 1),
  },

  "pingpong-femenino": {
    key: "pingpong-femenino",
    name: "Ping-Pong Femenino",
    shortName: "Femenino",
    category: "Ping-Pong",
    teamMode: "individual",
    fixedParticipants: 1,
    prizes: [],
  },

  "pingpong-infantil": {
    key: "pingpong-infantil",
    name: "Ping-Pong Infantil",
    shortName: "Infantil",
    category: "Ping-Pong",
    teamMode: "individual",
    fixedParticipants: 1,
    requiresAge: true,
    prizes: firstSecond(1, 1),
  },

  "basket-3x3-masculino": {
    key: "basket-3x3-masculino",
    name: "Basket 3x3 Masculino",
    shortName: "3x3 Masculino",
    category: "Basket",
    teamMode: "team-3",
    fixedParticipants: 3,
    prizes: firstSecond(3, 3),
  },

  futbol: {
    key: "futbol",
    name: "Fútbol",
    shortName: "Fútbol",
    category: "Fútbol",
    teamMode: "individual",
    fixedParticipants: 1,

    levelOptions: [
      "Bloques 1 y 2",
      "Bloque 3",
      "Bloques 4 y 5",
    ],

    levelLabel: "Bloque",
    levelPlaceholder: "Selecciona tu bloque",

    registrationNote:
      "Selecciona obligatoriamente el bloque al que perteneces.",

    prizes: [],
  },

  "golf-adultos": {
    key: "golf-adultos",
    name: "Golf Adultos",
    shortName: "Adultos",
    category: "Golf",
    teamMode: "individual",
    fixedParticipants: 1,
    registrationNote: "Una persona por inscripción.",
    prizes: [],
  },

  "golf-infantil": {
    key: "golf-infantil",
    name: "Golf Infantil",
    shortName: "Infantil",
    category: "Golf",
    teamMode: "individual",
    fixedParticipants: 1,
    requiresAge: true,
    registrationNote: "Una persona por inscripción.",
    prizes: [],
  },

  "natacion-infantil": {
    key: "natacion-infantil",
    name: "Natación Infantil",
    shortName: "Infantil",
    category: "Natación",
    teamMode: "individual",
    fixedParticipants: 1,
    requiresAge: true,
    prizes: [
      {
        position: "1º",
        result: "Campeón/a",
        type: "Por confirmar",
        quantity: null,
      },
      {
        position: "2º",
        result: "Subcampeón/a",
        type: "Por confirmar",
        quantity: null,
      },
    ],
  },

  "futbolin-infantil": {
    key: "futbolin-infantil",
    name: "Futbolín Infantil",
    shortName: "Infantil",
    category: "Futbolín",
    teamMode: "required-pair",
    fixedParticipants: 2,
    requiresAge: true,
    prizes: firstSecond(2, 2),
  },

  "futbolin-masculino": {
    key: "futbolin-masculino",
    name: "Futbolín Masculino",
    shortName: "Masculino",
    category: "Futbolín",
    teamMode: "required-pair",
    fixedParticipants: 2,
    prizes: firstSecond(2, 2),
  },

  "futbolin-femenino": {
    key: "futbolin-femenino",
    name: "Futbolín Femenino",
    shortName: "Femenino",
    category: "Futbolín",
    teamMode: "required-pair",
    fixedParticipants: 2,
    prizes: firstSecond(2, 2),
  },

  "futbolin-mixto": {
    key: "futbolin-mixto",
    name: "Futbolín Mixto",
    shortName: "Mixto",
    category: "Futbolín",
    teamMode: "required-pair",
    fixedParticipants: 2,
    prizes: firstSecond(2, 2),
  },

  mus: {
    key: "mus",
    name: "Mus",
    shortName: "Mus",
    category: "Juegos de mesa",
    teamMode: "optional-pair",
    fixedParticipants: 1,
    prizes: firstSecond(2, 0),
  },

  domino: {
    key: "domino",
    name: "Dominó",
    shortName: "Dominó",
    category: "Juegos de mesa",
    teamMode: "optional-pair",
    fixedParticipants: 1,
    prizes: firstSecond(2, 0),
  },

  parchis: {
    key: "parchis",
    name: "Parchís",
    shortName: "Parchís Adultos",
    category: "Juegos de mesa",
    teamMode: "optional-pair",
    fixedParticipants: 1,
    prizes: firstSecond(2, 2),
  },

  "parchis-infantil": {
    key: "parchis-infantil",
    name: "Parchís Infantil",
    shortName: "Parchís Infantil",
    category: "Juegos de mesa",
    teamMode: "optional-pair",
    fixedParticipants: 1,
    requiresAge: true,
    prizes: [],
  },

  uno: {
    key: "uno",
    name: "UNO",
    shortName: "UNO",
    category: "Juegos de mesa",
    teamMode: "individual",
    fixedParticipants: 1,
    prizes: firstSecond(1, 1),
  },

  ajedrez: {
    key: "ajedrez",
    name: "Ajedrez",
    shortName: "Ajedrez",
    category: "Juegos de mesa",
    teamMode: "individual",
    fixedParticipants: 1,
    prizes: firstSecond(1, 1),
  },

  "concurso-tortillas": {
    key: "concurso-tortillas",
    name: "Concurso de tortillas de patata",
    shortName: "Concurso de tortillas",
    category: "Eventos",
    teamMode: "individual",
    fixedParticipants: 1,
    registrationNote:
      "Inscripción para participar en el concurso de tortillas de patata.",
    prizes: [],
  },

  "cena-viernes-sabado": {
    key: "cena-viernes-sabado",
    name: "Cena de viernes y sábado",
    shortName: "Cena viernes y sábado",
    category: "Eventos",
    teamMode: "individual",
    fixedParticipants: 1,
    registrationNote:
      "Una única inscripción incluye la cena del viernes y la del sábado.",
    prizes: [],
  },

  "rey-fiestas": {
    key: "rey-fiestas",
    name: "Rey de las Fiestas",
    shortName: "Rey de las Fiestas",
    category: "Eventos especiales",
    teamMode: "individual",
    fixedParticipants: 1,
    requiresAge: true,
    prizes: [],
  },

  "reina-fiestas": {
    key: "reina-fiestas",
    name: "Reina de las Fiestas",
    shortName: "Reina de las Fiestas",
    category: "Eventos especiales",
    teamMode: "individual",
    fixedParticipants: 1,
    requiresAge: true,
    prizes: [],
  },
} as const satisfies Record<string, SportDefinition>;

export type SportKey = keyof typeof SPORT_DEFINITIONS;

export const SPORTS =
  SPORT_DEFINITIONS as Record<SportKey, SportDefinition>;

export const SPORT_KEYS = Object.keys(
  SPORTS,
) as SportKey[];

export const SPORT_CATEGORY_ORDER = [
  "Pádel",
  "Tenis",
  "Ping-Pong",
  "Basket",
  "Fútbol",
  "Golf",
  "Natación",
  "Futbolín",
  "Juegos de mesa",
  "Eventos",
  "Eventos especiales",
] as const;

export const WHATSAPP_COMMUNITY_URL =
  "https://chat.whatsapp.com/EMoPzzDNbMCHy6YWXj7tM8";

export const PRIZE_STOCK = {
  competitions: [
    {
      label: "Trofeos de campeones",
      quantity: 35,
      note: "Total indicado",
    },
    {
      label: "Subtotal de trofeos de Pádel",
      quantity: 12,
      note: "Subtotal mostrado en la hoja: 4 + 4 + 2 + 2",
    },
    {
      label: "Medallas de oro",
      quantity: null,
      note: "Cantidad general no indicada en el documento",
    },
    {
      label: "Medallas de plata",
      quantity: 31,
      note: "Total indicado",
    },
    {
      label: "Medallas de bronce",
      quantity: null,
      note: "Cantidad general no indicada en el documento",
    },
  ],

  children: [
    {
      label: "Medallas infantiles de oro",
      quantity: 30,
      note: "Aproximadamente; revisar sobrantes del año pasado",
    },
    {
      label: "Medallas infantiles de plata",
      quantity: 30,
      note: "Aproximadamente; revisar sobrantes del año pasado",
    },
    {
      label: "Medallas infantiles de bronce",
      quantity: 30,
      note: "Aproximadamente; revisar sobrantes del año pasado",
    },
  ],

  extras: [
    {
      label: "Medallas de oro variadas",
      quantity: 6,
    },
    {
      label: "Medallas de plata para cartas",
      quantity: 4,
    },
  ],
} as const;

export function isSportKey(
  value: unknown,
): value is SportKey {
  return (
    typeof value === "string" &&
    value in SPORTS
  );
}

export function getSport(
  key: SportKey,
): SportDefinition {
  return SPORTS[key];
}

export function getSportName(
  key: string,
): string {
  return isSportKey(key)
    ? SPORTS[key].name
    : key;
}

export function getSportsByCategory(
  category: string,
): SportDefinition[] {
  return SPORT_KEYS
    .map((key) => SPORTS[key])
    .filter(
      (sport) =>
        sport.category === category,
    );
}

export function calculateParticipantCount(
  input: {
    deporte: SportKey;
    pareja?: "si" | "no" | null;
  },
): number {
  const sport = SPORTS[input.deporte];

  if (sport.teamMode === "required-pair") {
    return 2;
  }

  if (sport.teamMode === "team-3") {
    return 3;
  }

  if (
    sport.teamMode === "optional-pair" &&
    input.pareja === "si"
  ) {
    return 2;
  }

  return 1;
}