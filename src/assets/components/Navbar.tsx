
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./HRTheme.css";
import Swal from "sweetalert2";


function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const isHRPage =
        location.pathname === "/hr" ||
        location.pathname.startsWith("/hr/");

    const isEmployeePage =
        location.pathname === "/employee" ||
        location.pathname.startsWith("/employee/");

    const hrLoggedIn = localStorage.getItem("hrLoggedIn") === "true";
    const employeeLoggedIn = localStorage.getItem("employeeLoggedIn") === "true";

    const logoutHR = async () => {
        const result = await Swal.fire({
            title: "Logout Confirmation",
            text: "Are you sure you want to logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#C9795D",
            cancelButtonColor: "#6c757d",
            reverseButtons: true
        });

        if (result.isConfirmed) {
            localStorage.removeItem("hrLoggedIn");
            localStorage.removeItem("role");
            localStorage.removeItem("idNumber");
            navigate("/");
        }
    };

    const logoutEmployee = async () => {
        const result = await Swal.fire({
            title: "Logout Confirmation",
            text: "Are you sure you want to logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#C9795D",
            cancelButtonColor: "#6c757d",
            reverseButtons: true
        });

        if (result.isConfirmed) {
            localStorage.removeItem("employeeLoggedIn");
            localStorage.removeItem("employeeIdNumber");
            localStorage.removeItem("employeeRole");
            navigate("/");
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark hr-navbar shadow-sm">
            <div className="container-fluid px-4">
                <Link
                    className="navbar-brand fw-bold"
                    to={
                        isHRPage && hrLoggedIn
                            ? "/hr"
                            : isEmployeePage && employeeLoggedIn
                              ? "/employee"
                              : "/"
                    }
                >
                    HR Attendance System
                </Link>

                <button
                    className="navbar-toggler border-0 shadow-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto gap-2">
                        {isHRPage && hrLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link fw-semibold px-3 py-2 ${
                                            location.pathname === "/hr" ? "active" : ""
                                        }`}
                                        to="/hr"
                                    >
                                        Dashboard
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        className={`nav-link fw-semibold px-3 py-2 ${
                                            location.pathname.startsWith("/hr/employees")
                                                ? "active"
                                                : ""
                                        }`}
                                        to="/hr/employees"
                                    >
                                        Employees
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        className={`nav-link fw-semibold px-3 py-2 ${
                                            location.pathname.startsWith("/hr/attendance")
                                                ? "active"
                                                : ""
                                        }`}
                                        to="/hr/attendance"
                                    >
                                        Attendance
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        className={`nav-link fw-semibold px-3 py-2 ${
                                            location.pathname.startsWith("/hr/reports")
                                                ? "active"
                                                : ""
                                        }`}
                                        to="/hr/reports"
                                    >
                                        Reports
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <button
                                        type="button"
                                        className="btn btn-link nav-link fw-semibold px-3 py-2"
                                        onClick={logoutHR}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : isEmployeePage && employeeLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link fw-semibold px-3 py-2 ${
                                            location.pathname === "/employee" ? "active" : ""
                                        }`}
                                        to="/employee"
                                    >
                                        My Dashboard
                                    </Link>
                                </li>


                                


                                <li className="nav-item">
                                    <Link
                                        className={`nav-link fw-semibold px-3 py-2 ${
                                            location.pathname.startsWith(
                                                "/employee/change-password"
                                            )
                                                ? "active"
                                                : ""
                                        }`}
                                        to="/employee/change-password"
                                    >
                                        Change Password
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <button
                                        type="button"
                                        className="btn btn-link nav-link fw-semibold px-3 py-2"
                                        onClick={logoutEmployee}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link fw-semibold px-3 py-2 ${
                                            location.pathname === "/" ? "active" : ""
                                        }`}
                                        to="/"
                                    >
                                        Home
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        className={`nav-link fw-semibold px-3 py-2 ${
                                            location.pathname === "/hr-login" ? "active" : ""
                                        }`}
                                        to="/hr-login"
                                    >
                                        HR Login
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        className={`nav-link fw-semibold px-3 py-2 ${
                                            location.pathname === "/employee-login"
                                                ? "active"
                                                : ""
                                        }`}
                                        to="/employee-login"
                                    >
                                        Employee Login
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
