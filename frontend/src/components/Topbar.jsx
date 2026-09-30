import {
  BarChart3,
  Brain,
  BriefcaseBusiness,
  Code2,
  FileText,
  Gauge,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Settings,
  Target,
  UserRound,
  FolderKanban,
  CalendarDays,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { student } = useAuth();

  const mainNavigation = [
    {
      label: "Overview",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Readiness",
      path: "/readiness",
      icon: Gauge,
    },
    {
      label: "Skills",
      path: "/skills",
      icon: Brain,
    },
    {
      label: "Coding",
      path: "/coding",
      icon: Code2,
    },
    {
      label: "Projects",
      path: "/projects",
      icon: FolderKanban,
    },
    {
      label: "Resume",
      path: "/resumes",
      icon: FileText,
    },
    {
      label: "Target Companies",
      path: "/target-companies",
      icon: Target,
    },
    {
      label: "Weekly Plan",
      path: "/weekly-plan",
      icon: CalendarDays,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          ✦
        </div>

        <div>
          <div className="brand-name">PlaceMate</div>
          <div className="brand-subtitle">
            your placement OS
          </div>
        </div>
      </div>

      <div className="student-card">
        <div className="avatar">
          {student?.name?.charAt(0)?.toUpperCase() || "S"}
        </div>

        <div className="student-info">
          <strong>{student?.name || "Student"}</strong>

          <span>
            {student?.semester
              ? `Semester ${student.semester}`
              : "Student"}
          </span>
        </div>

        <button className="icon-button">
          •••
        </button>
      </div>

      <div className="sidebar-section-title">
        WORKSPACE
      </div>

      <nav className="sidebar-nav">
        {mainNavigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} strokeWidth={1.8} />

              <span>{item.label}</span>

              {item.label === "Weekly Plan" && (
                <span className="nav-dot" />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <NavLink
          to="/ai-mentor"
          className="mentor-card"
        >
          <div className="mentor-icon">
            <Brain size={19} />
          </div>

          <div>
            <strong>AI Mentor</strong>
            <span>
              Recommendations for you
            </span>
          </div>

          <span className="mentor-arrow">↗</span>
        </NavLink>

        <NavLink
          to="/profile"
          className="bottom-link"
        >
          <UserRound size={18} />
          <span>Profile</span>
        </NavLink>

        <button className="bottom-link">
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <button className="bottom-link">
          <HelpCircle size={18} />
          <span>Help & resources</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;