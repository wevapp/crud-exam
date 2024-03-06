import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React from "react";
import { Route, Routes } from "react-router-dom";
// import components
import Crud from "./components/Crud";
const App = () => {
  return (
    <Routes>
      <Route index element={<Crud />} />
      <Route path="/crud-exam" element={<Crud />} />
    </Routes>
  );
};

export default App;
