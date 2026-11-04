import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Attendance from "./pages/Employee/Attendance";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./assets/components/Navbar";
import Home from "./Home";
import AddNew from "./Addnew";


import HRLogin from "./pages/HR/HRLogin";
import HRDashboard from "./pages/HR/HRDashboard";
import Employees from "./pages/Employee/Employees";
import EditEmployee from "./pages/Employee/EditEmployee";


import EmployeeLogin from "./pages/Employee/EmployeeLogin";
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard";

function App() {
return ( <BrowserRouter> <Navbar />


        <Routes>
            
            <Route path="/" element={<Home />} />
            <Route path="/hr-login" element={<HRLogin />} />
            <Route path="/hr" element={<HRDashboard />} />
            <Route path="/hr/employees" element={<Employees />} />
            <Route path="/hr/employees/add" element={<AddNew />} />
            <Route path="/hr/attendance" element={<Attendance />} />
            <Route
                path="/hr/employees/edit/:employee_id"
                element={<EditEmployee />}
            />

          
            <Route
                path="/employee-login"
                element={<EmployeeLogin />}
            />
            <Route
                path="/employee"
                element={<EmployeeDashboard />}
            />
        </Routes>
    </BrowserRouter>
);


}

export default App;
