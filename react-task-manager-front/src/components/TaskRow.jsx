import { memo } from "react";
import { Link } from "react-router-dom";

const STATUS_CLASS = {
    "To do": "status-todo",
    "Doing": "status-doing",
    "Done": "status-done",
};

function TaskRow({ task, checked, onToggle }) {
    const statusClass = STATUS_CLASS[task.status] || "";

    return (
        <tr className={checked ? "row-selected" : ""}>
            <td className="cell-checkbox">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(task.id)}
                    aria-label={`Seleziona ${task.title}`}
                />
            </td>
            <td>
                <Link to={`/task/${task.id}`} className="task-title-link">
                    {task.title}
                </Link>
            </td>
            <td className={`status-cell ${statusClass}`}>{task.status}</td>
            <td>{new Date(task.createdAt).toLocaleDateString("it-IT")}</td>
        </tr>
    );
}

export default memo(TaskRow);