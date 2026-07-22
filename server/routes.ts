import type { Express, NextFunction, Request, Response } from "express";
import { isSportKey } from "../shared/sports";
import type { Registration, StatsResponse } from "../shared/types";
import { pool } from "./db";
import { registrationSchema } from "./validation";

interface RegistrationRow {
  id: number;
  nombre: string;
  telefono: string | null;
  nivel: string | null;
  edad: number | null;
  deporte: string;
  pareja: "si" | "no" | null;
  nombre_integrante_1: string | null;
  nombre_pareja: string | null;
  nombre_companero_2: string | null;
  comentarios: string | null;
  participantes_contabilizados: number;
  created_at: Date | string;
}

interface StatRow {
  deporte: string;
  participants: string | number;
  registrations: string | number;
}

function mapRegistration(row: RegistrationRow): Registration {
  return {
    id: row.id,
    nombre: row.nombre,
    telefono: row.telefono,
    nivel: row.nivel,
    edad: row.edad,
    deporte: row.deporte as Registration["deporte"],
    pareja: row.pareja,
    nombreIntegrante1: row.nombre_integrante_1,
    nombrePareja: row.nombre_pareja,
    nombreCompanero2: row.nombre_companero_2,
    comentarios: row.comentarios,
    participantesContabilizados: row.participantes_contabilizados,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

function requireAdmin(request: Request, response: Response, next: NextFunction) {
  const expectedPin = process.env.ADMIN_PIN || "2026";
  const receivedPin = request.header("x-admin-pin");

  if (receivedPin !== expectedPin) {
    response.status(401).json({ message: "PIN de administración incorrecto." });
    return;
  }

  next();
}

function sendUnexpectedError(response: Response, error: unknown) {
  console.error(error);
  response.status(500).json({
    message:
      "Ha ocurrido un error interno. Comprueba DATABASE_URL y la conexión con Neon.",
  });
}

export function registerRoutes(app: Express): void {
  app.get("/api/health", async (_request, response) => {
    try {
      await pool.query("SELECT 1");
      response.json({ ok: true, database: "neon-postgresql-connected" });
    } catch (error) {
      sendUnexpectedError(response, error);
    }
  });

  app.get("/api/stats", async (_request, response) => {
    try {
      const result = await pool.query<StatRow>(`
        SELECT
          deporte,
          COALESCE(SUM(participantes_contabilizados), 0) AS participants,
          COUNT(*) AS registrations
        FROM registrations
        GROUP BY deporte
      `);

      const stats: StatsResponse["stats"] = {};
      let totalPlayers = 0;
      let totalRegistrations = 0;

      for (const row of result.rows) {
        if (!isSportKey(row.deporte)) continue;
        const participants = Number(row.participants);
        stats[row.deporte] = participants;
        totalPlayers += participants;
        totalRegistrations += Number(row.registrations);
      }

      const payload: StatsResponse = {
        stats,
        totalPlayers,
        totalRegistrations,
      };
      response.json(payload);
    } catch (error) {
      sendUnexpectedError(response, error);
    }
  });

  app.post("/api/registrations", async (request, response) => {
    const validation = registrationSchema.safeParse(request.body);

    if (!validation.success) {
      response.status(400).json({
        message: "Revisa los datos de la inscripción.",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const data = validation.data;

    try {
      const result = await pool.query<{ id: number }>(
  `
    INSERT INTO registrations (
      nombre,
      nivel,
      edad,
      deporte,
      pareja,
      nombre_integrante_1,
      nombre_pareja,
      nombre_companero_2,
      comentarios,
      participantes_contabilizados
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8,
      $9,
      $10
    )
    RETURNING id
  `,
  [
    data.nombre,
    data.nivel ?? null,
    data.edad ?? null,
    data.deporte,
    data.pareja ?? null,
    data.nombreIntegrante1 ?? null,
    data.nombrePareja ?? null,
    data.nombreCompanero2 ?? null,
    data.comentarios ?? null,
    data.participantesContabilizados,
  ],
);

      response.status(201).json({
        id: result.rows[0].id,
        message: "Inscripción guardada correctamente.",
        participantsAdded: data.participantesContabilizados,
      });
    } catch (error) {
      sendUnexpectedError(response, error);
    }
  });

  app.post("/api/admin/login", requireAdmin, (_request, response) => {
    response.json({ ok: true });
  });

  app.get("/api/admin/registrations", requireAdmin, async (_request, response) => {
    try {
      const result = await pool.query<RegistrationRow>(`
        SELECT *
        FROM registrations
        ORDER BY created_at DESC, id DESC
      `);
      response.json(result.rows.map(mapRegistration));
    } catch (error) {
      sendUnexpectedError(response, error);
    }
  });

  app.delete(
    "/api/admin/registrations/:id",
    requireAdmin,
    async (request, response) => {
      const id = Number(request.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        response.status(400).json({ message: "Identificador no válido." });
        return;
      }

      try {
        const result = await pool.query(
          "DELETE FROM registrations WHERE id = $1",
          [id],
        );

        if (result.rowCount === 0) {
          response.status(404).json({ message: "La inscripción no existe." });
          return;
        }

        response.status(204).send();
      } catch (error) {
        sendUnexpectedError(response, error);
      }
    },
  );
}
