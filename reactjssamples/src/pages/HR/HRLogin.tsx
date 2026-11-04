import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HRLogin() {

    const [idnum, setIdnum] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const login = async () => {

        const formData = new URLSearchParams();

        formData.append("idnum", idnum);
        formData.append("pw", password);

        const response = await fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData
        });

        const data = await response.json();

        if (data.success) {

            if (data.Role === "admin" || data.Role === "hr") {

                localStorage.setItem("hrLoggedIn", "true");
                localStorage.setItem("role", data.Role);
                localStorage.setItem("idNumber", data.IdNumber);

                navigate("/hr");

            } else {

                alert("This account is not an HR account.");

            }

        } else {

            alert(data.Message);

        }
    };

    return (
        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <div className="card shadow">

                        <div className="card-body p-4">

                            <h2 className="text-center mb-4">
                                HR Login
                            </h2>

                            <div className="mb-3">

                                <label className="form-label">
                                    ID Number
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={idnum}
                                    onChange={(e) => setIdnum(e.target.value)}
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    className="form-control"
                                    autoComplete="off"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                            </div>

                            <button
                                className="btn btn-primary w-100"
                                onClick={login}
                            >
                                Login
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default HRLogin;