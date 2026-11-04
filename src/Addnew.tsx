import { useState } from "react";

function AddNew() {

    const [employee_id, setEmployeeId] = useState("");
    const [first_name, setFirstName] = useState("");
    const [middle_name, setMiddleName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [address, setAddress] = useState("");
    const [department, setDepartment] = useState("");
    const [position, setPosition] = useState("");

    const saveEmployee = async () => {

        if (
            employee_id === "" ||
            first_name === "" ||
            last_name === ""
        ) {
            alert("Please fill in the required fields.");
            return;
        }

        const employee = {
            employee_id: employee_id,
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
                "http://127.0.0.1:8000/employees",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(employee)
                }
            );

            const data = await response.json();

            if (data.success) {

                alert("Employee added successfully!");

                setEmployeeId("");
                setFirstName("");
                setMiddleName("");
                setLastName("");
                setEmail("");
                setContact("");
                setAddress("");
                setDepartment("");
                setPosition("");

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error(error);
            alert("Cannot connect to FastAPI.");

        }
    };

    return (

        <div className="container mt-5">

            <div className="card shadow-sm p-4">

                <h2 className="mb-2">
                    Add New Employee
                </h2>

                <p className="text-muted mb-4">
                    Enter the employee information below.
                </p>


                {/* Employee ID */}

                <div className="mb-3">

                    <label className="form-label">
                        Employee ID *
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        value={employee_id}
                        onChange={(e) =>
                            setEmployeeId(e.target.value)
                        }
                        placeholder="EMP-001"
                    />

                </div>


                {/* Name */}

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
                            placeholder="Juan"
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
                            placeholder="Santos"
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
                            placeholder="Dela Cruz"
                        />

                    </div>

                </div>


                {/* Email + Contact */}

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
                            placeholder="juan@email.com"
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
                            placeholder="09123456789"
                        />

                    </div>

                </div>


                {/* Address */}

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
                        placeholder="Batangas City"
                    />

                </div>


                {/* Department + Position */}

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
                            placeholder="IT Department"
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
                            placeholder="Software Developer"
                        />

                    </div>

                </div>


                {/* Button */}

                <div className="mt-3">

                    <button
                        type="button"
                        className="btn btn-primary px-4"
                        onClick={saveEmployee}
                    >
                        Add Employee
                    </button>

                </div>

            </div>

        </div>

    );
}

export default AddNew;