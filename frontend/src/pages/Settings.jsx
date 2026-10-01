import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { changePassword } from "../services/profileService";

import "./Settings.css";


function Settings() {

    const navigate = useNavigate();


    const [
        showCurrentPassword,
        setShowCurrentPassword
    ] = useState(false);


    const [
        showNewPassword,
        setShowNewPassword
    ] = useState(false);


    const [
        showConfirmPassword,
        setShowConfirmPassword
    ] = useState(false);


    const [
        form,
        setForm
    ] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });


    const [
        message,
        setMessage
    ] = useState("");


    const [
        messageType,
        setMessageType
    ] = useState("");


    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setForm(previous => ({
            ...previous,
            [name]: value
        }));


        setMessage("");
        setMessageType("");
    };


    const handlePasswordSubmit = async (event) => {

        event.preventDefault();


        setMessage("");
        setMessageType("");


        // ==========================================
        // CURRENT PASSWORD VALIDATION
        // ==========================================

        if (!form.currentPassword) {

            setMessage(
                "Please enter your current password."
            );

            setMessageType("error");

            return;
        }


        // ==========================================
        // NEW PASSWORD VALIDATION
        // ==========================================

        if (!form.newPassword) {

            setMessage(
                "Please enter a new password."
            );

            setMessageType("error");

            return;
        }


        if (form.newPassword.length < 6) {

            setMessage(
                "New password must be at least 6 characters."
            );

            setMessageType("error");

            return;
        }


        // ==========================================
        // CONFIRM PASSWORD VALIDATION
        // ==========================================

        if (!form.confirmPassword) {

            setMessage(
                "Please confirm your new password."
            );

            setMessageType("error");

            return;
        }


        if (
            form.newPassword !==
            form.confirmPassword
        ) {

            setMessage(
                "New password and confirmation do not match."
            );

            setMessageType("error");

            return;
        }


        // ==========================================
        // SAME PASSWORD VALIDATION
        // ==========================================

        if (
            form.currentPassword ===
            form.newPassword
        ) {

            setMessage(
                "New password must be different from your current password."
            );

            setMessageType("error");

            return;
        }


        // ==========================================
        // CHANGE PASSWORD
        // ==========================================

        try {

            const response = await changePassword(
                form.currentPassword,
                form.newPassword
            );


            setMessage(
                response.message ||
                "Password changed successfully."
            );

            setMessageType("success");


            // Clear password fields after success
            setForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });


        } catch (error) {

            console.error(
                "Change password error:",
                error
            );


            setMessage(
                error.response?.data?.message ||
                "Failed to change password. Please try again."
            );

            setMessageType("error");
        }

    };


    return (

        <div className="settings-page">

            {/* ==========================================
                HEADER
            =========================================== */}

            <section className="settings-header">

                <div>

                    <div className="settings-eyebrow">
                        ACCOUNT SETTINGS
                    </div>

                    <h1>
                        Settings
                    </h1>

                    <p>
                        Manage your account and security.
                    </p>

                </div>

            </section>


            {/* ==========================================
                SETTINGS GRID
            =========================================== */}

            <div className="settings-layout">


                {/* ======================================
                    PROFILE
                ======================================= */}

                <section className="settings-card">

                    <div className="settings-card-icon">
                        ◎
                    </div>

                    <div className="settings-card-content">

                        <div>

                            <h2>
                                Profile
                            </h2>

                            <p>
                                Manage your personal and
                                academic information.
                            </p>

                        </div>


                        <button
                            type="button"
                            className="settings-secondary-button"
                            onClick={() =>
                                navigate("/profile")
                            }
                        >
                            Open Profile

                            <span>
                                →
                            </span>

                        </button>

                    </div>

                </section>


                {/* ======================================
                    SECURITY
                ======================================= */}

                <section className="settings-card security-card">

                    <div className="settings-card-icon">
                        🔒
                    </div>

                    <div className="settings-card-content">

                        <div>

                            <h2>
                                Security
                            </h2>

                            <p>
                                Change your password and
                                keep your account secure.
                            </p>

                        </div>

                    </div>

                </section>


                {/* ======================================
                    CHANGE PASSWORD
                ======================================= */}

                <section className="password-card">

                    <div className="password-card-header">

                        <div>

                            <div className="settings-section-label">
                                PASSWORD
                            </div>

                            <h2>
                                Change your password
                            </h2>

                            <p>
                                Choose a new password for
                                your PlaceMate account.
                            </p>

                        </div>

                    </div>


                    <form
                        className="password-form"
                        onSubmit={handlePasswordSubmit}
                    >


                        {/* CURRENT PASSWORD */}

                        <div className="password-field">

                            <label htmlFor="currentPassword">
                                Current password
                            </label>

                            <div className="password-input-wrapper">

                                <input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type={
                                        showCurrentPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        form.currentPassword
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter current password"
                                    autoComplete="current-password"
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowCurrentPassword(
                                            previous =>
                                                !previous
                                        )
                                    }
                                >
                                    {
                                        showCurrentPassword
                                            ? "Hide"
                                            : "Show"
                                    }
                                </button>

                            </div>

                        </div>


                        {/* NEW PASSWORD */}

                        <div className="password-field">

                            <label htmlFor="newPassword">
                                New password
                            </label>

                            <div className="password-input-wrapper">

                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={
                                        showNewPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        form.newPassword
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter new password"
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowNewPassword(
                                            previous =>
                                                !previous
                                        )
                                    }
                                >
                                    {
                                        showNewPassword
                                            ? "Hide"
                                            : "Show"
                                    }
                                </button>

                            </div>

                            <small>
                                Use at least 6 characters.
                            </small>

                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div className="password-field">

                            <label htmlFor="confirmPassword">
                                Confirm new password
                            </label>

                            <div className="password-input-wrapper">

                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        form.confirmPassword
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Confirm new password"
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            previous =>
                                                !previous
                                        )
                                    }
                                >
                                    {
                                        showConfirmPassword
                                            ? "Hide"
                                            : "Show"
                                    }
                                </button>

                            </div>

                        </div>


                        {/* MESSAGE */}

                        {message && (

                            <div
                                className={
                                    `settings-message ${messageType}`
                                }
                            >
                                {message}
                            </div>

                        )}


                        {/* ACTION */}

                        <div className="password-form-actions">

                            <button
                                type="submit"
                                className="settings-primary-button"
                            >
                                Change Password
                            </button>

                        </div>


                    </form>

                </section>


            </div>

        </div>

    );

}


export default Settings;