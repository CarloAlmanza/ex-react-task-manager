import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function useTasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // GET iniziale
    useEffect(() => {
        async function fetchTasks() {
            try {
                setLoading(true);
                const res = await fetch(`${API_URL}/tasks`);
                if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);
                const data = await res.json();
                setTasks(data);
            } catch (err) {
                console.error("Errore nel recupero dei task:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchTasks();
    }, []);

    // POST /tasks
    async function addTask(newTask) {
        const res = await fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask),
        });

        const data = await res.json();

        if (!data.success) {
            throw new Error(data.message || "Errore durante la creazione del task.");
        }

        setTasks((prev) => [...prev, data.task]);
        return data.task;
    }

    // DELETE /tasks/:id
    async function removeTask(taskId) {
        const res = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: "DELETE",
        });

        const data = await res.json();

        if (!data.success) {
            throw new Error(data.message || "Errore durante l'eliminazione del task.");
        }

        setTasks((prev) => prev.filter((t) => String(t.id) !== String(taskId)));
        return true;
    }

    // PUT /tasks/:id — placeholder per la prossima milestone
    async function updateTask(id, updates) {
        // TODO: implementare nella Milestone 9
    }

    return {
        tasks,
        setTasks,
        loading,
        error,
        addTask,
        removeTask,
        updateTask,
    };
}