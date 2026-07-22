import { useMemo, useState } from "react";
import { getSportName } from "@shared/sports";
import type { Registration } from "@shared/types";
import { Modal } from "./Modal";

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
  onChanged: () => void;
}

function csvCell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export function AdminPanel({ open, onClose, onChanged }: AdminPanelProps) {
  const [pin, setPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const participants = useMemo(
    () =>
      registrations.reduce(
        (total, registration) =>
          total + registration.participantesContabilizados,
        0,
      ),
    [registrations],
  );

  const loadRegistrations = async (adminPin = pin) => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/registrations", {
        headers: { "x-admin-pin": adminPin },
      });
      const data = await response.json().catch(() => []);
      if (!response.ok) {
        throw new Error(data.message || "No se pudieron cargar los datos.");
      }
      setRegistrations(data);
      setAuthenticated(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error inesperado.");
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPin("");
    setAuthenticated(false);
    setRegistrations([]);
    setMessage("");
    onClose();
  };

  const removeRegistration = async (registration: Registration) => {
    if (
      !window.confirm(
        `¿Eliminar la inscripción de ${registration.nombre} en ${getSportName(
          registration.deporte,
        )}?`,
      )
    ) {
      return;
    }

    const response = await fetch(`/api/admin/registrations/${registration.id}`, {
      method: "DELETE",
      headers: { "x-admin-pin": pin },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setMessage(data.message || "No se pudo eliminar la inscripción.");
      return;
    }

    setRegistrations((current) =>
      current.filter((item) => item.id !== registration.id),
    );
    onChanged();
  };

  const exportCsv = () => {
    const header = [
      "Nombre",
      "Teléfono",
      "Actividad",
      "Nivel",
      "Edad",
      "Pareja",
      "Nombre pareja / integrante 2",
      "Integrante 3",
      "Comentarios",
      "Participantes contabilizados",
      "Fecha",
    ];

    const rows = registrations.map((registration) => [
      registration.nombre,
      registration.telefono,
      getSportName(registration.deporte),
      registration.nivel,
      registration.edad,
      registration.pareja,
      registration.nombrePareja,
      registration.nombreCompanero2,
      registration.comentarios,
      registration.participantesContabilizados,
      new Date(registration.createdAt).toLocaleString("es-ES"),
    ]);

    const content = [header, ...rows]
      .map((row) => row.map(csvCell).join(";"))
      .join("\n");
    const blob = new Blob([`\uFEFF${content}`], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `inscripciones-sidi-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      open={open}
      title="Panel de administración"
      onClose={handleClose}
      wide={authenticated}
    >
      {!authenticated ? (
        <div className="admin-login">
          <p>
            Escribe el PIN configurado en el archivo <code>.env</code>.
          </p>
          <label className="field">
            <span>PIN de administración</span>
            <input
              type="password"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void loadRegistrations();
              }}
              autoFocus
            />
          </label>
          {message && <div className="error-callout">{message}</div>}
          <button
            type="button"
            className="primary-button"
            disabled={!pin || loading}
            onClick={() => void loadRegistrations()}
          >
            {loading ? "Comprobando..." : "Entrar"}
          </button>
        </div>
      ) : (
        <div className="admin-content">
          <div className="admin-summary">
            <div>
              <strong>{registrations.length}</strong>
              <span>Inscripciones</span>
            </div>
            <div>
              <strong>{participants}</strong>
              <span>Participantes</span>
            </div>
            <button
              type="button"
              className="secondary-button"
              disabled={registrations.length === 0}
              onClick={exportCsv}
            >
              Exportar CSV
            </button>
          </div>

          {message && <div className="error-callout">{message}</div>}

          <div className="admin-list">
            {registrations.length === 0 ? (
              <p className="muted-message">Todavía no hay inscripciones.</p>
            ) : (
              registrations.map((registration) => (
                <article className="admin-row" key={registration.id}>
                  <div className="admin-row__main">
                    <strong>{registration.nombre}</strong>
                    <span>{getSportName(registration.deporte)}</span>
                    <small>
                      {registration.telefono || "Sin teléfono"}
                      {registration.nivel ? ` · Nivel ${registration.nivel}` : ""}
                      {registration.edad ? ` · ${registration.edad} años` : ""}
                    </small>
                    {registration.nombrePareja && (
                      <small>Pareja/integrante 2: {registration.nombrePareja}</small>
                    )}
                    {registration.nombreCompanero2 && (
                      <small>Integrante 3: {registration.nombreCompanero2}</small>
                    )}
                  </div>
                  <div className="admin-row__actions">
                    <span className="participant-badge">
                      +{registration.participantesContabilizados}
                    </span>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => void removeRegistration(registration)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
