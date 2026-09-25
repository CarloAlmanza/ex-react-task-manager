import { useRef, useState } from "react";
import { useGlobal } from "../context/GlobalContext";

const symbols = "!@#$%^&*()-_=+[]{}|;:'\\\",.<>?/`~";

function AddTask() {
    const { addTask } = useGlobal();

    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const descriptionRef = useRef(null);
    const statusRef = useRef(null);

    function validateTitle(value) {
        const trimmed = value.trim();

        if (!trimmed) {
            return "Il nome del task non può essere vuoto.";
        }

        const hasSymbol = [...trimmed].some((ch) => symbols.includes(ch));
        if (hasSymbol) {
            return "Il nome del task non può contenere simboli speciali.";
        }

        return "";
    }

    function resetForm() {
        setTitle("");
        setTitleError("");
        if (descriptionRef.current) descriptionRef.current.value = "";
        if (statusRef.current) statusRef.current.value = "To do";
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const validationMessage = validateTitle(title);
        setTitleError(validationMessage);
        if (validationMessage) return;

        const newTask = {
            title: title.trim(),
            description: descriptionRef.current.value,
            status: statusRef.current.value,
        };

        try {
            setSubmitting(true);
            await addTask(newTask);
            alert("Task creata con successo!");
            resetForm();
        } catch (err) {
            alert(`Errore: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="page">
            <h1>Aggiungi Task</h1>

            <form className="task-form" onSubmit={handleSubmit} noValidate>
                <div className="form-field">
                    <label htmlFor="title">Nome del task *</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Es. Studiare React"
                        disabled={submitting}
                    />
                    {titleError && <p className="form-error">{titleError}</p>}
                </div>

                <div className="form-field">
                    <label htmlFor="description">Descrizione</label>
                    <textarea
                        id="description"
                        ref={descriptionRef}
                        rows={4}
                        placeholder="Descrizione opzionale…"
                        disabled={submitting}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="status">Stato</label>
                    <select
                        id="status"
                        ref={statusRef}
                        defaultValue="To do"
                        disabled={submitting}
                    >
                        <option value="To do">To do</option>
                        <option value="Doing">Doing</option>
                        <option value="Done">Done</option>
                    </select>
                </div>

                <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? "Salvataggio…" : "Aggiungi Task"}
                </button>
            </form>
        </div>
    );
}

export default AddTask;