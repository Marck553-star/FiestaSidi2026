CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  telefono VARCHAR(30),
  nivel VARCHAR(20),
  edad INTEGER,
  deporte VARCHAR(80) NOT NULL,
  pareja VARCHAR(2),
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
);

CREATE INDEX IF NOT EXISTS idx_registrations_deporte
  ON registrations (deporte);

CREATE INDEX IF NOT EXISTS idx_registrations_created_at
  ON registrations (created_at DESC);
