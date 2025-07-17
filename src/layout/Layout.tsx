import { useEffect, useState } from "react";
import "./Layout.scss";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const [IsOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("loginData");
  const user = JSON.parse(localStorage.getItem("loginData") || "{}");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    } else {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <div className="layout-container">
      <Sidebar open={IsOpen} setOpen={setIsOpen} />
      <div
        className={`layout-body ${`layout-body-${
          IsOpen ? "opened" : "closed"
        }-sidebar`}`}
      >
        <div className="layout-header">
          <div className="header-label">
            <span>Gemini</span>
          </div>
          <span
            title="Logout"
            className="user-icon"
            onClick={() => {
              localStorage.removeItem("loginData");
              navigate("/login");
            }}
          >
            {user?.name?.[0] || "A"}
          </span>
        </div>
        <div className="layout-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
