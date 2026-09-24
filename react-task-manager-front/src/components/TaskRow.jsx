import { memo } from "react";

const STATUS_CLASS = {
    "To do": "status-todo",
    "Doing": "status-doing",
    "Done": "status-done",
};

function TaskRow({ task }) {
    const statusClass = STATUS_CLASS[task.status] || "";

    return (
        <tr>
            <td>{task.title}</td>
            <td className={`status-cell ${statusClass}`}>{task.status}</td>
            <td>{new Date(task.createdAt).toLocaleDateString("it-IT")}</td>
        </tr>
    );
}

// memo evita il re-render se le props non cambiano
export default memo(TaskRow);