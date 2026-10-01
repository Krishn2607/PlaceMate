import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { getDashboardData } from "../services/dashboardService";
import { getProfile } from "../services/profileService";
import { getTargetCompanies } from "../services/targetCompanyService";

import "./Dashboard.css";


// ==========================================
// PLATFORM INITIALS
// ==========================================

const PLATFORM_INITIALS = {
    LeetCode: "LC",
    Codeforces: "CF",
    CodeChef: "CC",
    HackerRank: "HR"
};


// ==========================================
// DASHBOARD
// ==========================================

function Dashboard() {

    const { student } = useAuth();


    const [dashboard, setDashboard] =
        useState(null);

    const [profile, setProfile] =
        useState(null);

    const [targetCompanies, setTargetCompanies] =
        useState([]);


    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


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
                    studentProfile,
                    companies
                ] = await Promise.all([
                    getDashboardData(),
                    getProfile(),
                    getTargetCompanies()
                ]);


                setDashboard(dashboardData);

                setProfile(studentProfile);

                setTargetCompanies(
                    companies || []
                );


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

    const getGreeting = () => {

        const hour =
            new Date().getHours();


        /*
         * 5:00 AM - 11:59 AM
         */

        if (hour >= 5 && hour < 12) {

            return "Good morning";

        }


        /*
         * 12:00 PM - 4:59 PM
         */

        if (hour >= 12 && hour < 17) {

            return "Good afternoon";

        }


        /*
         * 5:00 PM - 8:59 PM
         */

        if (hour >= 17 && hour < 21) {

            return "Good evening";

        }


        /*
         * 9:00 PM - 4:59 AM
         */

        return "Good night";

    };


    const [greeting, setGreeting] =
        useState(getGreeting);


    /*
     * Update the greeting automatically
     * every minute.
     *
     * This means if the dashboard remains
     * open while the time changes from:
     *
     * Good evening
     *       ↓
     * Good night
     *
     * the greeting updates automatically.
     */

    useEffect(() => {

        const updateGreeting = () => {

            setGreeting(
                getGreeting()
            );

        };


        updateGreeting();


        const interval =
            setInterval(
                updateGreeting,
                60 * 1000
            );


        return () => {

            clearInterval(interval);

        };

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

    }, [
        activeResume,
        dashboard
    ]);


    // ==========================================
    // READINESS SCORE
    // ==========================================

    const readinessScore = useMemo(() => {

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


        const ats = atsScore;


        const projects = Math.min(
            100,
            (
                (dashboard?.projects?.length || 0) / 3
            ) * 100
        );


        const certifications = Math.min(
            100,
            (
                (dashboard?.certifications?.length || 0) / 2
            ) * 100
        );


        const coding = Math.min(
            100,
            (
                (dashboard?.codingProblems?.length || 0) / 100
            ) * 100
        );


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


    /*
     * Dashboard shows maximum 3 coding profiles.
     *
     * The full coding profile list remains available
     * on the Coding page.
     */

    const dashboardCodingProfiles = useMemo(() => {

        return (
            dashboard?.codingProfiles?.slice(0, 3) || []
        );

    }, [dashboard]);


    // ==========================================
    // TARGET COMPANIES
    // ==========================================

    const sortedTargetCompanies = useMemo(() => {

        return [...targetCompanies].sort(
            (a, b) => {

                const priorityDifference =
                    Number(a.priority || 0) -
                    Number(b.priority || 0);


                if (priorityDifference !== 0) {

                    return priorityDifference;

                }


                return (
                    a.companyName || ""
                ).localeCompare(
                    b.companyName || ""
                );

            }
        );

    }, [targetCompanies]);


    const visibleTargetCompanies =
        sortedTargetCompanies.slice(0, 3);


    const remainingTargetCompanies =
        Math.max(
            0,
            sortedTargetCompanies.length - 3
        );


    const getPriorityLabel = (priority) => {

        const numericPriority =
            Number(priority);


        if (numericPriority === 1) {

            return "High";

        }


        if (numericPriority === 2) {

            return "Medium";

        }


        return "Low";

    };


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
                                        #ff7a18 0deg,
                                        #ff7a18 ${readinessScore * 3.6}deg,
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


                    {/* ==================================
                        WEEKLY PLAN
                    =================================== */}

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

                                        {
                                            dashboard.weeklyPlan
                                                .progress || 0
                                        }%

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
                                                        dashboard
                                                            .weeklyPlan
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


                    {/* ==================================
                        PROFILE
                    =================================== */}

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
                                    {
                                        dashboard?.projects?.length ||
                                        0
                                    }
                                </strong>

                                <span>
                                    Projects
                                </span>

                            </div>


                            <div>

                                <strong>
                                    {
                                        dashboard?.certifications
                                            ?.length || 0
                                    }
                                </strong>

                                <span>
                                    Certifications
                                </span>

                            </div>


                            <div>

                                <strong>
                                    {
                                        profile?.skills?.length ||
                                        0
                                    }
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
                CODING + TARGET COMPANIES
            ======================================= */}

            <section className="section-block">

                <div className="dashboard-two-column">


                    {/* ==================================
                        CODING
                    =================================== */}

                    <div>

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


                        <div className="coding-dashboard-card">


                            {[0, 1, 2].map(
                                (slotIndex) => {

                                    const codingProfile =
                                        dashboardCodingProfiles[
                                            slotIndex
                                        ];


                                    return (

                                        <div
                                            className={
                                                `coding-profile-slot ${
                                                    !codingProfile
                                                        ? "empty"
                                                        : ""
                                                }`
                                            }
                                            key={
                                                codingProfile?._id ||
                                                `coding-empty-${slotIndex}`
                                            }
                                        >


                                            {codingProfile ? (

                                                <>


                                                    {/* PLATFORM */}

                                                    <div className="coding-profile-platform">

                                                        <div className="platform-icon">

                                                            {
                                                                getPlatformInitials(
                                                                    codingProfile.platform
                                                                )
                                                            }

                                                        </div>


                                                        <div>

                                                            <strong>
                                                                {
                                                                    codingProfile.platform
                                                                }
                                                            </strong>

                                                            <span>
                                                                Connected
                                                            </span>

                                                        </div>

                                                    </div>


                                                    {/* PROBLEMS */}

                                                    <div className="coding-profile-stat">

                                                        <strong>

                                                            {
                                                                codingProfile
                                                                    .problemsSolved ||
                                                                0
                                                            }

                                                        </strong>


                                                        <span>
                                                            problems solved
                                                        </span>

                                                    </div>


                                                    {/* RATING */}

                                                    <div className="coding-profile-rating">

                                                        <span>
                                                            Rating
                                                        </span>


                                                        <strong>

                                                            {
                                                                codingProfile
                                                                    .rating ||
                                                                0
                                                            }

                                                        </strong>

                                                    </div>


                                                </>

                                            ) : (

                                                <div className="coding-empty-slot">

                                                    <span>
                                                        No coding profile connected
                                                    </span>

                                                </div>

                                            )}

                                        </div>

                                    );

                                }
                            )}


                        </div>

                    </div>


                    {/* ==================================
                        TARGET COMPANIES
                    =================================== */}

                    <div>

                        <div className="section-heading">

                            <div>

                                <div className="eyebrow">
                                    TARGETS
                                </div>

                                <h2>
                                    Target companies
                                </h2>

                            </div>


                            <Link to="/target-companies">
                                View all →
                            </Link>

                        </div>


                        <div className="panel target-dashboard-panel">


                            {sortedTargetCompanies.length === 0 ? (

                                <div className="empty-state">

                                    <div className="empty-icon">
                                        ◎
                                    </div>

                                    <h3>
                                        No target companies yet
                                    </h3>

                                    <p>
                                        Add companies you want
                                        to prepare for.
                                    </p>

                                    <Link
                                        to="/target-companies"
                                        className="primary-button"
                                    >
                                        Add target company
                                    </Link>

                                </div>

                            ) : (

                                <>

                                    <div className="target-dashboard-summary">

                                        <div>

                                            <span>
                                                Companies targeted
                                            </span>

                                            <strong>
                                                {
                                                    sortedTargetCompanies
                                                        .length
                                                }
                                            </strong>

                                        </div>


                                        <span className="target-dashboard-icon">
                                            ◎
                                        </span>

                                    </div>


                                    <div className="target-dashboard-list">

                                        {visibleTargetCompanies.map(
                                            company => (

                                                <div
                                                    className="target-dashboard-row"
                                                    key={
                                                        company._id
                                                    }
                                                >

                                                    <div className="target-company-name">

                                                        <span className="target-company-dot">
                                                            ●
                                                        </span>

                                                        <strong>
                                                            {
                                                                company.companyName
                                                            }
                                                        </strong>

                                                    </div>


                                                    <span
                                                        className={
                                                            `target-priority priority-${
                                                                Number(
                                                                    company.priority
                                                                ) || 3
                                                            }`
                                                        }
                                                    >

                                                        {
                                                            getPriorityLabel(
                                                                company.priority
                                                            )
                                                        }

                                                    </span>

                                                </div>

                                            )
                                        )}

                                    </div>


                                    {remainingTargetCompanies > 0 && (

                                        <div className="target-dashboard-more">

                                            + {remainingTargetCompanies}{" "}

                                            {
                                                remainingTargetCompanies === 1
                                                    ? "company"
                                                    : "companies"
                                            }

                                        </div>

                                    )}


                                    <Link
                                        to="/target-companies"
                                        className="secondary-button full-width"
                                    >
                                        Manage target companies
                                    </Link>

                                </>

                            )}

                        </div>

                    </div>

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

                                            {
                                                getPlatformInitials(
                                                    problem.codingProfileId
                                                        ?.platform ||
                                                    problem.platform
                                                )
                                            }


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