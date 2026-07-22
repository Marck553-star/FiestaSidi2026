import { WHATSAPP_COMMUNITY_URL } from "@shared/sports";
import { Modal } from "./Modal";

interface SuccessModalProps {
  open: boolean;
  participantsAdded: number;
  onClose: () => void;
}

export function SuccessModal({
  open,
  participantsAdded,
  onClose,
}: SuccessModalProps) {
  return (
    <Modal open={open} title="¡Inscripción completada!" onClose={onClose}>
      <div className="success-content">
        <div className="success-icon" aria-hidden="true">
          ✓
        </div>
        <h3>Tu inscripción se ha guardado correctamente</h3>
        <p>
          Se {participantsAdded === 1 ? "ha" : "han"} añadido {participantsAdded}{" "}
          {participantsAdded === 1 ? "participante" : "participantes"} al
          contador.
        </p>
        <div className="whatsapp-card">
          <div className="whatsapp-card__icon">💬</div>
          <div>
            <strong>Únete a la comunidad de WhatsApp</strong>
            <p>
              Entra para enterarte de horarios, cambios, resultados y toda la
              información de las Fiestas SIDI 2026.
            </p>
          </div>
        </div>
        <a
          className="whatsapp-button"
          href={WHATSAPP_COMMUNITY_URL}
          target="_blank"
          rel="noreferrer"
        >
          Unirme a la comunidad
        </a>
        <button type="button" className="secondary-button" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </Modal>
  );
}
