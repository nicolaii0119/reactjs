function HRDashboard() {

    return (
        <div className="container mt-5">

            <div className="mb-4">
                <h1 className="fw-bold">
                    HR Dashboard
                </h1>

                <p className="text-muted">
                    Welcome to the HR Attendance System
                </p>
            </div>


            <div className="row g-4">

                <div className="col-md-4">

                    <div className="card shadow-sm h-100">
                        <div className="card-body">

                            <h5 className="fw-bold">
                                Employees
                            </h5>

                            <p className="text-muted">
                                Add, edit, activate, or deactivate employees.
                            </p>

                        </div>
                    </div>

                </div>


                <div className="col-md-4">

                    <div className="card shadow-sm h-100">
                        <div className="card-body">

                            <h5 className="fw-bold">
                                Attendance
                            </h5>

                            <p className="text-muted">
                                View employee time in, time out, late, and absent records.
                            </p>

                        </div>
                    </div>

                </div>


                <div className="col-md-4">

                    <div className="card shadow-sm h-100">
                        <div className="card-body">

                            <h5 className="fw-bold">
                                Reports
                            </h5>

                            <p className="text-muted">
                                View and manage attendance reports.
                            </p>

                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default HRDashboard;