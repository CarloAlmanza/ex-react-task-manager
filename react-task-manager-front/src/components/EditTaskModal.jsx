import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";

function EditTaskModal({ show, onClose, task, onSave }) {
    const editFormRef = useRef(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("To do");

    // Precompila il form ogni volta che la modale si apre o cambia task
    useEffect(() => {
        if (show && task) {
            setTitle(task.title ?? "");
            setDescription(task.description ?? "");
            setStatus(task.status ?? "To do");
        }
    }, [show, task]);

    function handleSubmit(e) {
        e.preventDefault();

        const updatedTask = {
            ...task,
            title: title.trim(),
            description,
            status,
        };

        onSave(updatedTask);
    }

    function handleConfirmClick() {
        // Triggera il submit del form come se l'utente avesse premuto Invio
        editFormRef.current?.requestSubmit();
    }

    return (
        <Modal
            title="Modifica Task"
            show={show}
            onClose={onClose}
            onConfirm={handleConfirmClick}
            confirmText="Salva"
            content={
                <form ref={editFormRef} onSubmit={handleSubmit} className="task-form">
                    <div className="form-field">
                        <label htmlFor="edit-title">Nome</label>
                        <input
                            id="edit-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="edit-description">Descrizione</label>
                        <textarea
                            id="edit-description"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="edit-status">Stato</label>
                        <select
                            id="edit-status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="To do">To do</option>
                            <option value="Doing">Doing</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>

                    {/* Submit nascosto: serve solo a permettere requestSubmit().
              L'utente non lo vede né lo clicca mai. */}
                    <button type="submit" style={{ display: "none" }} aria-hidden="true" />
                </form>
            }
        />
    );
}

export default EditTaskModal;