import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import Home from "./pages/Home";
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
import Settings from "./pages/Settings";
import TargetCompanies from "./pages/TargetCompanies";

import Login from "./pages/Login";
import Register from "./pages/Register";


function App() {

    return (

        <BrowserRouter>

            <AuthProvider>

                <Routes>

                    {/* =========================================
                        PUBLIC ROUTES
                    ========================================= */}

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />


                    {/* =========================================
                        PROTECTED ROUTES
                    ========================================= */}

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
                                path="/target-companies"
                                element={<TargetCompanies />}
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
                                path="/settings"
                                element={<Settings />}
                            />

                        </Route>

                    </Route>


                    {/* =========================================
                        UNKNOWN ROUTES
                    ========================================= */}

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/"
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