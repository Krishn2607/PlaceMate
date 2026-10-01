import { useState } from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import { Sparkles } from "lucide-react";

import { useAuth } from "../context/AuthContext";

import "./Login.css";


function Login() {

    const { login } = useAuth();

    const navigate = useNavigate();


    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    // ==========================================
    // HANDLE EMAIL CHANGE
    // ==========================================

    const handleEmailChange = (event) => {

        setEmail(
            event.target.value
        );

        setError("");
    };


    // ==========================================
    // HANDLE PASSWORD CHANGE
    // ==========================================

    const handlePasswordChange = (event) => {

        setPassword(
            event.target.value
        );

        setError("");
    };


    // ==========================================
    // VALIDATE LOGIN FORM
    // ==========================================

    const validateForm = () => {

        const trimmedEmail =
            email.trim();


        if (!trimmedEmail) {
            return "Please enter your email.";
        }


        if (!password) {
            return "Please enter your password.";
        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(trimmedEmail)) {
            return "Please enter a valid email address.";
        }


        return "";
    };


    // ==========================================
    // HANDLE LOGIN
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        const validationError =
            validateForm();


        if (validationError) {

            setError(
                validationError
            );

            return;
        }


        try {

            setLoading(true);


            await login(
                email.trim(),
                password
            );


            navigate("/dashboard");

        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to complete login. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="login-page">

            {/* ==========================================
                BACKGROUND
            ========================================== */}

            <div className="login-background-glow" />

            <div className="login-background-grid" />


            {/* ==========================================
                NAVIGATION
            ========================================== */}

            <header className="login-header">

                <Link
                    to="/"
                    className="login-brand"
                >

                    <div className="login-brand-mark">
                        ✦
                    </div>

                    <div>
                        <strong>
                            PlaceMate
                        </strong>

                        <span>
                            PLACEMENT OS
                        </span>
                    </div>

                </Link>


                <Link
                    to="/register"
                    className="login-register-link"
                >
                    Create account
                    <span>→</span>
                </Link>

            </header>


            {/* ==========================================
                MAIN
            ========================================== */}

            <main className="login-main">

                {/* ======================================
                    LEFT CONTENT
                ====================================== */}

                <section className="login-story">

                    <div className="login-eyebrow">
                        <span className="login-eyebrow-dot" />

                        YOUR PREPARATION.
                        YOUR PROGRESS.
                    </div>


                    <h1>
                        Welcome back.
                        <br />

                        <span>
                            Keep building.
                        </span>
                    </h1>


                    <p className="login-story-description">
                        Continue building your placement profile,
                        tracking your preparation and turning
                        consistent work into interview confidence.
                    </p>


                    <div className="login-story-points">

                        <div>
                            <span>
                                01
                            </span>

                            <div>
                                <strong>
                                    Track your preparation
                                </strong>

                                <p>
                                    Keep coding, projects, skills,
                                    resumes and certifications together.
                                </p>
                            </div>
                        </div>


                        <div>
                            <span>
                                02
                            </span>

                            <div>
                                <strong>
                                    Understand your progress
                                </strong>

                                <p>
                                    See the signals that matter for
                                    your placement preparation.
                                </p>
                            </div>
                        </div>


                        <div>
                            <span>
                                03
                            </span>

                            <div>
                                <strong>
                                    Know what comes next
                                </strong>

                                <p>
                                    Use plans and progress insights
                                    to keep moving consistently.
                                </p>
                            </div>
                        </div>

                    </div>

                </section>


                {/* ======================================
                    LOGIN CARD
                ====================================== */}

                <section className="login-card">

                    <div className="login-card-top">

                        <div className="login-icon">
                            <Sparkles size={20} />
                        </div>


                        <div className="login-card-label">
                            PLACE MATE
                        </div>

                    </div>


                    <div className="login-card-heading">

                        <h2>
                            Sign in
                        </h2>

                        <p>
                            Continue where you left off.
                        </p>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="login-form"
                    >

                        {/* EMAIL */}

                        <div className="login-input-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={
                                    handleEmailChange
                                }
                                placeholder="Enter your email"
                                autoComplete="email"
                                disabled={loading}
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="login-input-group">

                            <div className="login-label-row">

                                <label>
                                    Password
                                </label>

                            </div>


                            <input
                                type="password"
                                value={password}
                                onChange={
                                    handlePasswordChange
                                }
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                disabled={loading}
                            />

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="login-error">

                                <span>
                                    !
                                </span>

                                <p>
                                    {error}
                                </p>

                            </div>

                        )}


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="login-submit"
                            disabled={loading}
                        >

                            <span>
                                {loading
                                    ? "Signing in..."
                                    : "Sign in to PlaceMate"}
                            </span>

                            {!loading && (
                                <span className="login-submit-arrow">
                                    →
                                </span>
                            )}

                        </button>

                    </form>


                    {/* FOOTER */}

                    <div className="login-card-footer">

                        <span>
                            Don't have an account?
                        </span>

                        <Link to="/register">
                            Create one
                        </Link>

                    </div>

                </section>

            </main>


            {/* ==========================================
                BOTTOM
            ========================================== */}

            <footer className="login-footer">

                <span>
                    © PlaceMate
                </span>

                <span className="login-footer-divider">
                    /
                </span>

                <span>
                    Placement preparation workspace
                </span>

            </footer>

        </div>
    );
}


export default Login;