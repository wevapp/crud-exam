import React from "react";
import { Route, Routes } from "react-router-dom";
// import components
// import Create from "./components/Create";
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
