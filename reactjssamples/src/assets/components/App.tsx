import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./assets/components/Navbar";
import Addnew from "./assets/components/Addnew";
import Home from "./Home";

function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/addnew" element={<Addnew />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;