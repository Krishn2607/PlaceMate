import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getDashboardData } from "../services/dashboardService";
import { getProfile } from "../services/profileService";
import { getTargetCompanies } from "../services/targetCompanyService";

import "./Dashboard.css";

const PLATFORM_INITIALS = {
    LeetCode: "LC",
    Codeforces: "CF",
    CodeChef: "CC",
    HackerRank: "HR"
};

const ORANGE = "#ff7a18";
const RING_BACKGROUND = "#292b2e";

/* =========================================================
   ICONS
========================================================= */

function Icon({
    name,
    size = 18,
    strokeWidth = 1.8
}) {
    const commonProps = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        "aria-hidden": true
    };

    const paths = {
        resume: (
            <>
                <rect
                    x="5"
                    y="3"
                    width="14"
                    height="18"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                />
                <path
                    d="M8 8H16M8 12H16M8 16H13"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
            </>
        ),

        coding: (
            <>
                <path
                    d="M8 7L3 12L8 17"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M16 7L21 12L16 17"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M14 4L10 20"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
            </>
        ),

        project: (
            <>
                <rect
                    x="4"
                    y="5"
                    width="16"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                />
                <path
                    d="M8 5V3H16V5"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
                <path
                    d="M8 11H16M8 15H13"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
            </>
        ),

        certification: (
            <>
                <circle
                    cx="12"
                    cy="9"
                    r="5"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                />
                <path
                    d="M9.5 13L8 21L12 18.5L16 21L14.5 13"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                />
            </>
        ),

        profile: (
            <>
                <circle
                    cx="12"
                    cy="8"
                    r="3.5"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                />
                <path
                    d="M5 20C5.8 16.8 8.1 15 12 15C15.9 15 18.2 16.8 19 20"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
            </>
        ),

        target: (
            <>
                <circle
                    cx="12"
                    cy="12"
                    r="8"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                />
                <path
                    d="M12 2V5M12 19V22M2 12H5M19 12H22"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
            </>
        ),

        sparkle: (
            <>
                <path
                    d="M12 3L13.5 9.5L20 12L13.5 14.5L12 21L10.5 14.5L4 12L10.5 9.5L12 3Z"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                />
            </>
        ),

        check: (
            <path
                d="M5 12.5L9.5 17L19 7"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ),

        plus: (
            <>
                <path
                    d="M12 5V19"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
                <path
                    d="M5 12H19"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
            </>
        )
    };

    return (
        <svg {...commonProps}>
            {paths[name] || paths.sparkle}
        </svg>
    );
}


/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
    const { student } = useAuth();

    const [dashboard, setDashboard] = useState(null);
    const [profile, setProfile] = useState(null);
    const [targetCompanies, setTargetCompanies] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* =====================================================
       LOAD DASHBOARD DATA
    ===================================================== */

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
                setTargetCompanies(companies || []);
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


    /* =====================================================
       GREETING
    ===================================================== */

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


    /* =====================================================
       BASIC DATA
    ===================================================== */

    const projects = dashboard?.projects || [];

    const certifications =
        dashboard?.certifications || [];

    const codingProfiles =
        dashboard?.codingProfiles || [];

    const codingProblems =
        dashboard?.codingProblems || [];

    const resumes =
        dashboard?.resumes || [];

    const weeklyPlan =
        dashboard?.weeklyPlan || null;

    const progress =
        dashboard?.progress || null;


    /* =====================================================
       ACTIVE RESUME
    ===================================================== */

    const activeResume = useMemo(() => {
        if (!resumes.length) {
            return null;
        }

        return (
            resumes.find(
                (resume) => resume.isActive
            ) || resumes[0]
        );
    }, [resumes]);


    /* =====================================================
       ATS SCORE
    ===================================================== */

    const atsScore = useMemo(() => {
        const score =
            activeResume?.atsScore ??
            progress?.atsScore ??
            0;

        return Math.min(
            100,
            Math.max(
                0,
                Number(score) || 0
            )
        );
    }, [activeResume, progress]);


    /* =====================================================
       READINESS COMPONENTS
    ===================================================== */

    const readinessComponents = useMemo(() => {
        /*
         * CGPA
         * 10/10 = 100
         */

        const cgpa = Math.min(
            100,
            Math.max(
                0,
                ((Number(
                    profile?.profile?.cgpa
                ) || 0) / 10) * 100
            )
        );


        /*
         * RESUME ATS
         */

        const ats = atsScore;


        /*
         * PROJECTS
         * 3 projects = 100
         */

        const projectScore = Math.min(
            100,
            (projects.length / 3) * 100
        );


        /*
         * CERTIFICATIONS
         * 2 certifications = 100
         */

        const certificationScore = Math.min(
            100,
            (certifications.length / 2) * 100
        );


        /*
         * CODING
         * 100 tracked solved problems = 100
         */

        const codingScore = Math.min(
            100,
            (codingProblems.length / 100) * 100
        );


        /*
         * SKILLS
         * Average self level / 5
         */

        const skillScore = profile?.skills?.length
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
                        profile.skills.length /
                        5
                    ) * 100
                )
            )
            : 0;


        return {
            cgpa,
            ats,
            projects: projectScore,
            certifications: certificationScore,
            coding: codingScore,
            skills: skillScore
        };
    }, [
        profile,
        projects,
        certifications,
        codingProblems,
        atsScore
    ]);


    /* =====================================================
       READINESS SCORE
    ===================================================== */

    const readinessScore = useMemo(() => {
        const {
            cgpa,
            ats,
            projects: projectScore,
            coding,
            skills,
            certifications: certificationScore
        } = readinessComponents;

        return Math.round(
            cgpa * 0.2 +
            ats * 0.2 +
            projectScore * 0.2 +
            coding * 0.2 +
            skills * 0.1 +
            certificationScore * 0.1
        );
    }, [readinessComponents]);


    /* =====================================================
       READINESS MESSAGE
    ===================================================== */

    const readinessMessage = useMemo(() => {
        if (readinessScore >= 80) {
            return "Your preparation has a strong foundation.";
        }

        if (readinessScore >= 60) {
            return "You are building a solid placement foundation.";
        }

        if (readinessScore >= 40) {
            return "You are making progress, with a few areas needing attention.";
        }

        return "Your preparation is getting started. Keep building your evidence.";
    }, [readinessScore]);


    /* =====================================================
       READINESS STATUS
    ===================================================== */

    const readinessStatus = useMemo(() => {
        if (readinessScore >= 80) {
            return "Strong foundation";
        }

        if (readinessScore >= 60) {
            return "On track";
        }

        if (readinessScore >= 40) {
            return "Needs development";
        }

        return "Early stage";
    }, [readinessScore]);


    /* =====================================================
       SCORE RING
    ===================================================== */

    const scoreRing = useMemo(() => {
        const radius = 48;

        const circumference =
            2 * Math.PI * radius;

        const percentage =
            Math.min(
                100,
                Math.max(
                    0,
                    readinessScore
                )
            );

        const offset =
            circumference -
            (percentage / 100) *
            circumference;

        return {
            radius,
            circumference,
            offset
        };
    }, [readinessScore]);


    /* =====================================================
       WEEKLY PLAN
    ===================================================== */

    const totalTasks =
        weeklyPlan?.tasks?.length || 0;

    const completedTasks = useMemo(() => {
        if (!weeklyPlan?.tasks?.length) {
            return 0;
        }

        return weeklyPlan.tasks.filter(
            (task) => task.completed
        ).length;
    }, [weeklyPlan]);

    const weeklyProgress = useMemo(() => {
        if (!totalTasks) {
            return 0;
        }

        return Math.round(
            (completedTasks / totalTasks) * 100
        );
    }, [
        completedTasks,
        totalTasks
    ]);


    /* =====================================================
       CODING
    ===================================================== */

    const codingSolved =
        codingProblems.length;

    const totalPlatformSolved = useMemo(() => {
        if (!codingProfiles.length) {
            return 0;
        }

        return codingProfiles.reduce(
            (total, codingProfile) =>
                total +
                Number(
                    codingProfile.problemsSolved || 0
                ),
            0
        );
    }, [codingProfiles]);


    /* =====================================================
       CODING WEEKLY TASKS
    ===================================================== */

    const codingWeeklyStats = useMemo(() => {
        const tasks =
            weeklyPlan?.tasks?.filter(
                (task) =>
                    task.category === "Coding"
            ) || [];

        const completed =
            tasks.filter(
                (task) => task.completed
            ).length;

        return {
            completed,
            total: tasks.length,
            progress: tasks.length
                ? Math.round(
                    (completed /
                        tasks.length) *
                    100
                )
                : 0
        };
    }, [weeklyPlan]);


    /* =====================================================
       TARGET COMPANIES
    ===================================================== */

    const sortedTargetCompanies =
        useMemo(() => {
            return [...targetCompanies].sort(
                (a, b) => {
                    const priorityDifference =
                        Number(a.priority || 0) -
                        Number(b.priority || 0);

                    if (
                        priorityDifference !== 0
                    ) {
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


    /* =====================================================
       RECENT PROBLEMS
    ===================================================== */

    const recentProblems = useMemo(() => {
        if (!codingProblems.length) {
            return [];
        }

        return [...codingProblems]
            .sort(
                (a, b) =>
                    new Date(
                        b.solvedDate
                    ) -
                    new Date(
                        a.solvedDate
                    )
            )
            .slice(0, 5);
    }, [codingProblems]);


    /* =====================================================
       DATE FORMAT
    ===================================================== */

    const formatDate = (date) => {
        if (!date) {
            return "";
        }

        return new Date(
            date
        ).toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric"
            }
        );
    };


    /* =====================================================
       PLATFORM INITIALS
    ===================================================== */

    const getPlatformInitials = (
        platform
    ) => {
        return (
            PLATFORM_INITIALS[platform] ||
            platform
                ?.slice(0, 2)
                .toUpperCase() ||
            "CP"
        );
    };


    /* =====================================================
       STRONGEST SIGNAL
    ===================================================== */

    const strongestSignal = useMemo(() => {
        const signals = [
            {
                name: "CGPA",
                value:
                    readinessComponents.cgpa
            },
            {
                name: "Resume ATS",
                value:
                    readinessComponents.ats
            },
            {
                name: "Projects",
                value:
                    readinessComponents.projects
            },
            {
                name: "Coding",
                value:
                    readinessComponents.coding
            },
            {
                name: "Skills",
                value:
                    readinessComponents.skills
            },
            {
                name: "Certifications",
                value:
                    readinessComponents.certifications
            }
        ];

        return signals.reduce(
            (best, current) =>
                current.value >
                best.value
                    ? current
                    : best,
            signals[0]
        );
    }, [readinessComponents]);


    /* =====================================================
       BIGGEST OPPORTUNITY
    ===================================================== */

    const biggestOpportunity = useMemo(() => {
        const signals = [
            {
                name: "CGPA",
                value:
                    readinessComponents.cgpa
            },
            {
                name: "Resume ATS",
                value:
                    readinessComponents.ats
            },
            {
                name: "Projects",
                value:
                    readinessComponents.projects
            },
            {
                name: "Coding",
                value:
                    readinessComponents.coding
            },
            {
                name: "Skills",
                value:
                    readinessComponents.skills
            },
            {
                name: "Certifications",
                value:
                    readinessComponents.certifications
            }
        ];

        return signals.reduce(
            (lowest, current) =>
                current.value <
                lowest.value
                    ? current
                    : lowest,
            signals[0]
        );
    }, [readinessComponents]);


    /* =====================================================
       LOADING
    ===================================================== */

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


    /* =====================================================
       ERROR
    ===================================================== */

    if (error) {
        return (
            <div className="dashboard-error">
                <h2>
                    Something went wrong
                </h2>

                <p>{error}</p>

                <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                        window.location.reload()
                    }
                >
                    Try again
                </button>
            </div>
        );
    }


    /* =====================================================
       PAGE
    ===================================================== */

    return (
        <div className="dashboard-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <section className="dashboard-intro">
                <div>
                    <div className="eyebrow">
                        <span className="status-dot" />
                        PLACEMENT WORKSPACE
                    </div>

                    <h1>
                        {greeting},{" "}
                        <span>
                            {student?.name ||
                                "Student"}.
                        </span>
                    </h1>

                    <p>
                        Your placement journey is
                        moving forward. Here's what
                        deserves your attention today.
                    </p>
                </div>
            </section>


            {/* =================================================
                PREPARATION SNAPSHOT
            ================================================= */}

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

                    {/* SCORE */}

                    <div
                        className="snapshot-score"
                        aria-label={`Readiness score ${readinessScore} out of 100`}
                    >
                        <div
                            className="score-ring"
                            style={{
                                width: "112px",
                                height: "112px",
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0
                            }}
                        >

                            <svg
                                className="score-ring-svg"
                                width="112"
                                height="112"
                                viewBox="0 0 120 120"
                                style={{
                                    position:
                                        "absolute",
                                    inset: 0,
                                    width: "100%",
                                    height: "100%",
                                    transform:
                                        "rotate(0deg)"
                                }}
                            >
                                <circle
                                    cx="60"
                                    cy="60"
                                    r={
                                        scoreRing.radius
                                    }
                                    fill="none"
                                    stroke={
                                        RING_BACKGROUND
                                    }
                                    strokeWidth="10"
                                />

                                <circle
                                    cx="60"
                                    cy="60"
                                    r={
                                        scoreRing.radius
                                    }
                                    fill="none"
                                    stroke={ORANGE}
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    strokeDasharray={
                                        scoreRing.circumference
                                    }
                                    strokeDashoffset={
                                        scoreRing.offset
                                    }
                                    transform="rotate(-90 60 60)"
                                    style={{
                                        transition:
                                            "stroke-dashoffset 0.6s ease"
                                    }}
                                />
                            </svg>


                            <div
                                className="score-ring-inner"
                                style={{
                                    position:
                                        "relative",
                                    zIndex: 2,
                                    display:
                                        "flex",
                                    flexDirection:
                                        "column",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center"
                                }}
                            >
                                <strong>
                                    {readinessScore}
                                </strong>

                                <span>
                                    /100
                                </span>
                            </div>

                        </div>
                    </div>


                    {/* SCORE INFORMATION */}

                    <div className="snapshot-info">

                        <div className="snapshot-status">
                            {readinessStatus}
                        </div>

                        <h2>
                            {readinessMessage}
                        </h2>

                        <p>
                            Your readiness score
                            combines your CGPA,
                            resume ATS, projects,
                            coding activity, skills
                            and certifications.
                        </p>

                        <div className="snapshot-meta">

                            <span>
                                {profile?.skills
                                    ?.length || 0}{" "}
                                skills tracked
                            </span>

                            <span>•</span>

                            <span>
                                Resume ATS:{" "}
                                {atsScore}/100
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


            {/* =================================================
                STAT CARDS
            ================================================= */}

            <section className="stats-grid">

                <StatCard
                    icon="resume"
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
                    icon="coding"
                    label="Problems solved"
                    value={codingSolved}
                    accent="orange"
                    footer={
                        totalPlatformSolved ===
                        codingSolved
                            ? "Across coding profiles"
                            : `${totalPlatformSolved} in platform profiles`
                    }
                />


                <StatCard
                    icon="project"
                    label="Projects"
                    value={
                        projects.length
                    }
                    accent="green"
                    footer="Projects in your portfolio"
                />


                <StatCard
                    icon="certification"
                    label="Certifications"
                    value={
                        certifications.length
                    }
                    accent="orange"
                    footer="Certifications tracked"
                />

            </section>


            {/* =================================================
                PREPARATION PULSE
            ================================================= */}

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

                        {!weeklyPlan ? (

                            <div className="empty-state">

                                <div className="empty-icon">
                                    <Icon
                                        name="sparkle"
                                        size={22}
                                    />
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
                                                weeklyPlan.weekStartDate
                                            )}{" "}
                                            –{" "}
                                            {formatDate(
                                                weeklyPlan.weekEndDate
                                            )}{" "}
                                            •{" "}
                                            {completedTasks}{" "}
                                            of{" "}
                                            {totalTasks}{" "}
                                            complete
                                        </p>
                                    </div>


                                    <span className="percentage-badge">
                                        {weeklyProgress}%
                                    </span>

                                </div>


                                <div className="progress-track">

                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${weeklyProgress}%`
                                        }}
                                    />

                                </div>


                                <div className="task-list">

                                    {weeklyPlan.tasks
                                        ?.slice(0, 5)
                                        .map(
                                            (
                                                task,
                                                index
                                            ) => (

                                                <div
                                                    className="task-row"
                                                    key={
                                                        task._id ||
                                                        index
                                                    }
                                                >

                                                    <div
                                                        className={`task-check ${
                                                            task.completed
                                                                ? "completed"
                                                                : ""
                                                        }`}
                                                    >
                                                        {task.completed ? (
                                                            <Icon
                                                                name="check"
                                                                size={15}
                                                            />
                                                        ) : (
                                                            <span />
                                                        )}
                                                    </div>


                                                    <span
                                                        className={
                                                            task.completed
                                                                ? "task-completed"
                                                                : ""
                                                        }
                                                    >
                                                        {
                                                            task.title
                                                        }
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
                            <Icon
                                name="profile"
                                size={21}
                            />
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
                                    {projects.length}
                                </strong>

                                <span>
                                    Projects
                                </span>
                            </div>


                            <div>
                                <strong>
                                    {certifications.length}
                                </strong>

                                <span>
                                    Certifications
                                </span>
                            </div>


                            <div>
                                <strong>
                                    {profile?.skills
                                        ?.length || 0}
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


            {/* =================================================
                CODING + TARGET COMPANIES
            ================================================= */}

            <section className="section-block">

                <div className="dashboard-two-column">

                    {/* CODING */}

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


                        <div className="coding-grid">

                            {codingProfiles.length ? (

                                codingProfiles.map(
                                    (codingProfile) => (

                                        <div
                                            className="coding-card"
                                            key={
                                                codingProfile._id
                                            }
                                        >

                                            <div className="coding-card-top">

                                                <div className="platform-icon">
                                                    {
                                                        getPlatformInitials(
                                                            codingProfile.platform
                                                        )
                                                    }
                                                </div>

                                                <span>
                                                    {
                                                        codingProfile.platform
                                                    }
                                                </span>

                                            </div>


                                            <strong>
                                                {
                                                    codingProfile.problemsSolved ||
                                                    0
                                                }
                                            </strong>

                                            <p>
                                                problems solved
                                            </p>


                                            <div className="coding-rating">

                                                <span>
                                                    Rating
                                                </span>

                                                <strong>
                                                    {
                                                        codingProfile.rating ||
                                                        0
                                                    }
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
                                        Add your coding
                                        platforms to start
                                        tracking your
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


                        {/* CODING WEEKLY SUMMARY */}

                        <div className="coding-weekly-summary">

                            <div className="coding-weekly-main">

                                <span>
                                    Coding this week
                                </span>

                                <strong>
                                    {
                                        codingWeeklyStats.completed
                                    }{" "}
                                    /{" "}
                                    {
                                        codingWeeklyStats.total
                                    }
                                </strong>

                            </div>

                            <small>
                                {
                                    codingWeeklyStats.total ===
                                    0
                                        ? "No coding tasks this week"
                                        : `${codingWeeklyStats.progress}% complete`
                                }
                            </small>

                        </div>

                    </div>


                    {/* TARGET COMPANIES */}

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

                            {sortedTargetCompanies.length ===
                            0 ? (

                                <div className="empty-state">

                                    <div className="empty-icon">
                                        <Icon
                                            name="target"
                                            size={22}
                                        />
                                    </div>

                                    <h3>
                                        No target companies
                                        yet
                                    </h3>

                                    <p>
                                        Add companies you
                                        want to prepare
                                        for.
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
                                                Companies
                                                targeted
                                            </span>

                                            <strong>
                                                {
                                                    sortedTargetCompanies.length
                                                }
                                            </strong>
                                        </div>

                                        <span className="target-dashboard-icon">
                                            <Icon
                                                name="target"
                                                size={20}
                                            />
                                        </span>

                                    </div>


                                    <div className="target-dashboard-list">

                                        {visibleTargetCompanies.map(
                                            (company) => (

                                                <div
                                                    className="target-dashboard-row"
                                                    key={
                                                        company._id
                                                    }
                                                >

                                                    <div className="target-company-name">

                                                        <span className="target-company-dot">
                                                            •
                                                        </span>

                                                        <strong>
                                                            {
                                                                company.companyName
                                                            }
                                                        </strong>

                                                    </div>


                                                    <span
                                                        className={`target-priority priority-${
                                                            Number(
                                                                company.priority
                                                            ) || 3
                                                        }`}
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


                                    {remainingTargetCompanies >
                                        0 && (

                                        <div className="target-dashboard-more">
                                            +{" "}
                                            {
                                                remainingTargetCompanies
                                            }{" "}
                                            more{" "}
                                            {
                                                remainingTargetCompanies ===
                                                1
                                                    ? "company"
                                                    : "companies"
                                            }
                                        </div>

                                    )}


                                    <Link
                                        to="/target-companies"
                                        className="secondary-button full-width"
                                    >
                                        Manage target
                                        companies
                                    </Link>

                                </>

                            )}

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                RECENT SOLVES
            ================================================= */}

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
                                <Icon
                                    name="coding"
                                    size={22}
                                />
                            </div>

                            <h3>
                                No solved problems yet
                            </h3>

                            <p>
                                Start logging solved
                                coding problems to build
                                your activity history.
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
                                (problem) => (

                                    <div
                                        className="recent-solve-row"
                                        key={
                                            problem._id
                                        }
                                    >

                                        <div className="recent-solve-main">

                                            <strong>
                                                {
                                                    problem.title
                                                }
                                            </strong>

                                            <span>
                                                {problem.topics?.join(
                                                    " · "
                                                ) ||
                                                    "No topics"}
                                            </span>

                                        </div>


                                        <span
                                            className={`difficulty-badge ${(
                                                problem.difficulty ||
                                                ""
                                            ).toLowerCase()}`}
                                        >
                                            {
                                                problem.difficulty
                                            }
                                        </span>


                                        <span className="platform-badge">

                                            {getPlatformInitials(
                                                problem
                                                    .codingProfileId
                                                    ?.platform ||
                                                problem.platform
                                            )}

                                            <span>
                                                {problem
                                                    .codingProfileId
                                                    ?.platform ||
                                                    problem.platform ||
                                                    "Platform"}
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


            {/* =================================================
                PROGRESS SNAPSHOT
            ================================================= */}

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

                    {/* SKILLS */}

                    <div className="panel progress-summary-card">

                        <div className="progress-card-header">

                            <span>
                                Skills tracked
                            </span>

                            <div
                                className="progress-card-icon"
                                aria-hidden="true"
                            >
                                <Icon
                                    name="profile"
                                    size={18}
                                    strokeWidth={1.7}
                                />
                            </div>

                        </div>

                        <strong>
                            {profile?.skills
                                ?.length || 0}
                        </strong>

                        <p>
                            Skills currently included
                            in your profile.
                        </p>

                    </div>


                    {/* PROJECTS */}

                    <div className="panel progress-summary-card">

                        <div className="progress-card-header">

                            <span>
                                Projects
                            </span>

                            <div
                                className="progress-card-icon"
                                aria-hidden="true"
                            >
                                <Icon
                                    name="project"
                                    size={18}
                                    strokeWidth={1.7}
                                />
                            </div>

                        </div>

                        <strong>
                            {progress?.projectCount ??
                                projects.length}
                        </strong>

                        <p>
                            Projects included in your
                            current progress snapshot.
                        </p>

                    </div>


                    {/* CERTIFICATIONS */}

                    <div className="panel progress-summary-card">

                        <div className="progress-card-header">

                            <span>
                                Certifications
                            </span>

                            <div
                                className="progress-card-icon"
                                aria-hidden="true"
                            >
                                <Icon
                                    name="certification"
                                    size={18}
                                    strokeWidth={1.7}
                                />
                            </div>

                        </div>

                        <strong>
                            {progress?.certificationCount ??
                                certifications.length}
                        </strong>

                        <p>
                            Certifications included in
                            your current progress snapshot.
                        </p>

                    </div>


                    {/* READINESS */}

                    <div className="panel progress-summary-card">

                        <div className="progress-card-header">

                            <span>
                                Readiness
                            </span>

                            <div
                                className="progress-card-icon"
                                aria-hidden="true"
                            >
                                <Icon
                                    name="target"
                                    size={18}
                                    strokeWidth={1.7}
                                />
                            </div>

                        </div>

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


            {/* =================================================
                DYNAMIC READINESS DETAILS
            ================================================= */}

            <section className="section-block">

                <div className="section-heading">

                    <div>
                        <div className="eyebrow">
                            INSIGHT
                        </div>

                        <h2>
                            What your data says
                        </h2>
                    </div>

                    <Link to="/readiness">
                        Review readiness →
                    </Link>

                </div>


                <div className="progress-summary-grid">

                    <div className="panel progress-summary-card">

                        <span>
                            Strongest signal
                        </span>

                        <strong>
                            {strongestSignal.name}
                        </strong>

                        <p>
                            Current score:{" "}
                            {Math.round(
                                strongestSignal.value
                            )}
                            /100
                        </p>

                    </div>


                    <div className="panel progress-summary-card">

                        <span>
                            Biggest opportunity
                        </span>

                        <strong>
                            {biggestOpportunity.name}
                        </strong>

                        <p>
                            Current score:{" "}
                            {Math.round(
                                biggestOpportunity.value
                            )}
                            /100
                        </p>

                    </div>


                    <div className="panel progress-summary-card">

                        <span>
                            Weekly completion
                        </span>

                        <strong>
                            {weeklyProgress}%
                        </strong>

                        <p>
                            {completedTasks} of{" "}
                            {totalTasks} weekly tasks
                            completed.
                        </p>

                    </div>


                    <div className="panel progress-summary-card">

                        <span>
                            Coding this week
                        </span>

                        <strong>
                            {
                                codingWeeklyStats.completed
                            }
                            /
                            {
                                codingWeeklyStats.total
                            }
                        </strong>

                        <p>
                            Only tasks categorized as
                            Coding are included.
                        </p>

                    </div>

                </div>

            </section>

        </div>
    );
}


/* =========================================================
   STAT CARD
========================================================= */

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
                aria-hidden="true"
            >
                <Icon
                    name={icon}
                    size={20}
                />
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