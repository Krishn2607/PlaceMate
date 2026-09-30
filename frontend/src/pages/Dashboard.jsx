import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getDashboardData } from "../services/dashboardService";
import { getProfile } from "../services/profileService";

import "./Dashboard.css";


const PLATFORM_INITIALS = {
    LeetCode: "LC",
    Codeforces: "CF",
    CodeChef: "CC",
    HackerRank: "HR"
};


function Dashboard() {

    const { student } = useAuth();

    const [dashboard, setDashboard] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // LOAD DASHBOARD
    // ==========================================

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);
                setError("");

                const [
                    dashboardData,
                    studentProfile
                ] = await Promise.all([
                    getDashboardData(),
                    getProfile()
                ]);

                setDashboard(dashboardData);
                setProfile(studentProfile);

            } catch (error) {

                console.error(
                    "Dashboard loading error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard"
                );

            } finally {

                setLoading(false);

            }

        };

        loadDashboard();

    }, []);


    // ==========================================
    // GREETING
    // ==========================================

    const greeting = useMemo(() => {

        const hour = new Date().getHours();

        if (hour < 12) {
            return "Good morning";
        }

        if (hour < 17) {
            return "Good afternoon";
        }

        return "Good evening";

    }, []);


    // ==========================================
    // ACTIVE RESUME
    // ==========================================

    const activeResume = useMemo(() => {

        if (!dashboard?.resumes?.length) {
            return null;
        }

        return (
            dashboard.resumes.find(
                resume => resume.isActive
            ) ||
            dashboard.resumes[0]
        );

    }, [dashboard]);


    // ==========================================
    // ATS SCORE
    // ==========================================

    const atsScore = useMemo(() => {

        const score =
            activeResume?.atsScore ??
            dashboard?.progress?.atsScore ??
            0;

        return Math.min(
            100,
            Math.max(
                0,
                Number(score) || 0
            )
        );

    }, [activeResume, dashboard]);


    // ==========================================
    // READINESS SCORE
    // ==========================================

    const readinessScore = useMemo(() => {

        /*
         * CGPA
         *
         * CGPA is entered on a 10-point scale.
         */

        const cgpa = Math.min(
            100,
            Math.max(
                0,
                (
                    (Number(
                        profile?.profile?.cgpa
                    ) || 0) / 10
                ) * 100
            )
        );


        /*
         * Resume ATS
         */

        const ats = atsScore;


        /*
         * Projects
         *
         * 3 projects = 100%
         */

        const projects = Math.min(
            100,
            (
                (dashboard?.projects?.length || 0) / 3
            ) * 100
        );


        /*
         * Certifications
         *
         * 2 certifications = 100%
         */

        const certifications = Math.min(
            100,
            (
                (dashboard?.certifications?.length || 0) / 2
            ) * 100
        );


        /*
         * Coding
         *
         * 100 tracked solved problems = 100%
         */

        const coding = Math.min(
            100,
            (
                (dashboard?.codingProblems?.length || 0) / 100
            ) * 100
        );


        /*
         * Skills
         *
         * Average self level is out of 5.
         */

        const skills =
            profile?.skills?.length
                ? Math.min(
                    100,
                    Math.max(
                        0,
                        (
                            profile.skills.reduce(
                                (total, skill) =>
                                    total +
                                    Number(
                                        skill.selfLevel || 0
                                    ),
                                0
                            ) /
                            profile.skills.length
                        ) / 5 * 100
                    )
                )
                : 0;


        /*
         * Final readiness formula
         *
         * CGPA          20%
         * Resume ATS    20%
         * Projects      20%
         * Coding        20%
         * Skills        10%
         * Certifications 10%
         */

        return Math.round(
            cgpa * 0.20 +
            ats * 0.20 +
            projects * 0.20 +
            coding * 0.20 +
            skills * 0.10 +
            certifications * 0.10
        );

    }, [
        profile,
        dashboard,
        atsScore
    ]);


    // ==========================================
    // READINESS MESSAGE
    // ==========================================

    const readinessMessage = useMemo(() => {

        if (readinessScore >= 80) {

            return (
                "Your preparation has a strong foundation."
            );

        }

        if (readinessScore >= 60) {

            return (
                "You are building a solid placement foundation."
            );

        }

        if (readinessScore >= 40) {

            return (
                "You are making progress, with a few areas needing attention."
            );

        }

        return (
            "Your preparation is getting started. Keep building your evidence."
        );

    }, [readinessScore]);


    // ==========================================
    // WEEKLY PLAN
    // ==========================================

    const completedTasks = useMemo(() => {

        if (!dashboard?.weeklyPlan?.tasks) {
            return 0;
        }

        return dashboard.weeklyPlan.tasks.filter(
            task => task.completed
        ).length;

    }, [dashboard]);


    const totalTasks =
        dashboard?.weeklyPlan?.tasks?.length || 0;


    // ==========================================
    // CODING
    // ==========================================

    const codingSolved =
        dashboard?.codingProblems?.length || 0;


    const totalPlatformSolved = useMemo(() => {

        if (!dashboard?.codingProfiles?.length) {
            return 0;
        }

        return dashboard.codingProfiles.reduce(
            (total, profile) =>
                total +
                Number(
                    profile.problemsSolved || 0
                ),
            0
        );

    }, [dashboard]);


    // ==========================================
    // RECENT PROBLEMS
    // ==========================================

    const recentProblems = useMemo(() => {

        if (!dashboard?.codingProblems?.length) {
            return [];
        }

        return [...dashboard.codingProblems]
            .sort(
                (a, b) =>
                    new Date(b.solvedDate) -
                    new Date(a.solvedDate)
            )
            .slice(0, 5);

    }, [dashboard]);


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        return new Date(date).toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric"
            }
        );

    };


    // ==========================================
    // PLATFORM INITIALS
    // ==========================================

    const getPlatformInitials = (platform) => {

        return (
            PLATFORM_INITIALS[platform] ||
            platform?.slice(0, 2).toUpperCase() ||
            "CP"
        );

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="dashboard-loading">

                <div className="loading-spinner" />

                <p>
                    Loading your placement dashboard...
                </p>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (

            <div className="dashboard-error">

                <h2>
                    Something went wrong
                </h2>

                <p>
                    {error}
                </p>

            </div>

        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="dashboard-page">


            {/* ======================================
                HEADER
            ======================================= */}

            <section className="dashboard-intro">

                <div>

                    <div className="eyebrow">

                        <span className="status-dot" />

                        PLACEMENT WORKSPACE

                    </div>


                    <h1>

                        {greeting},{" "}

                        <span>
                            {student?.name || "Student"}.
                        </span>

                    </h1>


                    <p>
                        Your placement journey is moving
                        forward. Here's what deserves your
                        attention today.
                    </p>

                </div>


                <Link
                    to="/weekly-plan"
                    className="primary-button"
                >

                    <span>
                        ▶
                    </span>

                    Start today's plan

                </Link>

            </section>


            {/* ======================================
                PREPARATION SNAPSHOT
            ======================================= */}

            <section className="snapshot-card">

                <div className="snapshot-heading">

                    <span>
                        PREPARATION SNAPSHOT
                    </span>

                    <small>
                        Based on your current profile
                    </small>

                </div>


                <div className="snapshot-content">


                    <div className="snapshot-score">

                        <div
                            className="score-ring"
                            style={{
                                background:
                                    `conic-gradient(
                                        #e89443 0deg,
                                        #e89443 ${readinessScore * 3.6}deg,
                                        #292b2e ${readinessScore * 3.6}deg,
                                        #292b2e 360deg
                                    )`
                            }}
                        >

                            <div className="score-ring-inner">

                                <strong>
                                    {readinessScore}
                                </strong>

                                <span>
                                    /100
                                </span>

                            </div>

                        </div>

                    </div>


                    <div className="snapshot-info">

                        <h2>
                            {readinessMessage}
                        </h2>

                        <p>
                            Your readiness score combines
                            your CGPA, resume ATS, projects,
                            coding activity, skills and
                            certifications.
                        </p>


                        <div className="snapshot-meta">

                            <span>
                                {profile?.skills?.length || 0}
                                {" "}
                                skills tracked
                            </span>

                            <span>
                                •
                            </span>

                            <span>
                                Resume ATS: {atsScore}/100
                            </span>

                        </div>

                    </div>


                    <Link
                        to="/readiness"
                        className="secondary-button"
                    >
                        View readiness ↗
                    </Link>

                </div>

            </section>


            {/* ======================================
                STAT CARDS
            ======================================= */}

            <section className="stats-grid">


                <StatCard
                    icon="▣"
                    label="Resume ATS"
                    value={atsScore}
                    suffix="/100"
                    accent="orange"
                    footer={
                        activeResume
                            ? activeResume.isActive
                                ? "Active resume"
                                : "Latest resume"
                            : "No resume uploaded"
                    }
                />


                <StatCard
                    icon="</>"
                    label="Problems solved"
                    value={codingSolved}
                    accent="orange"
                    footer={
                        totalPlatformSolved === codingSolved
                            ? "Across coding profiles"
                            : `${totalPlatformSolved} in platform profiles`
                    }
                />


                <StatCard
                    icon="✦"
                    label="Projects"
                    value={
                        dashboard?.projects?.length || 0
                    }
                    accent="green"
                    footer="Projects in your portfolio"
                />


                <StatCard
                    icon="◇"
                    label="Certifications"
                    value={
                        dashboard?.certifications?.length || 0
                    }
                    accent="orange"
                    footer="Certifications tracked"
                />

            </section>


            {/* ======================================
                PREPARATION PULSE
            ======================================= */}

            <section className="section-block">


                <div className="section-heading">

                    <div>

                        <div className="eyebrow">
                            THIS WEEK
                        </div>

                        <h2>
                            Your preparation pulse
                        </h2>

                    </div>


                    <Link to="/weekly-plan">
                        Open weekly plan →
                    </Link>

                </div>


                <div className="pulse-grid">


                    {/* WEEKLY PLAN */}

                    <div className="panel weekly-panel">

                        {!dashboard?.weeklyPlan ? (

                            <div className="empty-state">

                                <div className="empty-icon">
                                    ✦
                                </div>

                                <h3>
                                    No weekly plan yet
                                </h3>

                                <p>
                                    Generate your first
                                    AI-powered weekly
                                    preparation plan.
                                </p>

                                <Link
                                    to="/weekly-plan"
                                    className="primary-button"
                                >
                                    Open weekly plan
                                </Link>

                            </div>

                        ) : (

                            <>

                                <div className="panel-top">

                                    <div>

                                        <h3>
                                            Weekly plan
                                        </h3>

                                        <p>

                                            {formatDate(
                                                dashboard.weeklyPlan
                                                    .weekStartDate
                                            )}

                                            {" – "}

                                            {formatDate(
                                                dashboard.weeklyPlan
                                                    .weekEndDate
                                            )}

                                            {" • "}

                                            {completedTasks}

                                            {" of "}

                                            {totalTasks}

                                            {" complete"}

                                        </p>

                                    </div>


                                    <span className="percentage-badge">

                                        {dashboard.weeklyPlan.progress || 0}%

                                    </span>

                                </div>


                                <div className="progress-track">

                                    <div
                                        className="progress-fill"
                                        style={{
                                            width:
                                                `${Math.min(
                                                    100,
                                                    Math.max(
                                                        0,
                                                        dashboard.weeklyPlan
                                                            .progress || 0
                                                    )
                                                )}%`
                                        }}
                                    />

                                </div>


                                <div className="task-list">

                                    {dashboard.weeklyPlan.tasks
                                        ?.slice(0, 5)
                                        .map(
                                            (task, index) => (

                                                <div
                                                    className="task-row"
                                                    key={
                                                        task._id ||
                                                        index
                                                    }
                                                >

                                                    <div
                                                        className={
                                                            `task-check ${
                                                                task.completed
                                                                    ? "completed"
                                                                    : ""
                                                            }`
                                                        }
                                                    >

                                                        {task.completed
                                                            ? "✓"
                                                            : "○"}

                                                    </div>


                                                    <span
                                                        className={
                                                            task.completed
                                                                ? "task-completed"
                                                                : ""
                                                        }
                                                    >
                                                        {task.title}
                                                    </span>


                                                    <span className="task-arrow">
                                                        →
                                                    </span>

                                                </div>

                                            )
                                        )}

                                </div>

                            </>

                        )}

                    </div>


                    {/* PROFILE */}

                    <div className="panel profile-panel">

                        <div className="panel-icon">
                            ◈
                        </div>


                        <div className="eyebrow">
                            CURRENT PROFILE
                        </div>


                        <h3>
                            Keep building your evidence.
                        </h3>


                        <p>
                            PlaceMate is tracking the
                            evidence you're building for
                            your placement preparation.
                        </p>


                        <div className="profile-metrics">


                            <div>

                                <strong>
                                    {dashboard?.projects?.length || 0}
                                </strong>

                                <span>
                                    Projects
                                </span>

                            </div>


                            <div>

                                <strong>
                                    {dashboard?.certifications?.length || 0}
                                </strong>

                                <span>
                                    Certifications
                                </span>

                            </div>


                            <div>

                                <strong>
                                    {profile?.skills?.length || 0}
                                </strong>

                                <span>
                                    Skills
                                </span>

                            </div>


                        </div>


                        <Link
                            to="/profile"
                            className="secondary-button full-width"
                        >
                            View profile
                        </Link>

                    </div>

                </div>

            </section>


            {/* ======================================
                CODING PROFILES
            ======================================= */}

            <section className="section-block">


                <div className="section-heading">

                    <div>

                        <div className="eyebrow">
                            CODING
                        </div>

                        <h2>
                            Your coding activity
                        </h2>

                    </div>


                    <Link to="/coding">
                        Open coding →
                    </Link>

                </div>


                <div className="coding-grid">

                    {dashboard?.codingProfiles?.length ? (

                        dashboard.codingProfiles.map(
                            profile => (

                                <div
                                    className="coding-card"
                                    key={profile._id}
                                >

                                    <div className="coding-card-top">

                                        <div className="platform-icon">

                                            {getPlatformInitials(
                                                profile.platform
                                            )}

                                        </div>

                                        <span>
                                            {profile.platform}
                                        </span>

                                    </div>


                                    <strong>
                                        {profile.problemsSolved || 0}
                                    </strong>


                                    <p>
                                        problems solved
                                    </p>


                                    <div className="coding-rating">

                                        Rating

                                        <strong>
                                            {profile.rating || 0}
                                        </strong>

                                    </div>

                                </div>

                            )
                        )

                    ) : (

                        <div className="panel empty-coding">

                            <h3>
                                No coding profiles yet
                            </h3>

                            <p>
                                Add your coding platforms
                                to start tracking your
                                progress.
                            </p>

                            <Link
                                to="/coding"
                                className="primary-button"
                            >
                                Add coding profile
                            </Link>

                        </div>

                    )}

                </div>

            </section>


            {/* ======================================
                RECENT SOLVES
            ======================================= */}

            <section className="section-block">


                <div className="section-heading">

                    <div>

                        <div className="eyebrow">
                            RECENT ACTIVITY
                        </div>

                        <h2>
                            Recent solves
                        </h2>

                    </div>


                    <Link to="/coding">
                        View all →
                    </Link>

                </div>


                <div className="panel recent-solves-panel">

                    {recentProblems.length === 0 ? (

                        <div className="recent-empty">

                            <div className="empty-icon">
                                ✦
                            </div>

                            <h3>
                                No solved problems yet
                            </h3>

                            <p>
                                Start logging solved coding
                                problems to build your
                                activity history.
                            </p>

                            <Link
                                to="/coding"
                                className="primary-button"
                            >
                                Add problem
                            </Link>

                        </div>

                    ) : (

                        <div className="recent-solves-list">

                            {recentProblems.map(
                                problem => (

                                    <div
                                        className="recent-solve-row"
                                        key={problem._id}
                                    >

                                        <div className="recent-solve-main">

                                            <strong>
                                                {problem.title}
                                            </strong>

                                            <span>
                                                {
                                                    problem.topics?.join(
                                                        " · "
                                                    ) ||
                                                    "No topics"
                                                }
                                            </span>

                                        </div>


                                        <span
                                            className={
                                                `difficulty-badge ${
                                                    problem.difficulty
                                                        ?.toLowerCase()
                                                }`
                                            }
                                        >
                                            {problem.difficulty}
                                        </span>


                                        <span className="platform-badge">

                                            {getPlatformInitials(
                                                problem.codingProfileId
                                                    ?.platform ||
                                                problem.platform
                                            )}

                                            <span>
                                                {
                                                    problem.codingProfileId
                                                        ?.platform ||
                                                    problem.platform ||
                                                    "Platform"
                                                }
                                            </span>

                                        </span>


                                        <span className="solved-date">
                                            {formatDate(
                                                problem.solvedDate
                                            )}
                                        </span>


                                        {problem.problemURL && (

                                            <a
                                                href={
                                                    problem.problemURL
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="problem-link"
                                            >
                                                Open ↗
                                            </a>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </section>


            {/* ======================================
                PROGRESS SNAPSHOT
            ======================================= */}

            <section className="section-block">


                <div className="section-heading">

                    <div>

                        <div className="eyebrow">
                            PROGRESS
                        </div>

                        <h2>
                            Your current preparation state
                        </h2>

                    </div>


                    <Link to="/progress">
                        Open progress →
                    </Link>

                </div>


                <div className="progress-summary-grid">


                    <div className="panel progress-summary-card">

                        <span>
                            Skills tracked
                        </span>

                        <strong>
                            {profile?.skills?.length || 0}
                        </strong>

                        <p>
                            Skills currently included
                            in your profile.
                        </p>

                    </div>


                    <div className="panel progress-summary-card">

                        <span>
                            Projects
                        </span>

                        <strong>
                            {
                                dashboard?.progress?.projectCount ??
                                dashboard?.projects?.length ??
                                0
                            }
                        </strong>

                        <p>
                            Projects included in your
                            current progress snapshot.
                        </p>

                    </div>


                    <div className="panel progress-summary-card">

                        <span>
                            Certifications
                        </span>

                        <strong>
                            {
                                dashboard?.progress
                                    ?.certificationCount ??
                                dashboard?.certifications?.length ??
                                0
                            }
                        </strong>

                        <p>
                            Certifications included in
                            your current progress snapshot.
                        </p>

                    </div>


                    <div className="panel progress-summary-card">

                        <span>
                            Readiness
                        </span>

                        <strong>
                            {readinessScore}
                        </strong>

                        <p>
                            Overall preparation score
                            based on your current data.
                        </p>

                    </div>


                </div>

            </section>


        </div>

    );

}


// ==========================================
// STAT CARD
// ==========================================

function StatCard({
    icon,
    label,
    value,
    suffix,
    accent,
    footer
}) {

    return (

        <div className="stat-card">


            <div
                className={`stat-icon ${accent}`}
            >
                {icon}
            </div>


            <span className="stat-label">
                {label}
            </span>


            <div className="stat-value">

                {value}

                {suffix && (

                    <small>
                        {suffix}
                    </small>

                )}

            </div>


            <span className="stat-footer">
                {footer}
            </span>


        </div>

    );

}


export default Dashboard;