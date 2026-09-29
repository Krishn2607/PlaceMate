import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useAuth } from "../context/AuthContext";

import "./DashboardLayout.css";


function DashboardLayout() {

  const {
    student,
    logout,
  } = useAuth();

  const location = useLocation();

  const navigate = useNavigate();

  const profileMenuRef =
    useRef(null);

  const [
    profileMenuOpen,
    setProfileMenuOpen
  ] = useState(false);


  // ==========================================
  // INITIAL
  // ==========================================

  const getInitial = () => {

    if (!student?.name) {
      return "S";
    }

    return student.name
      .charAt(0)
      .toUpperCase();

  };


  // ==========================================
  // CLOSE PROFILE MENU WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {

    const handleOutsideClick = (
      event
    ) => {

      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(
          event.target
        )
      ) {

        setProfileMenuOpen(
          false
        );

      }

    };


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

    };

  }, []);


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    setProfileMenuOpen(
      false
    );

    logout();

  };


  // ==========================================
  // NAVIGATION
  // ==========================================

  const workspaceLinks = [

    {
      path: "/dashboard",
      label: "Overview",
      icon: "▦",
      exact: true
    },

    {
      path: "/readiness",
      label: "Readiness",
      icon: "◔",
      exact: true
    },

    {
      path: "/skills",
      label: "Skills",
      icon: "♧",
      exact: true
    },

    {
      path: "/coding",
      label: "Coding",
      icon: "</>",
      exact: true
    },

    {
      path: "/projects",
      label: "Projects",
      icon: "⌁",
      exact: true
    },

    {
      path: "/certifications",
      label: "Certifications",
      icon: "✦",
      exact: true
    },

    {
      path: "/resumes",
      label: "Resume",
      icon: "▤",
      exact: true
    },

    {
      path: "/target-companies",
      label: "Target Companies",
      icon: "◎",
      exact: true
    },

    {
      path: "/weekly-plan",
      label: "Weekly Plan",
      icon: "▣",
      exact: true
    },

    {
      path: "/progress",
      label: "Progress",
      icon: "◉",
      exact: true
    },

  ];


  // ==========================================
  // CURRENT PAGE NAME
  // ==========================================

  const getCurrentPageName = () => {

    const currentLink =
      workspaceLinks.find(
        (item) =>
          item.path ===
          location.pathname
      );


    if (currentLink) {
      return currentLink.label;
    }


    if (
      location.pathname ===
      "/profile"
    ) {

      return "Profile";

    }


    if (
      location.pathname ===
      "/settings"
    ) {

      return "Settings";

    }


    return "Overview";

  };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="app-shell">


      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside className="sidebar">


        {/* =================================================
            BRAND
        ================================================== */}

        <div className="brand">

          <div className="brand-mark">
            ✦
          </div>

          <div>

            <div className="brand-name">
              PlaceMate
            </div>

            <div className="brand-subtitle">
              your placement OS
            </div>

          </div>

        </div>


        {/* =================================================
            STUDENT PROFILE CARD
        ================================================== */}

        <div
          className={
            profileMenuOpen
              ? "student-card open"
              : "student-card"
          }
          ref={profileMenuRef}
        >

          <button
            type="button"
            className="student-card-main"
            onClick={() =>
              setProfileMenuOpen(
                previous =>
                  !previous
              )
            }
          >

            <div className="avatar">
              {getInitial()}
            </div>


            <div className="student-info">

              <strong>
                {student?.name ||
                  "Student"}
              </strong>

              <span>
                {student?.profile?.branch ||
                  "Student"}
              </span>

            </div>

          </button>


          <button
            className="icon-button"
            type="button"
            onClick={() =>
              setProfileMenuOpen(
                previous =>
                  !previous
              )
            }
            aria-label="Open profile menu"
          >
            •••
          </button>


          {/* ==========================================
              PROFILE MENU
          =========================================== */}

          {profileMenuOpen && (

            <div className="profile-menu">


              <div className="profile-menu-header">

                <div className="profile-menu-avatar">
                  {getInitial()}
                </div>

                <div>

                  <strong>
                    {student?.name ||
                      "Student"}
                  </strong>

                  <span>
                    {student?.email ||
                      ""}
                  </span>

                </div>

              </div>


              <div className="profile-menu-divider" />


              <button
                type="button"
                className="profile-menu-item"
                onClick={() => {

                  setProfileMenuOpen(
                    false
                  );

                  navigate(
                    "/profile"
                  );

                }}
              >

                <span>
                  ◎
                </span>

                <div>

                  <strong>
                    Profile
                  </strong>

                  <small>
                    Personal and academic information
                  </small>

                </div>

              </button>


              <button
                type="button"
                className="profile-menu-item"
                onClick={() => {

                  setProfileMenuOpen(
                    false
                  );

                  navigate(
                    "/settings"
                  );

                }}
              >

                <span>
                  ⚙
                </span>

                <div>

                  <strong>
                    Account settings
                  </strong>

                  <small>
                    Manage your account
                  </small>

                </div>

              </button>


              <div className="profile-menu-divider" />


              <button
                type="button"
                className="profile-menu-item logout-item"
                onClick={
                  handleLogout
                }
              >

                <span>
                  ↪
                </span>

                <div>

                  <strong>
                    Logout
                  </strong>

                </div>

              </button>

            </div>

          )}

        </div>


        {/* =================================================
            WORKSPACE
        ================================================== */}

        <div className="sidebar-section-title">
          WORKSPACE
        </div>


        <nav className="sidebar-nav">

          {workspaceLinks.map(
            (item) => (

              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({
                  isActive
                }) =>
                  isActive
                    ? "sidebar-link active"
                    : "sidebar-link"
                }
              >

                <span className="sidebar-link-icon">
                  {item.icon}
                </span>

                <span>
                  {item.label}
                </span>


                {/* WEEKLY PLAN INDICATOR */}

                {item.path ===
                  "/weekly-plan" && (

                  <span className="nav-dot" />

                )}

              </NavLink>

            )
          )}

        </nav>


        {/* =================================================
            SIDEBAR BOTTOM
        ================================================== */}

        <div className="sidebar-bottom">


          {/* =================================================
              AI MENTOR
          ================================================== */}

          <button
            type="button"
            className="mentor-card"
            onClick={() =>
              console.log(
                "AI Mentor will be connected later."
              )
            }
          >

            <div className="mentor-icon">
              ✧
            </div>

            <div>

              <strong>
                AI Mentor
              </strong>

              <span>
                AI recommendations
              </span>

            </div>

            <span className="mentor-arrow">
              ↗
            </span>

          </button>


          {/* =================================================
              SETTINGS
          ================================================== */}

          <button
            className="bottom-link"
            type="button"
            onClick={() =>
              navigate(
                "/settings"
              )
            }
          >

            <span>
              ⚙
            </span>

            <span>
              Settings
            </span>

          </button>


          {/* =================================================
              HELP
          ================================================== */}

          <button
            className="bottom-link"
            type="button"
            onClick={() =>
              console.log(
                "Help and resources will be connected later."
              )
            }
          >

            <span>
              ?
            </span>

            <span>
              Help & resources
            </span>

          </button>


          {/* =================================================
              LOGOUT
          ================================================== */}

          <button
            className="bottom-link"
            type="button"
            onClick={
              handleLogout
            }
          >

            <span>
              ↪
            </span>

            <span>
              Logout
            </span>

          </button>


        </div>


      </aside>


      {/* =====================================================
          MAIN SHELL
      ====================================================== */}

      <div className="main-shell">


        {/* =================================================
            TOPBAR
        ================================================== */}

        <header className="topbar">


          {/* BREADCRUMBS */}

          <div className="breadcrumbs">

            <span>
              Workspace
            </span>

            <span className="breadcrumb-arrow">
              ›
            </span>

            <strong>
              {getCurrentPageName()}
            </strong>

          </div>


          {/* TOPBAR ACTIONS */}

          <div className="topbar-actions">


            {/* SEARCH */}

            <div className="search-box">

              <span>
                ⌕
              </span>

              <span>
                Search your placement journey...
              </span>

              <kbd>
                ⌘ K
              </kbd>

            </div>


            {/* NOTIFICATION */}

            <button
              className="notification-button"
              type="button"
              aria-label="Notifications"
            >

              ♧

              <span />

            </button>


            {/* USER AVATAR */}

            <button
              type="button"
              className="top-avatar"
              onClick={() =>
                setProfileMenuOpen(
                  previous =>
                    !previous
                )
              }
              aria-label="Open profile menu"
            >

              {getInitial()}

            </button>


          </div>


        </header>


        {/* =================================================
            PAGE CONTENT
        ================================================== */}

        <main className="page-content">

          <div className="page">

            <Outlet />

          </div>

        </main>


      </div>


    </div>

  );

}


export default DashboardLayout;