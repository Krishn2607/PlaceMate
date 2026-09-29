import {
  Link,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function DashboardLayout() {

  const {
    student,
    logout,
  } = useAuth();

  return (
    <div className="app-layout">

      <header className="topbar">

        <h2>
          PlaceMate
        </h2>


        <div className="user-section">

          <span>
            {student?.name || "Student"}
          </span>

          <button onClick={logout}>
            Logout
          </button>

        </div>

      </header>


      <div className="main-layout">

        <aside className="sidebar">

          <nav>

            <Link to="/dashboard">
              Dashboard
            </Link>

            <Link to="/profile">
              Profile
            </Link>

            <Link to="/projects">
              Projects
            </Link>

            <Link to="/certifications">
              Certifications
            </Link>

            <Link to="/coding">
              Coding
            </Link>

            <Link to="/resumes">
              Resumes
            </Link>

            <Link to="/weekly-plan">
              Weekly Plan
            </Link>

            <Link to="/progress">
              Progress
            </Link>

          </nav>

        </aside>


        <main className="content">

          <Outlet />

        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;