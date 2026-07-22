import { z } from "zod";
import {
  SPORTS,
  calculateParticipantCount,
  isSportKey,
  type SportKey,
} from "../shared/sports";

function optionalText(maxLength: number) {
  return z.preprocess(
    (value) => {
      if (
        value === null ||
        value === undefined
      ) {
        return null;
      }

      const text = String(value).trim();

      return text === "" ? null : text;
    },
    z.string().max(maxLength).nullable(),
  );
}

const cleanAge = z.preprocess(
  (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return null;
    }

    return Number(value);
  },
  z.number().int().min(0).max(120).nullable(),
);

export const registrationSchema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(2)
      .max(150),

    nivel: optionalText(20),
    edad: cleanAge,

    deporte: z.custom<SportKey>(
      isSportKey,
      {
        message:
          "El deporte seleccionado no existe.",
      },
    ),

    pareja: z.preprocess(
      (value) =>
        value === "si" || value === "no"
          ? value
          : null,
      z.enum(["si", "no"]).nullable(),
    ),

    nombreIntegrante1: optionalText(150),
    nombrePareja: optionalText(150),
    nombreCompanero2: optionalText(150),
    comentarios: optionalText(1000),
  })
  .superRefine((data, context) => {
    const sport = SPORTS[data.deporte];

    if (
      sport.teamMode === "required-pair" &&
      (!data.nombrePareja ||
        data.nombrePareja.length < 2)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nombrePareja"],
        message:
          "El nombre de la pareja es obligatorio en Futbolín.",
      });
    }

    if (
      sport.teamMode === "optional-pair" &&
      data.pareja === "si" &&
      (!data.nombrePareja ||
        data.nombrePareja.length < 2)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nombrePareja"],
        message:
          "Indica el nombre de tu pareja.",
      });
    }

    if (sport.teamMode === "team-3") {
      if (
        !data.nombreIntegrante1 ||
        data.nombreIntegrante1.length < 2
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["nombreIntegrante1"],
          message:
            "Indica el nombre del primer integrante.",
        });
      }

      if (
        !data.nombrePareja ||
        data.nombrePareja.length < 2
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["nombrePareja"],
          message:
            "Indica el nombre del segundo integrante.",
        });
      }

      if (
        !data.nombreCompanero2 ||
        data.nombreCompanero2.length < 2
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["nombreCompanero2"],
          message:
            "Indica el nombre del tercer integrante.",
        });
      }
    }

    if (
      sport.levelOptions &&
      !sport.levelOptions.includes(
        data.nivel ?? "",
      )
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nivel"],
        message: `Selecciona el nivel ${sport.levelOptions.join(
          " o ",
        )}.`,
      });
    }

    if (
      sport.requiresAge &&
      data.edad === null
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["edad"],
        message:
          "La edad es obligatoria en esta actividad.",
      });
    }
  })
  .transform((data) => {
    const sport = SPORTS[data.deporte];

    const pareja =
      sport.teamMode === "required-pair" ||
      sport.teamMode === "team-3"
        ? "si"
        : sport.teamMode === "optional-pair"
          ? data.pareja
          : null;

    return {
      ...data,

      pareja,

      nombreIntegrante1:
        sport.teamMode === "team-3"
          ? data.nombreIntegrante1
          : null,

      nombrePareja:
        pareja === "si"
          ? data.nombrePareja
          : null,

      nombreCompanero2:
        sport.teamMode === "team-3"
          ? data.nombreCompanero2
          : null,

      participantesContabilizados:
        calculateParticipantCount({
          deporte: data.deporte,
          pareja,
        }),
    };
  });