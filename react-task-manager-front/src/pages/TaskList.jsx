import { useCallback, useMemo, useRef, useState } from "react";
import { useGlobal } from "../context/GlobalContext";
import TaskRow from "../components/TaskRow";

const STATUS_ORDER = { "To do": 0, "Doing": 1, "Done": 2 };

function TaskList() {
    const { tasks, loading, error, removeMultipleTasks } = useGlobal();

    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTaskIds, setSelectedTaskIds] = useState([]);

    const searchInputRef = useRef(null);
    const debounceTimerRef = useRef(null);

    function handleSort(column) {
        if (sortBy === column) {
            setSortOrder((prev) => prev * -1);
        } else {
            setSortBy(column);
            setSortOrder(1);
        }
    }

    const debouncedSetSearch = useCallback((value) => {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => setSearchQuery(value), 300);
    }, []);

    function handleSearchChange() {
        debouncedSetSearch(searchInputRef.current?.value ?? "");
    }

    // useCallback: mantiene stabile il riferimento → React.memo su TaskRow funziona
    const toggleSelection = useCallback((taskId) => {
        setSelectedTaskIds((prev) =>
            prev.some((id) => String(id) === String(taskId))
                ? prev.filter((id) => String(id) !== String(taskId))
                : [...prev, taskId]
        );
    }, []);

    const visibleTasks = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        const filtered = query
            ? tasks.filter((t) => t.title.toLowerCase().includes(query))
            : tasks;

        const copy = [...filtered];

        copy.sort((a, b) => {
            let comparison = 0;
            if (sortBy === "title") {
                comparison = a.title.localeCompare(b.title, "it", { sensitivity: "base" });
            } else if (sortBy === "status") {
                comparison = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
            } else if (sortBy === "createdAt") {
                comparison =
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
            return comparison * sortOrder;
        });

        return copy;
    }, [tasks, searchQuery, sortBy, sortOrder]);

    async function handleDeleteSelected() {
        try {
            await removeMultipleTasks(selectedTaskIds);
            alert(`${selectedTaskIds.length} task eliminate con successo!`);
            setSelectedTaskIds([]);
        } catch (err) {
            alert(`Errore: ${err.message}`);
            // Svuoto comunque: le task rimaste non sono più selezionabili
            setSelectedTaskIds([]);
        }
    }

    if (loading) return <p>Caricamento in corso…</p>;
    if (error) return <p>Errore: {error}</p>;

    function arrowFor(column) {
        if (sortBy !== column) return "";
        return sortOrder === 1 ? " ▲" : " ▼";
    }

    return (
        <div className="page">
            <h1>Lista dei Task</h1>

            <div className="toolbar">
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Cerca per nome…"
                    onChange={handleSearchChange}
                    className="search-input"
                />

                {selectedTaskIds.length > 0 && (
                    <button className="btn-danger" onClick={handleDeleteSelected}>
                        Elimina Selezionate ({selectedTaskIds.length})
                    </button>
                )}
            </div>

            {visibleTasks.length === 0 ? (
                <p>
                    {searchQuery
                        ? `Nessun task trovato per "${searchQuery}".`
                        : "Nessun task presente."}
                </p>
            ) : (
                <table className="task-table">
                    <thead>
                        <tr>
                            <th className="cell-checkbox" aria-label="Selezione"></th>
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
                        {visibleTasks.map((task) => (
                            <TaskRow
                                key={task.id}
                                task={task}
                                checked={selectedTaskIds.some(
                                    (id) => String(id) === String(task.id)
                                )}
                                onToggle={toggleSelection}
                            />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default TaskList;