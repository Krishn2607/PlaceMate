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
import Skills from "./pages/Skills";
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

          {/* AUTH */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* PROTECTED APPLICATION */}
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
                path="/skills"
                element={<Skills />}
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


          {/* DEFAULT */}
          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

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