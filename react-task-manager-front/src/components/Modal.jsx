import { createPortal } from "react-dom";

function Modal({
    title,
    content,
    show,
    onClose,
    onConfirm,
    confirmText = "Conferma",
}) {
    if (!show) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-box"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <h2 className="modal-title">{title}</h2>

                <div className="modal-content">{content}</div>

                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onClose}>
                        Annulla
                    </button>
                    <button className="btn-danger" onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default Modal;