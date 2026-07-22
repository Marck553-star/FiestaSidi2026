import { useCallback, useEffect, useState } from "react";
import { RegistrationModal } from "@/components/RegistrationModal";
import { SportsGrid } from "@/components/SportsGrid";
import { SuccessModal } from "@/components/SuccessModal";
import {
  WHATSAPP_COMMUNITY_URL,
  type SportKey,
} from "@shared/sports";
import type { StatsResponse } from "@shared/types";

const EMPTY_STATS: StatsResponse = {
  stats: {},
  totalPlayers: 0,
  totalRegistrations: 0,
};

export default function App() {
  const [stats, setStats] = useState<StatsResponse>(EMPTY_STATS);
  const [statsError, setStatsError] = useState("");
  const [selectedSport, setSelectedSport] = useState<SportKey | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [participantsAdded, setParticipantsAdded] = useState(1);

  const loadStats = useCallback(async () => {
    try {
      const response = await fetch("/api/stats");

      if (!response.ok) {
        throw new Error("No se pudieron cargar los contadores.");
      }

      const data: StatsResponse = await response.json();

      setStats(data);
      setStatsError("");
    } catch (error) {
      setStatsError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los contadores.",
      );
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  const handleRegistrationSuccess = (count: number) => {
    setSelectedSport(null);
    setParticipantsAdded(count);
    setSuccessOpen(true);
    void loadStats();
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero__overlay" />

        <div className="container hero__content">
          <div className="brand-block">
            <div className="brand-mark" aria-hidden="true">
              SIDI
            </div>

            <div>
              <span className="hero-kicker">Urbanización SIDI</span>
              <h1>Fiestas 2026</h1>
              <p>Inscripciones deportivas y equipos</p>
            </div>
          </div>

          <div className="hero-metrics">
            <div className="hero-metric">
              <strong>{stats.totalPlayers}</strong>
              <span>Participantes</span>
            </div>

            <div className="hero-metric">
              <strong>{stats.totalRegistrations}</strong>
              <span>Inscripciones</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container main-content">
        {statsError && (
          <div className="error-callout page-error">
            {statsError} Comprueba la conexión con Neon y que el servidor esté
            iniciado.
          </div>
        )}

        <section className="intro-panel">
          <div>
            <span className="eyebrow">Participa</span>
            <h2>Elige tu actividad</h2>
          </div>

          <a
            className="whatsapp-link"
            href={WHATSAPP_COMMUNITY_URL}
            target="_blank"
            rel="noreferrer"
          >
            💬 Comunidad de WhatsApp
          </a>
        </section>

        <SportsGrid
          stats={stats.stats}
          onRegister={setSelectedSport}
        />
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <div>
            <strong>Fiestas SIDI 2026</strong>
            <span>Inscripciones a las actividades de las fiestas</span>
          </div>

          <a
            href={WHATSAPP_COMMUNITY_URL}
            target="_blank"
            rel="noreferrer"
          >
            Unirme a la comunidad
          </a>
        </div>
      </footer>

      <RegistrationModal
        sportKey={selectedSport}
        onClose={() => setSelectedSport(null)}
        onSuccess={handleRegistrationSuccess}
      />

      <SuccessModal
        open={successOpen}
        participantsAdded={participantsAdded}
        onClose={() => setSuccessOpen(false)}
      />
    </div>
  );
}