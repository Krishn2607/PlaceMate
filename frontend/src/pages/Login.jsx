import { useState } from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import { Sparkles } from "lucide-react";

import { useAuth } from "../context/AuthContext";


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


        // ======================================
        // FRONTEND VALIDATION
        // ======================================

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

        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-logo">
                    <Sparkles size={22} />
                </div>


                <div className="eyebrow">
                    PLACEMENT OS
                </div>


                <h1>
                    Welcome back.
                </h1>


                <p>
                    Continue building your placement profile.
                </p>


                <form onSubmit={handleSubmit}>


                    {/* EMAIL */}

                    <div className="input-group">

                        <label>
                            Email
                        </label>


                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Enter your email"
                            autoComplete="email"
                            disabled={loading}
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="input-group">

                        <label>
                            Password
                        </label>


                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            disabled={loading}
                        />

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="form-error">
                            {error}
                        </div>

                    )}


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        className="primary-button full-width"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing in..."
                            : "Sign in"}

                    </button>

                </form>


                {/* REGISTER */}

                <div className="auth-footer">

                    Don't have an account?{" "}

                    <Link to="/register">
                        Create one
                    </Link>

                </div>

            </div>

        </div>
    );
}


export default Login;