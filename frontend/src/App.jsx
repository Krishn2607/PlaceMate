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
import Readiness from "./pages/Readiness";
import AboutPlaceMate from "./pages/AboutPlaceMate";

import Login from "./pages/Login";
import Register from "./pages/Register";


function App() {

    return (

        <BrowserRouter>

            <AuthProvider>

                <Routes>

                    {/* Public Routes */}

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />


                    {/* Protected Routes */}

                    <Route
                        element={<ProtectedRoute />}
                    >

                        <Route
                            element={<DashboardLayout />}
                        >

                            <Route
                                path="/dashboard"
                                element={<Dashboard />}
                            />

                            <Route
                                path="/readiness"
                                element={<Readiness />}
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
                                path="/coding"
                                element={<Coding />}
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

                            <Route
                                path="/about"
                                element={<AboutPlaceMate />}
                            />

                        </Route>

                    </Route>


                    {/* Default Route */}

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />


                    {/* Unknown Routes */}

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