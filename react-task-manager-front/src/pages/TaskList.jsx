import { useGlobal } from "../context/GlobalContext";
import TaskRow from "../components/TaskRow";

function TaskList() {
    const { tasks, loading, error } = useGlobal();

    if (loading) return <p>Caricamento in corso…</p>;
    if (error) return <p>Errore: {error}</p>;

    return (
        <div className="page">
            <h1>Lista dei Task</h1>

            {tasks.length === 0 ? (
                <p>Nessun task presente.</p>
            ) : (
                <table className="task-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Stato</th>
                            <th>Data di Creazione</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <TaskRow key={task.id} task={task} />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default TaskList;