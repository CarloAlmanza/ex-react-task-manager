import { memo } from "react";
import { Link } from "react-router-dom";

const STATUS_CLASS = {
    "To do": "status-todo",
    "Doing": "status-doing",
    "Done": "status-done",
};

function TaskRow({ task }) {
    const statusClass = STATUS_CLASS[task.status] || "";

    return (
        <tr>
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