export default function Modal({ isOpen, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Information</h2>
        <p>{message}</p>
        <button className="button" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}