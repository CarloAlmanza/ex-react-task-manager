import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
            <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
                Lista Task
            </NavLink>

            <NavLink
                to="/add"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
                Aggiungi Task
            </NavLink>
        </nav>
    );
}

export default Navbar;