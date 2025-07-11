import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="layout">
      <Navigation />
      <Sidebar />
      <main className="main-content">
        <div className="dashboard-container p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
