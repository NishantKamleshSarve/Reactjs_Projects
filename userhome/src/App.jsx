// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RestaurantList from "./User";
import RestaurantDetail from "./RestaurantDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RestaurantList />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
