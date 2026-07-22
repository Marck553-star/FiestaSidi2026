import "dotenv/config";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Falta DATABASE_URL. Copia .env.example como .env y pega la conexión de Neon PostgreSQL.",
  );
}

/**
 * Neon entrega una URL PostgreSQL con SSL incluido, normalmente con
 * ?sslmode=require. node-postgres usa directamente esa cadena.
 */
export const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 15_000,
});

export async function initializeDatabase(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS registrations (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      telefono VARCHAR(30),
      nivel VARCHAR(20),
      edad INTEGER,
      deporte VARCHAR(80) NOT NULL,
      pareja VARCHAR(2),
      nombre_integrante_1 VARCHAR(150),
      nombre_pareja VARCHAR(150),
      nombre_companero_2 VARCHAR(150),
      comentarios TEXT,
      participantes_contabilizados SMALLINT NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT registrations_edad_valida
        CHECK (edad IS NULL OR (edad >= 0 AND edad <= 120)),
      CONSTRAINT registrations_participantes_validos
        CHECK (participantes_contabilizados BETWEEN 1 AND 3),
      CONSTRAINT registrations_pareja_valida
        CHECK (pareja IS NULL OR pareja IN ('si', 'no'))
    )
  `);
  await pool.query(`
    ALTER TABLE registrations
    ADD COLUMN IF NOT EXISTS nombre_integrante_1 VARCHAR(150)
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_registrations_deporte
    ON registrations (deporte)
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_registrations_created_at
    ON registrations (created_at DESC)
  `);
}
