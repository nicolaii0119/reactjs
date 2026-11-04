import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditEmployee() {
    const { employee_id } = useParams();
    const navigate = useNavigate();

    const [first_name, setFirstName] = useState("");
    const [middle_name, setMiddleName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [address, setAddress] = useState("");
    const [department, setDepartment] = useState("");
    const [position, setPosition] = useState("");
    const [loading, setLoading] = useState(true);

    const getEmployee = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/employees/${employee_id}`
            );

            const data = await response.json();

            if (data.success === false) {
                alert(data.message);
                navigate("/hr/employees");
                return;
            }

            setFirstName(data.First_Name || "");
            setMiddleName(data.Middle_Name || "");
            setLastName(data.Last_Name || "");
            setEmail(data.Email || "");
            setContact(data.Contact || "");
            setAddress(data.Address || "");
            setDepartment(data.Department || "");
            setPosition(data.Position || "");
        } catch (error) {
            console.log("Error:", error);
            alert("Cannot connect to FastAPI.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getEmployee();
    }, [employee_id]);

    const updateEmployee = async () => {
        if (first_name === "" || last_name === "") {
            alert("Please fill in the required fields.");
            return;
        }

        const employee = {
            first_name: first_name,
            middle_name: middle_name,
            last_name: last_name,
            email: email,
            contact: contact,
            address: address,
            department: department,
            position: position
        };

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/employees/${employee_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(employee)
                }
            );

            const data = await response.json();

            if (data.success) {
                alert("Employee updated successfully!");
                navigate("/hr/employees");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
            alert("Cannot connect to FastAPI.");
        }
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <p className="text-muted">
                    Loading employee information...
                </p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="card shadow-sm p-4">
                <h2 className="mb-2">
                    Edit Employee
                </h2>
                <p className="text-muted mb-4">
                    Update the employee information below.
                </p>

                <div className="mb-3">
                    <label className="form-label">
                        Employee ID
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={employee_id}
                        disabled
                    />
                </div>

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">
                            First Name *
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={first_name}
                            onChange={(e) =>
                                setFirstName(e.target.value)
                            }
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label className="form-label">
                            Middle Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={middle_name}
                            onChange={(e) =>
                                setMiddleName(e.target.value)
                            }
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label className="form-label">
                            Last Name *
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={last_name}
                            onChange={(e) =>
                                setLastName(e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">
                            Contact Number
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={contact}
                            onChange={(e) =>
                                setContact(e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Address
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={address}
                        onChange={(e) =>
                            setAddress(e.target.value)
                        }
                    />
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">
                            Department
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={department}
                            onChange={(e) =>
                                setDepartment(e.target.value)
                            }
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">
                            Position
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={position}
                            onChange={(e) =>
                                setPosition(e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="mt-3">
                    <button
                        type="button"
                        className="btn btn-primary me-2"
                        onClick={updateEmployee}
                    >
                        Save Changes
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() =>
                            navigate("/hr/employees")
                        }
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditEmployee;