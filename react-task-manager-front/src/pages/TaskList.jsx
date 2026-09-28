import { useMemo, useState } from "react";
import { useGlobal } from "../context/GlobalContext";
import TaskRow from "../components/TaskRow";

const STATUS_ORDER = {
    "To do": 0,
    "Doing": 1,
    "Done": 2,
};

function TaskList() {
    const { tasks, loading, error } = useGlobal();

    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState(1);

    function handleSort(column) {
        if (sortBy === column) {
            setSortOrder((prev) => prev * -1);
        } else {
            setSortBy(column);
            setSortOrder(1);
        }
    }

    const sortedTasks = useMemo(() => {
        const copy = [...tasks];

        copy.sort((a, b) => {
            let comparison = 0;

            if (sortBy === "title") {
                comparison = a.title.localeCompare(b.title);
            } else if (sortBy === "status") {
                comparison = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
            } else if (sortBy === "createdAt") {
                comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }

            return comparison * sortOrder;
        });

        return copy;
    }, [tasks, sortBy, sortOrder]);

    if (loading) return <p>Caricamento in corso…</p>;
    if (error) return <p>Errore: {error}</p>;

    function arrowFor(column) {
        if (sortBy !== column) return "";
        return sortOrder === 1 ? " ▲" : " ▼";
    }

    return (
        <div className="page">
            <h1>Lista dei Task</h1>

            {tasks.length === 0 ? (
                <p>Nessun task presente.</p>
            ) : (
                <table className="task-table">
                    <thead>
                        <tr>
                            <th className="sortable" onClick={() => handleSort("title")}>
                                Nome{arrowFor("title")}
                            </th>
                            <th className="sortable" onClick={() => handleSort("status")}>
                                Stato{arrowFor("status")}
                            </th>
                            <th className="sortable" onClick={() => handleSort("createdAt")}>
                                Data di Creazione{arrowFor("createdAt")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTasks.map((task) => (
                            <TaskRow key={task.id} task={task} />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default TaskList;