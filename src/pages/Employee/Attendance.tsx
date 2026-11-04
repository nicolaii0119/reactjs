
import { useCallback, useEffect, useMemo, useState } from "react";

type AttendanceRecord = {
    Attendance_ID: number;
    Employee_ID: string;
    First_Name: string;
    Middle_Name?: string | null;
    Last_Name: string;
    Attendance_Date?: string;
    Time_In?: string | null;
    Time_Out?: string | null;
    Attendance_Status?: string | null;
};

const API_URL = "http://127.0.0.1:8000";

function formatTime(value?: string | null) {
    if (!value) return "—";

    const timePart = value.includes("T")
        ? value.split("T")[1]
        : value;

    const [hours, minutes, seconds] = timePart.split(":");
    const hour = Number(hours);

    if (Number.isNaN(hour)) return value;

    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;

    return `${formattedHour}:${minutes}:${(seconds || "00").slice(0, 2)} ${period}`;
}

function formatDate(value?: string) {
    if (!value) return "—";

    const datePart = value.split("T")[0];
    const [year, month, day] = datePart.split("-");

    if (!year || !month || !day) return value;

    return `${month}/${day}/${year}`;
}

function Attendance() {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [search, setSearch] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAttendance = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/attendance/today`);

            if (!response.ok) {
                throw new Error("Unable to load attendance records.");
            }

            const data = await response.json();
            setRecords(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Cannot connect to the attendance server."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAttendance();
    }, [loadAttendance]);

    const filteredRecords = useMemo(() => {
        return records.filter((record) => {
            const fullName = [
                record.First_Name,
                record.Middle_Name ?? "",
                record.Last_Name,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const searchValue = search.trim().toLowerCase();

            const matchesSearch =
                fullName.includes(searchValue) ||
                record.Employee_ID.toLowerCase().includes(searchValue);

            const recordDate = record.Attendance_Date
                ? record.Attendance_Date.split("T")[0]
                : "";

            const matchesDate =
                !selectedDate || recordDate === selectedDate;

            const status = (
                record.Attendance_Status || "Present"
            ).toLowerCase();

            const matchesStatus =
                selectedStatus === "All" ||
                status === selectedStatus.toLowerCase();

            return matchesSearch && matchesDate && matchesStatus;
        });
    }, [records, search, selectedDate, selectedStatus]);

    const presentCount = filteredRecords.filter(
        (record) =>
            (record.Attendance_Status || "Present").toLowerCase() ===
            "present"
    ).length;

    const lateCount = filteredRecords.filter(
        (record) =>
            (record.Attendance_Status || "").toLowerCase() === "late"
    ).length;

    const absentCount = filteredRecords.filter(
        (record) =>
            (record.Attendance_Status || "").toLowerCase() === "absent"
    ).length;

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Attendance Records</h2>
                    <p className="text-muted mb-0">
                        View and filter employee attendance.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={loadAttendance}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Refresh Records"}
                </button>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-danger ms-3"
                        onClick={loadAttendance}
                    >
                        Try Again
                    </button>
                </div>
            )}

            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="text-muted small">Present</div>
                            <h3 className="fw-bold text-success mb-0">
                                {presentCount}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="text-muted small">Late</div>
                            <h3 className="fw-bold text-warning mb-0">
                                {lateCount}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="text-muted small">Absent</div>
                            <h3 className="fw-bold text-danger mb-0">
                                {absentCount}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <div className="row g-3 mb-4">
                        <div className="col-lg-5">
                            <label
                                htmlFor="attendanceSearch"
                                className="form-label"
                            >
                                Search Employee
                            </label>
                            <input
                                id="attendanceSearch"
                                type="search"
                                className="form-control"
                                placeholder="Employee ID or name"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />
                        </div>

                        <div className="col-lg-4">
                            <label
                                htmlFor="attendanceDate"
                                className="form-label"
                            >
                                Attendance Date
                            </label>
                            <input
                                id="attendanceDate"
                                type="date"
                                className="form-control"
                                value={selectedDate}
                                onChange={(event) =>
                                    setSelectedDate(event.target.value)
                                }
                            />
                        </div>

                        <div className="col-lg-3">
                            <label
                                htmlFor="attendanceStatus"
                                className="form-label"
                            >
                                Status
                            </label>
                            <select
                                id="attendanceStatus"
                                className="form-select"
                                value={selectedStatus}
                                onChange={(event) =>
                                    setSelectedStatus(event.target.value)
                                }
                            >
                                <option value="All">All Statuses</option>
                                <option value="Present">Present</option>
                                <option value="Late">Late</option>
                                <option value="Absent">Absent</option>
                            </select>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold mb-0">Employee List</h5>
                        <span className="text-muted small">
                            {filteredRecords.length} records
                        </span>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Employee Name</th>
                                    <th>Date</th>
                                    <th>Time In</th>
                                    <th>Time Out</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="text-center py-4"
                                        >
                                            Loading attendance records...
                                        </td>
                                    </tr>
                                ) : filteredRecords.length > 0 ? (
                                    filteredRecords.map((record, index) => {
                                        const status =
                                            record.Attendance_Status ||
                                            "Present";

                                        const fullName = [
                                            record.First_Name,
                                            record.Middle_Name ?? "",
                                            record.Last_Name,
                                        ]
                                            .filter(Boolean)
                                            .join(" ");

                                        const badgeClass =
                                            status.toLowerCase() === "late"
                                                ? "bg-warning text-dark"
                                                : status.toLowerCase() ===
                                                    "absent"
                                                  ? "bg-danger"
                                                  : "bg-success";

                                        return (
                                            <tr
                                                key={
                                                    record.Attendance_ID ??
                                                    `${record.Employee_ID}-${index}`
                                                }
                                            >
                                                <td>{record.Employee_ID}</td>
                                                <td>{fullName}</td>
                                                <td>
                                                    {formatDate(
                                                        record.Attendance_Date
                                                    )}
                                                </td>
                                                <td>
                                                    {formatTime(record.Time_In)}
                                                </td>
                                                <td>
                                                    {formatTime(record.Time_Out)}
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge ${badgeClass}`}
                                                    >
                                                        {status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="text-center text-muted py-4"
                                        >
                                            {error
                                                ? "Attendance records could not be loaded."
                                                : "No matching attendance records found."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Attendance;
