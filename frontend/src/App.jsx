import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import Certifications from "./pages/Certifications";
import Coding from "./pages/Coding";
import Resumes from "./pages/Resumes";
import WeeklyPlan from "./pages/WeeklyPlan";
import Progress from "./pages/Progress";

import Login from "./pages/Login";
import Register from "./pages/Register";


function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <Routes>

          {/* Public routes */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* Protected routes */}

          <Route element={<ProtectedRoute />}>

            <Route element={<DashboardLayout />}>

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/profile"
                element={<Profile />}
              />

              <Route
                path="/projects"
                element={<Projects />}
              />

              <Route
                path="/certifications"
                element={<Certifications />}
              />

              <Route
                path="/coding"
                element={<Coding />}
              />

              <Route
                path="/resumes"
                element={<Resumes />}
              />

              <Route
                path="/weekly-plan"
                element={<WeeklyPlan />}
              />

              <Route
                path="/progress"
                element={<Progress />}
              />

            </Route>

          </Route>


          {/* Default */}

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />


          {/* Unknown route */}

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

        </Routes>

      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;