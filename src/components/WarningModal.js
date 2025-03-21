export default function WarningModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content warning">
        <h2>⚠️ Attention</h2>
        <p>Vous avez quitté la fenêtre d'examen. La question actuelle sera notée 0 et vous passerez à la suivante.</p>
        <button className="btn btn-danger" onClick={onClose}>
          Compris
        </button>
      </div>
    </div>
  );
}