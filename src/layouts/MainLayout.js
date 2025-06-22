import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminHeader from '../component/common/AdminHeader';
import Footer from '../component/common/Footer';

const MainLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && <AdminHeader />}
      <Outlet />
      {!isLoginPage && <Footer />}
    </>
  );
};

export default MainLayout; 