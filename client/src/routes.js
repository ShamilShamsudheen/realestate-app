import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AdminPanel } from "./Components/AdminPanel";
import { UserPanel } from "./Components/UserPanel";
import PlotDetails from "./Components/PlotDetails";
import SubPlotDetails from "./Components/SubPlotDetails";
import SingleViewPlot from "./Components/SingleViewPlot";

const Routers = () => {
    return (

        <Router>
            <Routes>
                <Route path="/admin" Component={AdminPanel} />
                <Route path="/admin/plot-details/:filename" element={<SubPlotDetails />} />
                <Route path="/admin/plot/:filename/:index" element={<SingleViewPlot />} />
                <Route path="/" Component={UserPanel} />
                <Route path="/plot-details/:filename/:index" element={<PlotDetails />} />
            </Routes>
        </Router>
    )
    // <Route path="/plot/:filename/:index" element={<SingleViewPlot />} />
}
export default Routers;