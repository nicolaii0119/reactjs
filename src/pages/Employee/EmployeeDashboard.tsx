
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Employee = {
    Employee_ID: string;
    First_Name: string;
    Middle_Name: string | null;
    Last_Name: string;
    Email: string | null;
    Contact: string | null;
    Department: string | null;
    Position: string | null;
    Status: string;
};

type Attendance = {
    Attendance_ID: number;
    Attendance_Date: string;
    Time_In: string | null;
    Time_Out: string | null;
    Attendance_Status: string;
};

function EmployeeDashboard() {
    const navigate = useNavigate();

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [records, setRecords] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);

    const employeeId = localStorage.getItem("employeeIdNumber");

    useEffect(() => {
        if (
            localStorage.getItem("employeeLoggedIn") !== "true" ||
            !employeeId
        ) {
            navigate("/employee-login", { replace: true });
            return;
        }

        const loadDashboard = async () => {
            try {
                const [employeeResponse, attendanceResponse] =
                    await Promise.all([
                        fetch(
                            `http://127.0.0.1:8000/employees/${encodeURIComponent(employeeId)}`
                        ),
                        fetch(
                            `http://127.0.0.1:8000/employee/${encodeURIComponent(employeeId)}/attendance`
                        )
                    ]);

                if (!employeeResponse.ok || !attendanceResponse.ok) {
                    throw new Error("Unable to load dashboard information.");
                }

                const employeeData = await employeeResponse.json();
                const attendanceData = await attendanceResponse.json();

                setEmployee(employeeData);
                setRecords(
                    Array.isArray(attendanceData) ? attendanceData : []
                );
            } catch (error) {
                console.error("Dashboard error:", error);
                alert("Cannot load your profile or attendance records.");
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [employeeId, navigate]);

    const fullName = employee
        ? [
              employee.First_Name,
              employee.Middle_Name,
              employee.Last_Name
          ]
              .filter(Boolean)
              .join(" ")
        : "Employee";

    const initials = employee
        ? `${employee.First_Name?.charAt(0) ?? ""}${employee.Last_Name?.charAt(0) ?? ""}`
        : "E";

    const formatTime = (value: string | null) => {
        if (!value) return "Not recorded";

        return new Date(value).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const formatDate = (value: string) => {
        const date = new Date(`${value}T00:00:00`);

        return date.toLocaleDateString("en-PH", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="container py-4 py-md-5">
            <div className="mb-4">
                <h2 className="fw-bold mb-1">My Dashboard</h2>
                <p className="text-muted mb-0">
                    Welcome to your employee portal.
                </p>
            </div>

            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-4 flex-wrap">
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                            style={{
                                width: "90px",
                                height: "90px",
                                minWidth: "90px",
                                backgroundColor: "#e0eee8",
                                color: "#285943",
                                fontSize: "28px"
                            }}
                        >
                            {initials.toUpperCase()}
                        </div>

                        <div>
                            <h3 className="fw-bold mb-1">{fullName}</h3>
                            <p className="text-muted mb-1">
                                Employee ID: {employee?.Employee_ID}
                            </p>
                            <p className="mb-1">
                                {employee?.Department || "No department assigned"}
                                {" · "}
                                {employee?.Position || "No position assigned"}
                            </p>
                            <span
                                className={`badge ${
                                    employee?.Status === "Active"
                                        ? "bg-success"
                                        : "bg-secondary"
                                }`}
                            >
                                {employee?.Status || "Unknown"}
                            </span>
                        </div>
                    </div>

                    <hr />

                    <div className="row g-3">
                        <div className="col-md-6">
                            <small className="text-muted">Email</small>
                            <p className="mb-0">
                                {employee?.Email || "Not provided"}
                            </p>
                        </div>

                        <div className="col-md-6">
                            <small className="text-muted">Contact Number</small>
                            <p className="mb-0">
                                {employee?.Contact || "Not provided"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <p className="text-muted mb-2">
                                Total Attendance Records
                            </p>
                            <h3 className="fw-bold mb-0">{records.length}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <p className="text-muted mb-2">
                                Completed Time Outs
                            </p>
                            <h3 className="fw-bold mb-0">
                                {
                                    records.filter(
                                        (record) => record.Time_Out !== null
                                    ).length
                                }
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <p className="text-muted mb-2">
                                Pending Time Outs
                            </p>
                            <h3 className="fw-bold mb-0">
                                {
                                    records.filter(
                                        (record) =>
                                            record.Time_In !== null &&
                                            record.Time_Out === null
                                    ).length
                                }
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">
                        My Attendance History
                    </h5>

                    {records.length === 0 ? (
                        <p className="text-muted mb-0">
                            No attendance records found yet.
                        </p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Time In</th>
                                        <th>Time Out</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((record) => (
                                        <tr key={record.Attendance_ID}>
                                            <td>
                                                {formatDate(record.Attendance_Date)}
                                            </td>
                                            <td>{formatTime(record.Time_In)}</td>
                                            <td>{formatTime(record.Time_Out)}</td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        record.Attendance_Status === "Present"
                                                            ? "bg-success"
                                                            : record.Attendance_Status === "Late"
                                                              ? "bg-warning text-dark"
                                                              : "bg-secondary"
                                                    }`}
                                                >
                                                    {record.Attendance_Status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EmployeeDashboard;

