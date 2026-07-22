import {
  PRIZE_STOCK,
  SPORT_CATEGORY_ORDER,
  getSportsByCategory,
} from "@shared/sports";

function quantityText(quantity: number | null): string {
  return quantity === null ? "Por confirmar" : String(quantity);
}

export function PrizesSection() {
  return (
    <div className="prizes-layout">
      <section className="prize-summary">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Inventario</span>
            <h2>Resumen de trofeos y medallas</h2>
          </div>
        </div>

        <div className="summary-groups">
          <article className="summary-card">
            <h3>Competiciones</h3>
            {PRIZE_STOCK.competitions.map((item) => (
              <div className="summary-row" key={item.label}>
                <div>
                  <strong>{item.label}</strong>
                  <small>{item.note}</small>
                </div>
                <span>{quantityText(item.quantity)}</span>
              </div>
            ))}
          </article>

          <article className="summary-card">
            <h3>Actividades infantiles</h3>
            {PRIZE_STOCK.children.map((item) => (
              <div className="summary-row" key={item.label}>
                <div>
                  <strong>{item.label}</strong>
                  <small>{item.note}</small>
                </div>
                <span>{item.quantity}</span>
              </div>
            ))}
          </article>

          <article className="summary-card">
            <h3>Premios adicionales</h3>
            {PRIZE_STOCK.extras.map((item) => (
              <div className="summary-row" key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.quantity}</span>
              </div>
            ))}
          </article>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <span className="eyebrow">Detalle completo</span>
            <h2>Premios por competición</h2>
          </div>
        </div>

        <div className="prize-categories">
          {SPORT_CATEGORY_ORDER.map((category) => {
            const sports = getSportsByCategory(category);
            return (
              <section className="prize-category" key={category}>
                <h3>{category}</h3>
                <div className="prize-grid">
                  {sports.map((sport) => (
                    <article className="prize-card" key={sport.key}>
                      <header>
                        <h4>{sport.name}</h4>
                      </header>
                      {sport.prizes.length > 0 ? (
                        <div className="prize-table" role="table">
                          {sport.prizes.map((prize) => (
                            <div
                              className="prize-table__row"
                              role="row"
                              key={`${sport.key}-${prize.position}`}
                            >
                              <span className="prize-position">{prize.position}</span>
                              <div>
                                <strong>{prize.result}</strong>
                                <small>{prize.type}</small>
                              </div>
                              <span className="prize-quantity">
                                {quantityText(prize.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="muted-message">Premio no indicado.</p>
                      )}
                      {sport.prizeNote && (
                        <p className="prize-note">{sport.prizeNote}</p>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}
