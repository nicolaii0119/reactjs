import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EmployeeLogin() {

    const [idnum, setIdnum] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const login = async () => {

        if (!idnum.trim() || !password) {
            alert("Please enter your ID Number and Password.");
            return;
        }

        setLoading(true);

        try {

            const formData = new URLSearchParams();

            formData.append("idnum", idnum);
            formData.append("pw", password);

            const response = await fetch(
                "http://127.0.0.1:8000/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: formData
                }
            );

            const data = await response.json();

            if (data.success) {

                if (data.Role === "employee") {

                    localStorage.setItem("employeeLoggedIn", "true");
                    localStorage.setItem("employeeIdNumber", data.IdNumber);
                    localStorage.setItem("employeeRole", data.Role);

                    navigate("/employee");

                } else {

                    alert("This account is not an employee account.");

                }

            } else {

                alert(data.Message || "Invalid ID Number or Password.");

            }

        } catch (error) {

            console.error("Login error:", error);
            alert("Cannot connect to FastAPI. Please check your backend.");

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <div className="card shadow-sm">

                        <div className="card-body p-4">

                            <h2 className="text-center fw-bold mb-2">
                                Employee Login
                            </h2>

                            <p className="text-center text-muted mb-4">
                                Log in to view your attendance records.
                            </p>

                            <div className="mb-3">

                                <label className="form-label">
                                    Employee ID Number
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter your ID Number"
                                    value={idnum}
                                    onChange={(e) => setIdnum(e.target.value)}
                                />

                            </div>

                            <div className="mb-4">

                                <label className="form-label">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter your password"
                                    autoComplete="off"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            login();
                                        }
                                    }}
                                />

                            </div>

                            <button
                                type="button"
                                className="btn btn-primary w-100"
                                onClick={login}
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default EmployeeLogin;