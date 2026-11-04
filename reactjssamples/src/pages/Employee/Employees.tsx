
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/components/HRTheme.css";

interface Employee {
    Employee_ID: string;
    First_Name: string;
    Middle_Name?: string;
    Last_Name: string;
    Email?: string;
    Contact?: string;
    Department?: string;
    Position?: string;
    Status: string;
}

function Employees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    const fetchEmployees = async () => {
        setLoading(true);

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/employees"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch employees.");
            }

            const data = await response.json();
            setEmployees(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            alert("Cannot connect to FastAPI.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const departments = useMemo(() => {
        return Array.from(
            new Set(
                employees
                    .map((employee) => employee.Department?.trim())
                    .filter(
                        (department): department is string =>
                            Boolean(department)
                    )
            )
        ).sort();
    }, [employees]);

    const filteredEmployees = useMemo(() => {
        return employees.filter((employee) => {
            const fullName = [
                employee.First_Name,
                employee.Middle_Name,
                employee.Last_Name,
            ]
                .filter(Boolean)
                .join(" ");

            const searchText = search.trim().toLowerCase();

            const matchesSearch =
                employee.Employee_ID.toLowerCase().includes(searchText) ||
                fullName.toLowerCase().includes(searchText) ||
                (employee.Email || "").toLowerCase().includes(searchText) ||
                (employee.Department || "").toLowerCase().includes(searchText) ||
                (employee.Position || "").toLowerCase().includes(searchText);

            const matchesDepartment =
                departmentFilter === "All" ||
                employee.Department?.trim() === departmentFilter;

            const matchesStatus =
                statusFilter === "All" ||
                employee.Status?.toLowerCase() ===
                    statusFilter.toLowerCase();

            return matchesSearch && matchesDepartment && matchesStatus;
        });
    }, [employees, search, departmentFilter, statusFilter]);

    const updateStatus = async (
        employeeId: string,
        currentStatus: string
    ) => {
        const newStatus =
            currentStatus.toLowerCase() === "active"
                ? "Inactive"
                : "Active";

        const confirmed = window.confirm(
            `Are you sure you want to ${
                newStatus === "Active" ? "activate" : "deactivate"
            } this employee?`
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/employees/${encodeURIComponent(
                    employeeId
                )}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || data.success === false) {
                alert(data.message || "Failed to update employee status.");
                return;
            }

            setEmployees((previousEmployees) =>
                previousEmployees.map((employee) =>
                    employee.Employee_ID === employeeId
                        ? { ...employee, Status: newStatus }
                        : employee
                )
            );

            alert(`Employee ${newStatus.toLowerCase()} successfully!`);
        } catch (error) {
            console.error(error);
            alert("Cannot connect to FastAPI.");
        }
    };

    const resetFilters = () => {
        setSearch("");
        setDepartmentFilter("All");
        setStatusFilter("All");
    };

    const activeCount = employees.filter(
        (employee) => employee.Status?.toLowerCase() === "active"
    ).length;

    const inactiveCount = employees.filter(
        (employee) => employee.Status?.toLowerCase() === "inactive"
    ).length;

    return (
        <div className="container mt-4 mb-5">
            <style>{`
                .employee-table-wrapper {
                    width: 100%;
                    max-width: 100%;
                    overflow-x: hidden;
                }

                .employee-table {
                    width: 100%;
                    min-width: 0;
                    table-layout: fixed;
                    margin-bottom: 0;
                    font-size: 12px;
                }

                .employee-table th,
                .employee-table td {
                    padding: 8px 5px;
                    vertical-align: middle;
                    white-space: normal;
                    overflow-wrap: anywhere;
                    word-break: normal;
                }
                
                

            .employee-table-wrapper {
                width: 100%;
                max-width: 100%;
                max-height: 450px;
                overflow-y: auto;
                overflow-x: hidden;
            }

            .employee-table {
                width: 100%;
                min-width: 0;
                table-layout: fixed;
                margin-bottom: 0;
                font-size: 12px;
            }

            .employee-table thead {
                position: sticky;
                top: 0;
                z-index: 2;
                background: #f8f9fa;
            }

            .employee-table th,
            .employee-table td {
                padding: 8px 5px;
                vertical-align: middle;
                white-space: normal;
                overflow-wrap: anywhere;
            }

            .employee-table th {
                font-size: 11px;
                font-weight: 600;
                background: #f8f9fa;
            }

            .employee-table .employee-actions {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .employee-table .employee-actions .btn {
                width: 100%;
                padding: 5px 3px;
                font-size: 11px;
                white-space: normal;
            }

            @media (max-width: 768px) {
                .employee-table-wrapper {
                    max-height: 400px;
                }

                .employee-table {
                    font-size: 10px;
                }

                .employee-table th,
                .employee-table td {
                    padding: 6px 3px;
                }

                .employee-table th {
                    font-size: 9px;
                }

                .employee-table .employee-actions .btn {
                    font-size: 9px;
                }
            }



                .employee-table th {
                    font-size: 11px;
                    font-weight: 600;
                }

                .employee-table .employee-id {
                    overflow-wrap: normal;
                    word-break: break-word;
                }

                .employee-table .employee-actions {
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    gap: 5px;
                    width: 100%;
                }

                .employee-table .employee-actions .btn {
                    width: 100%;
                    padding: 5px 3px;
                    font-size: 11px;
                    line-height: 1.3;
                    white-space: normal;
                    overflow-wrap: anywhere;
                }

                .employee-table .badge {
                    display: inline-block;
                    max-width: 100%;
                    font-size: 10px;
                    white-space: normal;
                    overflow-wrap: anywhere;
                }

                @media (max-width: 768px) {
                    .employee-table {
                        font-size: 10px;
                    }

                    .employee-table th,
                    .employee-table td {
                        padding: 6px 3px;
                    }

                    .employee-table th {
                        font-size: 9px;
                    }

                    .employee-table .employee-actions .btn {
                        font-size: 9px;
                        padding: 4px 2px;
                    }

                    .employee-table .badge {
                        font-size: 9px;
                    }
                }
            `}</style>

            
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-1">
                        Employee Management
                    </h2>

                    <p className="text-muted mb-0">
                        Manage employee information and status.
                    </p>
                </div>

                <Link
                    to="/hr/employees/add"
                    className="btn btn-primary"
                >
                    + Add Employee
                </Link>
            </div>

            
            <div className="row g-3 mb-4">
                <div className="col-md-4 col-12">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <p className="text-muted mb-1">
                                Total Employees
                            </p>
                            <h3 className="fw-bold mb-0">
                                {employees.length}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 col-12">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <p className="text-muted mb-1">
                                Active Employees
                            </p>
                            <h3 className="fw-bold text-success mb-0">
                                {activeCount}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 col-12">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <p className="text-muted mb-1">
                                Inactive Employees
                            </p>
                            <h3 className="fw-bold text-secondary mb-0">
                                {inactiveCount}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                    <h5 className="fw-bold mb-3">
                        Search and Filter
                    </h5>

                    <div className="row g-3">
                        <div className="col-lg-5 col-md-12">
                            <label className="form-label">
                                Search Employee
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search ID, name, email, department..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="col-lg-3 col-md-6">
                            <label className="form-label">
                                Department
                            </label>

                            <select
                                className="form-select"
                                value={departmentFilter}
                                onChange={(e) =>
                                    setDepartmentFilter(e.target.value)
                                }
                            >
                                <option value="All">
                                    All Departments
                                </option>

                                {departments.map((department) => (
                                    <option
                                        key={department}
                                        value={department}
                                    >
                                        {department}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-lg-2 col-md-6">
                            <label className="form-label">
                                Status
                            </label>

                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                            >
                                <option value="All">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="col-lg-2 col-md-12 d-flex align-items-end">
                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100"
                                onClick={resetFilters}
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            
            <div className="card shadow-sm border-0">
                <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                        <h5 className="fw-bold mb-0">
                            Employee List
                        </h5>

                        <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={fetchEmployees}
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Refresh"}
                        </button>
                    </div>

                    <p className="text-muted small">
                        Showing {filteredEmployees.length} of{" "}
                        {employees.length} employees
                    </p>

                    <div className="employee-table-wrapper">
                        <table className="table table-hover align-middle employee-table">
                            <colgroup>
                                <col style={{ width: "11%" }} />
                                <col style={{ width: "17%" }} />
                                <col style={{ width: "17%" }} />
                                <col style={{ width: "15%" }} />
                                <col style={{ width: "13%" }} />
                                <col style={{ width: "10%" }} />
                                <col style={{ width: "17%" }} />
                            </colgroup>

                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th>Position</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="text-center py-4"
                                        >
                                            Loading employees...
                                        </td>
                                    </tr>
                                ) : filteredEmployees.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="text-center text-muted py-4"
                                        >
                                            No employees found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredEmployees.map((employee) => (
                                        <tr key={employee.Employee_ID}>
                                            <td className="employee-id">
                                                {employee.Employee_ID}
                                            </td>

                                            <td>
                                                {[
                                                    employee.First_Name,
                                                    employee.Middle_Name,
                                                    employee.Last_Name,
                                                ]
                                                    .filter(Boolean)
                                                    .join(" ")}
                                            </td>

                                            <td>
                                                {employee.Email || "-"}
                                            </td>

                                            <td>
                                                {employee.Department || "-"}
                                            </td>

                                            <td>
                                                {employee.Position || "-"}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${
                                                        employee.Status?.toLowerCase() ===
                                                        "active"
                                                            ? "bg-success"
                                                            : "bg-secondary"
                                                    }`}
                                                >
                                                    {employee.Status}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="employee-actions">
                                                    <Link
                                                        to={`/hr/employees/edit/${encodeURIComponent(
                                                            employee.Employee_ID
                                                        )}`}
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        Edit
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm ${
                                                            employee.Status?.toLowerCase() ===
                                                            "active"
                                                                ? "btn-outline-danger"
                                                                : "btn-outline-success"
                                                        }`}
                                                        onClick={() =>
                                                            updateStatus(
                                                                employee.Employee_ID,
                                                                employee.Status
                                                            )
                                                        }
                                                    >
                                                        {employee.Status?.toLowerCase() ===
                                                        "active"
                                                            ? "Deactivate"
                                                            : "Activate"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Employees;

