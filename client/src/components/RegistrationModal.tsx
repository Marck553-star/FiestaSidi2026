import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { Modal } from "./Modal";

import {
  SPORTS,
  type SportDefinition,
  type SportKey,
} from "@shared/sports";

import type {
  RegistrationPayload,
} from "@shared/types";

interface RegistrationModalProps {
  sportKey: SportKey | null;
  onClose: () => void;
  onSuccess: (
    participantsAdded: number,
  ) => void;
}

interface FormState {
  nombre: string;
  nivel: string;
  edad: string;

  pareja: "" | "si" | "no";

  nombreIntegrante1: string;
  nombrePareja: string;
  nombreCompanero2: string;

  comentarios: string;
}

const EMPTY_FORM: FormState = {
  nombre: "",
  nivel: "",
  edad: "",

  pareja: "",

  nombreIntegrante1: "",
  nombrePareja: "",
  nombreCompanero2: "",

  comentarios: "",
};

function fieldLabel(
  sport: SportDefinition,
): string {
  if (sport.teamMode === "team-3") {
    return "Nombre del equipo";
  }

  return "Nombre completo";
}

export function RegistrationModal({
  sportKey,
  onClose,
  onSuccess,
}: RegistrationModalProps) {
  const [form, setForm] =
    useState<FormState>(EMPTY_FORM);

  const [errors, setErrors] =
    useState<Record<string, string>>({});

  const [submitting, setSubmitting] =
    useState(false);

  const [
    serverMessage,
    setServerMessage,
  ] = useState("");

  const sport = sportKey
    ? SPORTS[sportKey]
    : null;

  useEffect(() => {
    setForm({
      ...EMPTY_FORM,

      pareja:
        sport?.teamMode ===
          "required-pair" ||
        sport?.teamMode === "team-3"
          ? "si"
          : "",
    });

    setErrors({});
    setServerMessage("");
  }, [sportKey, sport?.teamMode]);

  const showPartnerQuestion =
    sport?.teamMode === "optional-pair";

  const showPartnerName =
    sport?.teamMode ===
      "required-pair" ||
    form.pareja === "si";

  const expectedParticipants =
    useMemo(() => {
      if (!sport) {
        return 1;
      }

      if (
        sport.teamMode ===
        "required-pair"
      ) {
        return 2;
      }

      if (
        sport.teamMode === "team-3"
      ) {
        return 3;
      }

      if (
        sport.teamMode ===
          "optional-pair" &&
        form.pareja === "si"
      ) {
        return 2;
      }

      return 1;
    }, [sport, form.pareja]);

  if (!sport || !sportKey) {
    return null;
  }

  const update = <
    K extends keyof FormState,
  >(
    key: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => {
      const next = {
        ...current,
      };

      delete next[key];

      return next;
    });
  };

  const validate = (): boolean => {
    const nextErrors: Record<
      string,
      string
    > = {};

    if (
      form.nombre.trim().length < 2
    ) {
      nextErrors.nombre =
        sport.teamMode === "team-3"
          ? "Escribe un nombre válido para el equipo."
          : "Escribe un nombre válido.";
    }

    if (
      sport.teamMode === "team-3" &&
      form.nombreIntegrante1
        .trim()
        .length < 2
    ) {
      nextErrors.nombreIntegrante1 =
        "Escribe el nombre del primer integrante.";
    }

    if (
      sport.teamMode === "team-3" &&
      form.nombrePareja
        .trim()
        .length < 2
    ) {
      nextErrors.nombrePareja =
        "Escribe el nombre del segundo integrante.";
    }

    if (
      sport.teamMode === "team-3" &&
      form.nombreCompanero2
        .trim()
        .length < 2
    ) {
      nextErrors.nombreCompanero2 =
        "Escribe el nombre del tercer integrante.";
    }

    if (
      sport.levelOptions &&
      !sport.levelOptions.includes(
        form.nivel,
      )
    ) {
      nextErrors.nivel = `Selecciona ${
        sport.levelLabel
          ? sport.levelLabel.toLowerCase()
          : "una opción"
      }.`;
    }

    if (
      sport.requiresAge &&
      form.edad === ""
    ) {
      nextErrors.edad =
        "La edad es obligatoria.";
    }

    if (
      showPartnerQuestion &&
      form.pareja === ""
    ) {
      nextErrors.pareja =
        "Indica si vienes con pareja.";
    }

    if (
      sport.teamMode !== "team-3" &&
      showPartnerName &&
      form.nombrePareja
        .trim()
        .length < 2
    ) {
      nextErrors.nombrePareja =
        sport.teamMode ===
        "required-pair"
          ? "El nombre de la pareja es obligatorio."
          : "Escribe el nombre de tu pareja.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length ===
      0
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setServerMessage("");

    if (!validate()) {
      return;
    }

    const payload: RegistrationPayload =
      {
        nombre: form.nombre.trim(),

        nivel:
          form.nivel || null,

        edad:
          form.edad === ""
            ? null
            : Number(form.edad),

        deporte: sportKey,

        pareja:
          sport.teamMode ===
            "required-pair" ||
          sport.teamMode === "team-3"
            ? "si"
            : sport.teamMode ===
                "optional-pair"
              ? form.pareja || null
              : null,

        nombreIntegrante1:
          sport.teamMode === "team-3"
            ? form.nombreIntegrante1.trim()
            : null,

        nombrePareja:
          sport.teamMode === "team-3" ||
          showPartnerName
            ? form.nombrePareja.trim()
            : null,

        nombreCompanero2:
          sport.teamMode === "team-3"
            ? form.nombreCompanero2.trim()
            : null,

        comentarios:
          form.comentarios.trim() ||
          null,
      };

    setSubmitting(true);

    try {
      const response = await fetch(
        "/api/registrations",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        },
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        const fieldErrors =
          data.errors as
            | Record<
                string,
                string[]
              >
            | undefined;

        if (fieldErrors) {
          const normalized =
            Object.fromEntries(
              Object.entries(
                fieldErrors,
              ).map(
                ([key, value]) => [
                  key,
                  value[0],
                ],
              ),
            );

          setErrors(normalized);
        }

        throw new Error(
          data.message ||
            "No se pudo guardar la inscripción.",
        );
      }

      onSuccess(
        Number(
          data.participantsAdded ||
            expectedParticipants,
        ),
      );
    } catch (error) {
      setServerMessage(
        error instanceof Error
          ? error.message
          : "No se pudo guardar la inscripción.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={Boolean(sportKey)}
      title={`Inscripción · ${sport.name}`}
      onClose={onClose}
    >
      <form
        className="registration-form"
        onSubmit={handleSubmit}
        noValidate
      >
        {sport.registrationNote && (
          <div className="info-callout">
            <strong>
              {sport.registrationNote}
            </strong>
          </div>
        )}

        {(sport.teamMode ===
          "required-pair" ||
          sport.teamMode ===
            "team-3") && (
          <div className="info-callout">
            <strong>
              {sport.teamMode ===
              "required-pair"
                ? "Inscripción obligatoria por parejas"
                : "Inscripción obligatoria por equipos de tres"}
            </strong>

            <span>
              Esta inscripción añadirá{" "}
              {expectedParticipants}{" "}
              participantes al contador.
            </span>
          </div>
        )}

        <label className="field">
          <span>
            {fieldLabel(sport)}
          </span>

          <input
            value={form.nombre}
            onChange={(event) =>
              update(
                "nombre",
                event.target.value,
              )
            }
            placeholder={
              sport.teamMode ===
              "team-3"
                ? "Ej.: Los Invencibles"
                : "Nombre y apellidos"
            }
            autoComplete="name"
          />

          {errors.nombre && (
            <small className="field-error">
              {errors.nombre}
            </small>
          )}
        </label>

        {sport.teamMode ===
          "team-3" && (
          <>
            <label className="field">
              <span>
                Primer integrante
              </span>

              <input
                value={
                  form.nombreIntegrante1
                }
                onChange={(event) =>
                  update(
                    "nombreIntegrante1",
                    event.target.value,
                  )
                }
                placeholder="Nombre y apellidos"
              />

              {errors.nombreIntegrante1 && (
                <small className="field-error">
                  {
                    errors.nombreIntegrante1
                  }
                </small>
              )}
            </label>

            <label className="field">
              <span>
                Segundo integrante
              </span>

              <input
                value={
                  form.nombrePareja
                }
                onChange={(event) =>
                  update(
                    "nombrePareja",
                    event.target.value,
                  )
                }
                placeholder="Nombre y apellidos"
              />

              {errors.nombrePareja && (
                <small className="field-error">
                  {
                    errors.nombrePareja
                  }
                </small>
              )}
            </label>

            <label className="field">
              <span>
                Tercer integrante
              </span>

              <input
                value={
                  form.nombreCompanero2
                }
                onChange={(event) =>
                  update(
                    "nombreCompanero2",
                    event.target.value,
                  )
                }
                placeholder="Nombre y apellidos"
              />

              {errors.nombreCompanero2 && (
                <small className="field-error">
                  {
                    errors.nombreCompanero2
                  }
                </small>
              )}
            </label>
          </>
        )}

        {showPartnerQuestion && (
          <label className="field">
            <span>
              ¿Vienes con pareja?
            </span>

            <select
              value={form.pareja}
              onChange={(event) => {
                const value =
                  event.target
                    .value as FormState["pareja"];

                update("pareja", value);

                if (value !== "si") {
                  update(
                    "nombrePareja",
                    "",
                  );
                }
              }}
            >
              <option value="">
                Selecciona una opción
              </option>

              <option value="si">
                Sí
              </option>

              <option value="no">
                No
              </option>
            </select>

            {errors.pareja && (
              <small className="field-error">
                {errors.pareja}
              </small>
            )}
          </label>
        )}

        {sport.teamMode !== "team-3" &&
          showPartnerName && (
            <label className="field">
              <span>
                Nombre de la pareja
              </span>

              <input
                value={
                  form.nombrePareja
                }
                onChange={(event) =>
                  update(
                    "nombrePareja",
                    event.target.value,
                  )
                }
                placeholder="Nombre y apellidos"
              />

              {errors.nombrePareja && (
                <small className="field-error">
                  {
                    errors.nombrePareja
                  }
                </small>
              )}
            </label>
          )}

        {sport.levelOptions && (
          <label className="field">
            <span>
              {sport.levelLabel ||
                "Nivel"}
            </span>

            <select
              value={form.nivel}
              onChange={(event) =>
                update(
                  "nivel",
                  event.target.value,
                )
              }
            >
              <option value="">
                {sport.levelPlaceholder ||
                  "Selecciona una opción"}
              </option>

              {sport.levelOptions.map(
                (option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {sport
                      .levelOptionLabels?.[
                      option
                    ] || option}
                  </option>
                ),
              )}
            </select>

            {errors.nivel && (
              <small className="field-error">
                {errors.nivel}
              </small>
            )}
          </label>
        )}

        {sport.requiresAge && (
          <label className="field">
            <span>Edad</span>

            <input
              type="number"
              min="0"
              max="120"
              value={form.edad}
              onChange={(event) =>
                update(
                  "edad",
                  event.target.value,
                )
              }
              placeholder="Edad"
            />

            {errors.edad && (
              <small className="field-error">
                {errors.edad}
              </small>
            )}
          </label>
        )}

        <label className="field">
          <span>Comentarios</span>

          <textarea
            rows={3}
            value={form.comentarios}
            onChange={(event) =>
              update(
                "comentarios",
                event.target.value,
              )
            }
            placeholder="Información adicional (opcional)"
          />
        </label>

        {serverMessage && (
          <div className="error-callout">
            {serverMessage}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={submitting}
          >
            {submitting
              ? "Guardando..."
              : `Inscribir ${expectedParticipants}`}
          </button>
        </div>
      </form>
    </Modal>
  );
}