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

    // Placeholder — verranno implementate nelle prossime milestone
    async function addTask(newTask) {
        // TODO: POST /tasks
    }

    async function removeTask(id) {
        // TODO: DELETE /tasks/:id
    }

    async function updateTask(id, updates) {
        // TODO: PUT /tasks/:id
    }

    return {
        tasks,
        setTasks, // esposto per casi speciali, ma le mutazioni passeranno dalle 3 funzioni
        loading,
        error,
        addTask,
        removeTask,
        updateTask,
    };
}