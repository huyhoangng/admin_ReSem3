import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminHeader.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xử lý logout (có thể xóa token, clear localStorage, ...)
    // Sau đó chuyển về trang login
    navigate('/login');
  };

  return (
    <header className="admin-header">
      <div className="admin-header__logo">
        <span>Admin Finance</span>
      </div>
      <nav className="admin-header__nav">
        <Link to="/" className="admin-header__link">Dashboard</Link>
        <Link to="/account" className="admin-header__link">Account</Link>
        <button className="admin-header__logout" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header; 