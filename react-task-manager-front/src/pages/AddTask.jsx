import { useRef, useState } from "react";

const symbols = "!@#$%^&*()-_=+[]{}|;:'\\\",.<>?/`~";

function AddTask() {
    // Campo controllato
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState("");

    // Campi non controllati
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

    function handleSubmit(e) {
        e.preventDefault();

        const validationMessage = validateTitle(title);
        setTitleError(validationMessage);
        if (validationMessage) return;

        const newTask = {
            title: title.trim(),
            description: descriptionRef.current.value,
            status: statusRef.current.value,
        };

        console.log("Nuovo task da inviare:", newTask);
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
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="status">Stato</label>
                    <select id="status" ref={statusRef} defaultValue="To do">
                        <option value="To do">To do</option>
                        <option value="Doing">Doing</option>
                        <option value="Done">Done</option>
                    </select>
                </div>

                <button type="submit" className="btn-primary">
                    Aggiungi Task
                </button>
            </form>
        </div>
    );
}

export default AddTask;