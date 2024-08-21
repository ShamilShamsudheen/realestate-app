import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AdminPanel } from "./Components/AdminPanel";
import { UserPanel } from "./Components/UserPanel";

const Routers = () => {
    return (

        <Router>
            <Routes>
                <Route path="/admin" Component={AdminPanel} />
                <Route path="/user" Component={UserPanel} />
            </Routes>
        </Router>
    )
}
export default Routers;