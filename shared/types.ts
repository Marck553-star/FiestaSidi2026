import type { SportKey } from "./sports";

export interface RegistrationPayload {
  nombre: string;
  nivel?: string | null;
  edad?: number | null;
  deporte: SportKey;
  pareja?: "si" | "no" | null;

  nombreIntegrante1?: string | null;
  nombrePareja?: string | null;
  nombreCompanero2?: string | null;

  comentarios?: string | null;
}

export interface Registration extends RegistrationPayload {
  id: number;
  participantesContabilizados: number;
  createdAt: string;
}

export interface StatsResponse {
  stats: Partial<Record<SportKey, number>>;
  totalPlayers: number;
  totalRegistrations: number;
}