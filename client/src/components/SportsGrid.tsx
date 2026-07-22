import {
  SPORT_CATEGORY_ORDER,
  getSportsByCategory,
  type SportDefinition,
  type SportKey,
} from "@shared/sports";

interface SportsGridProps {
  stats: Partial<
    Record<SportKey, number>
  >;

  onRegister: (
    sport: SportKey,
  ) => void;
}

const CATEGORY_SYMBOLS: Record<
  string,
  string
> = {
  Pádel: "🏆",
  Tenis: "🎾",
  "Ping-Pong": "🏓",
  Basket: "🏀",
  Fútbol: "⚽",
  Golf: "⛳",
  Natación: "🏊",
  Futbolín: "⚽",
  "Juegos de mesa": "🎲",
  Eventos: "🎉",
  "Eventos especiales": "👑",
};

function teamDescription(
  sport: SportDefinition,
): string {
  if (sport.registrationNote) {
    return sport.registrationNote;
  }

  if (
    sport.teamMode ===
    "required-pair"
  ) {
    return "Pareja obligatoria · suma 2";
  }

  if (
    sport.teamMode === "team-3"
  ) {
    return "Equipo obligatorio de 3";
  }

  if (
    sport.teamMode ===
    "optional-pair"
  ) {
    return "Individual o con pareja";
  }

  return "Inscripción individual";
}

function sectionType(
  category: string,
): string {
  if (
    category === "Eventos" ||
    category ===
      "Eventos especiales"
  ) {
    return "Evento";
  }

  return "Competición";
}

export function SportsGrid({
  stats,
  onRegister,
}: SportsGridProps) {
  return (
    <div className="sports-sections">
      {SPORT_CATEGORY_ORDER.map(
        (category) => {
          const sports =
            getSportsByCategory(
              category,
            );

          if (sports.length === 0) {
            return null;
          }

          return (
            <section
              className="sport-category"
              key={category}
            >
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    {sectionType(
                      category,
                    )}
                  </span>

                  <h2>{category}</h2>
                </div>

                <span className="category-count">
                  {sports.length}{" "}
                  {sports.length === 1
                    ? "actividad"
                    : "actividades"}
                </span>
              </div>

              <div className="sports-grid">
                {sports.map(
                  (sport) => (
                    <article
                      className="sport-card"
                      key={sport.key}
                    >
                      <div className="sport-card__top">
                        <div
                          className="sport-symbol"
                          aria-hidden="true"
                        >
                          {CATEGORY_SYMBOLS[
                            category
                          ] || "🏅"}
                        </div>

                        <span className="participant-badge">
                          {stats[
                            sport.key as SportKey
                          ] ?? 0}
                        </span>
                      </div>

                      <div>
                        <h3>
                          {
                            sport.shortName
                          }
                        </h3>

                        <p>
                          {teamDescription(
                            sport,
                          )}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="primary-button primary-button--small"
                        onClick={() =>
                          onRegister(
                            sport.key as SportKey,
                          )
                        }
                      >
                        Inscribirse
                      </button>
                    </article>
                  ),
                )}
              </div>
            </section>
          );
        },
      )}
    </div>
  );
}