// src/App.js

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// CSS

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import LoginPage from "./page/LoginPage";
import DashboardPage from "./page/DashboardPage";
import AccountPage from "./page/AccountPage";
import MainLayout from "./layouts/MainLayout";


function App() {
  return (
    <Router>
      <Routes>
        {/* === CÁC ROUTE KHÔNG CÓ NAVBAR === */}
        <Route path="/login" element={<LoginPage />} />

        {/* === CÁC ROUTE CÓ NAVBAR (NẰM BÊN TRONG MAINLAYOUT) === */}
        {/* Route cha này không có path, nó chỉ dùng để bọc layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/account" element={<AccountPage />} />
          {/* Ví dụ thêm một trang khác */}
          {/* <Route path="/products" element={<ProductsPage />} /> */}
        </Route>

      </Routes>
    </Router>
  );
}

export default App;