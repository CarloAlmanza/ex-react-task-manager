import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import Modal from "../components/Modal";
import EditTaskModal from "../components/EditTaskModal";

const STATUS_CLASS = {
    "To do": "status-todo",
    "Doing": "status-doing",
    "Done": "status-done",
};

function TaskDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { tasks, loading, error, removeTask, updateTask } = useGlobal();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    if (loading) return <p>Caricamento in corso…</p>;
    if (error) return <p>Errore: {error}</p>;

    const task = tasks.find((t) => String(t.id) === String(id));

    if (!task) {
        return (
            <div className="page">
                <h1>Task non trovato</h1>
                <p>Il task con id <strong>{id}</strong> non esiste o è stato eliminato.</p>
                <Link to="/" className="btn-link">← Torna alla lista</Link>
            </div>
        );
    }

    const statusClass = STATUS_CLASS[task.status] || "";

    async function handleConfirmDelete() {
        try {
            await removeTask(task.id);
            setShowDeleteModal(false);
            alert("Task eliminata con successo!");
            navigate("/");
        } catch (err) {
            setShowDeleteModal(false);
            alert(`Errore: ${err.message}`);
        }
    }

    async function handleSaveTask(updatedTask) {
        try {
            await updateTask(updatedTask);
            setShowEditModal(false);
            alert("Task modificata con successo!");
        } catch (err) {
            alert(`Errore: ${err.message}`);
        }
    }

    return (
        <div className="page">
            <Link to="/" className="btn-link">← Torna alla lista</Link>

            <h1>{task.title}</h1>

            <div className="detail-card">
                <div className="detail-row">
                    <span className="detail-label">Stato</span>
                    <span className={`status-cell ${statusClass}`}>{task.status}</span>
                </div>

                <div className="detail-row">
                    <span className="detail-label">Descrizione</span>
                    <span className="detail-value">
                        {task.description ? task.description : <em>Nessuna descrizione</em>}
                    </span>
                </div>

                <div className="detail-row">
                    <span className="detail-label">Data di creazione</span>
                    <span className="detail-value">
                        {new Date(task.createdAt).toLocaleString("it-IT")}
                    </span>
                </div>
            </div>

            <div className="detail-actions">
                <button className="btn-primary" onClick={() => setShowEditModal(true)}>
                    Modifica Task
                </button>
                <button className="btn-danger" onClick={() => setShowDeleteModal(true)}>
                    Elimina Task
                </button>
            </div>

            <EditTaskModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                task={task}
                onSave={handleSaveTask}
            />

            <Modal
                title="Conferma eliminazione"
                content={
                    <>
                        Sei sicuro di voler eliminare il task{" "}
                        <strong>{task.title}</strong>? L'operazione non è reversibile.
                    </>
                }
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                confirmText="Elimina"
            />
        </div>
    );
}

export default TaskDetail;