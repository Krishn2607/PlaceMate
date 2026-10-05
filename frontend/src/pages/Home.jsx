import { Link } from "react-router-dom";
import {
    ArrowRight,
    BarChart3,
    BrainCircuit,
    CheckCircle2,
    Code2,
    FileText,
    FolderKanban,
    GraduationCap,
    LineChart,
    Rocket,
    ShieldCheck,
    Sparkles,
    Target,
    Trophy,
    UserRound,
} from "lucide-react";

import "./Home.css";


const features = [
    {
        icon: UserRound,
        number: "01",
        title: "Student Profile",
        description:
            "Keep your academic and placement information organized in one place.",
    },
    {
        icon: Code2,
        number: "02",
        title: "Coding",
        description:
            "Track coding progress and maintain your competitive programming profiles.",
    },
    {
        icon: FolderKanban,
        number: "03",
        title: "Projects",
        description:
            "Build a strong project portfolio and keep your practical work visible.",
    },
    {
        icon: GraduationCap,
        number: "04",
        title: "Skills",
        description:
            "Track the technical skills you are developing and understand your current level.",
    },
    {
        icon: FileText,
        number: "05",
        title: "Resume",
        description:
            "Manage your resumes and understand how well they perform for ATS screening.",
    },
    {
        icon: Trophy,
        number: "06",
        title: "Certifications",
        description:
            "Keep your certifications and achievements connected to your placement profile.",
    },
    {
        icon: Target,
        number: "07",
        title: "Readiness",
        description:
            "See a measurable picture of your current placement preparation.",
    },
    {
        icon: BarChart3,
        number: "08",
        title: "Progress",
        description:
            "Track how your preparation changes over time and identify what needs attention.",
    },
];


const workflow = [
    {
        number: "01",
        title: "Build",
        description:
            "Create your placement profile and add your skills, projects, coding and achievements.",
    },
    {
        number: "02",
        title: "Track",
        description:
            "Keep your preparation data updated and understand where you currently stand.",
    },
    {
        number: "03",
        title: "Improve",
        description:
            "Use readiness insights, weekly planning and progress analysis to decide what to work on next.",
    },
];


const readinessSignals = [
    "CGPA",
    "Coding",
    "Projects",
    "Skills",
    "Resume",
    "Certifications",
];


function Home() {
    return (
        <div className="home-page">

            {/* =========================================
                NAVBAR
            ========================================= */}

            <header className="home-navbar">

                <Link
                    to="/"
                    className="home-brand"
                >
                    <span className="home-brand-mark">
                        P
                    </span>

                    <span>
                        Place<span>Mate</span>
                    </span>
                </Link>


                <nav className="home-nav-links">

                    <a href="#features">
                        Features
                    </a>

                    <a href="#how-it-works">
                        How it works
                    </a>

                    <a href="#readiness">
                        Readiness
                    </a>

                </nav>


                <div className="home-nav-actions">

                    <Link
                        to="/login"
                        className="home-login-link"
                    >
                        Sign in
                    </Link>

                    <Link
                        to="/register"
                        className="home-nav-button"
                    >
                        Get started
                        <ArrowRight size={14} />
                    </Link>

                </div>

            </header>


            {/* =========================================
                HERO
            ========================================= */}

            <main>

                <section className="home-hero">

                    <div className="home-hero-glow" />

                    <div className="home-hero-grid" />


                    <div className="home-hero-content">

                        <div className="home-eyebrow">

                            <span className="home-eyebrow-dot" />

                            AI-POWERED PLACEMENT PREPARATION

                        </div>


                        <h1>

                            Your placement
                            <br />

                            <span>preparation,</span>

                            <br />

                            finally in one place.

                        </h1>


                        <p className="home-hero-description">

                            PlaceMate brings your profile, skills, coding,
                            projects, resume, certifications and preparation
                            progress together into one focused workspace.

                        </p>


                        <div className="home-hero-actions">

                            <Link
                                to="/register"
                                className="home-primary-button"
                            >
                                Start preparing
                                <ArrowRight size={17} />
                            </Link>


                            <Link
                                to="/login"
                                className="home-secondary-button"
                            >
                                I already have an account
                            </Link>

                        </div>


                        <div className="home-hero-note">

                            <CheckCircle2 size={14} />

                            <span>
                                Build your profile. Track your preparation.
                                Know where you stand.
                            </span>

                        </div>

                    </div>


                    {/* =========================================
                        HERO PRODUCT PREVIEW
                    ========================================= */}

                    <div className="home-dashboard-preview">

                        <div className="home-preview-topbar">

                            <div className="home-preview-brand">

                                <span className="home-preview-logo">
                                    P
                                </span>

                                <span>
                                    PlaceMate
                                </span>

                            </div>


                            <div className="home-preview-dots">

                                <span />
                                <span />
                                <span />

                            </div>

                        </div>


                        <div className="home-preview-body">

                            <div className="home-preview-sidebar">

                                <span className="active" />
                                <span />
                                <span />
                                <span />
                                <span />
                                <span />

                            </div>


                            <div className="home-preview-content">

                                <div className="home-preview-heading">

                                    <div>

                                        <small>
                                            OVERVIEW
                                        </small>

                                        <strong>
                                            Your preparation
                                        </strong>

                                    </div>


                                    <div className="home-preview-avatar">
                                        K
                                    </div>

                                </div>


                                <div className="home-preview-stats">

                                    <div className="home-preview-stat">

                                        <span>
                                            READINESS
                                        </span>

                                        <strong>
                                            78%
                                        </strong>

                                        <small>
                                            Good progress
                                        </small>

                                    </div>


                                    <div className="home-preview-stat">

                                        <span>
                                            CODING
                                        </span>

                                        <strong>
                                            202
                                        </strong>

                                        <small>
                                            Problems solved
                                        </small>

                                    </div>


                                    <div className="home-preview-stat">

                                        <span>
                                            PROJECTS
                                        </span>

                                        <strong>
                                            06
                                        </strong>

                                        <small>
                                            Portfolio projects
                                        </small>

                                    </div>

                                </div>


                                <div className="home-preview-lower">

                                    <div className="home-preview-chart">

                                        <div className="home-preview-card-title">
                                            Preparation progress
                                        </div>

                                        <div className="home-chart-lines">

                                            <span style={{ height: "34%" }} />
                                            <span style={{ height: "48%" }} />
                                            <span style={{ height: "43%" }} />
                                            <span style={{ height: "61%" }} />
                                            <span style={{ height: "57%" }} />
                                            <span style={{ height: "74%" }} />
                                            <span style={{ height: "84%" }} />

                                        </div>

                                    </div>


                                    <div className="home-preview-readiness">

                                        <div className="home-preview-card-title">
                                            Readiness signals
                                        </div>


                                        <div className="home-signal-list">

                                            {readinessSignals
                                                .slice(0, 4)
                                                .map((signal) => (
                                                    <div
                                                        key={signal}
                                                        className="home-signal"
                                                    >
                                                        <span>
                                                            {signal}
                                                        </span>

                                                        <i />
                                                    </div>
                                                ))}

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =========================================
                    TRUST / POSITIONING
                ========================================= */}

                <section className="home-positioning">

                    <div className="home-positioning-line" />

                    <p>
                        ONE WORKSPACE FOR THE ENTIRE PREPARATION JOURNEY
                    </p>

                    <div className="home-positioning-line" />

                </section>


                {/* =========================================
                    FEATURES
                ========================================= */}

                <section
                    id="features"
                    className="home-section home-features"
                >

                    <div className="home-section-heading">

                        <span className="home-label">
                            EVERYTHING CONNECTED
                        </span>


                        <h2>
                            Stop managing your
                            <span> preparation in pieces.</span>
                        </h2>


                        <p>
                            Your placement journey is more than coding
                            problems. PlaceMate connects the different
                            signals that define your preparation.
                        </p>

                    </div>


                    <div className="home-feature-grid">

                        {features.map((feature) => {

                            const Icon = feature.icon;

                            return (
                                <div
                                    key={feature.number}
                                    className="home-feature-card"
                                >

                                    <div className="home-feature-top">

                                        <span className="home-feature-number">
                                            {feature.number}
                                        </span>

                                        <Icon
                                            size={19}
                                            strokeWidth={1.6}
                                        />

                                    </div>


                                    <h3>
                                        {feature.title}
                                    </h3>


                                    <p>
                                        {feature.description}
                                    </p>


                                    <div className="home-feature-line" />

                                </div>
                            );

                        })}

                    </div>

                </section>


                {/* =========================================
                    HOW IT WORKS
                ========================================= */}

                <section
                    id="how-it-works"
                    className="home-section home-workflow-section"
                >

                    <div className="home-section-heading">

                        <span className="home-label">
                            THE PREPARATION LOOP
                        </span>


                        <h2>
                            Build.
                            <span> Track. Improve.</span>
                        </h2>


                        <p>
                            PlaceMate is designed to be used continuously,
                            not just when placements are around the corner.
                        </p>

                    </div>


                    <div className="home-workflow">

                        {workflow.map((step) => (

                            <div
                                key={step.number}
                                className="home-workflow-card"
                            >

                                <span className="home-workflow-number">
                                    {step.number}
                                </span>


                                <div className="home-workflow-icon">

                                    {step.number === "01" && (
                                        <Rocket size={22} />
                                    )}

                                    {step.number === "02" && (
                                        <LineChart size={22} />
                                    )}

                                    {step.number === "03" && (
                                        <Target size={22} />
                                    )}

                                </div>


                                <h3>
                                    {step.title}
                                </h3>


                                <p>
                                    {step.description}
                                </p>

                            </div>

                        ))}

                    </div>

                </section>


                {/* =========================================
                    READINESS
                ========================================= */}

                <section
                    id="readiness"
                    className="home-readiness-section"
                >

                    <div className="home-readiness-glow" />


                    <div className="home-readiness-content">

                        <span className="home-label">
                            PLACEMENT READINESS
                        </span>


                        <h2>
                            Know where you stand
                            <span> before the interview.</span>
                        </h2>


                        <p>
                            Instead of relying on a feeling that you are
                            "ready", PlaceMate brings measurable preparation
                            signals together so you can understand your
                            current strengths and the areas that need work.
                        </p>


                        <Link
                            to="/register"
                            className="home-primary-button"
                        >
                            Build your readiness
                            <ArrowRight size={17} />
                        </Link>

                    </div>


                    <div className="home-readiness-card">

                        <div className="home-readiness-card-header">

                            <div>

                                <span>
                                    CURRENT READINESS
                                </span>

                                <strong>
                                    Placement score
                                </strong>

                            </div>


                            <BrainCircuit
                                size={20}
                            />

                        </div>


                        <div className="home-readiness-score">

                            <div className="home-score-circle">

                                <div>

                                    <strong>
                                        78
                                    </strong>

                                    <span>
                                        /100
                                    </span>

                                </div>

                            </div>


                            <div className="home-score-info">

                                <strong>
                                    Good foundation
                                </strong>

                                <p>
                                    Keep improving your weaker signals
                                    to move closer to interview readiness.
                                </p>

                            </div>

                        </div>


                        <div className="home-readiness-bars">

                            {readinessSignals.map((signal, index) => (

                                <div
                                    key={signal}
                                    className="home-readiness-bar"
                                >

                                    <div>

                                        <span>
                                            {signal}
                                        </span>

                                        <strong>
                                            {72 + index * 4}%
                                        </strong>

                                    </div>


                                    <div className="home-bar-track">

                                        <span
                                            style={{
                                                width: `${72 + index * 4}%`,
                                            }}
                                        />

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                </section>


                {/* =========================================
                    AI SECTION
                ========================================= */}

                <section className="home-section home-ai-section">

                    <div className="home-ai-card">

                        <div className="home-ai-content">

                            <div className="home-ai-icon">

                                <Sparkles size={21} />

                            </div>


                            <span className="home-label">
                                AI IN PLACEMATE
                            </span>


                            <h2>
                                Turn your preparation
                                <span> data into direction.</span>
                            </h2>


                            <p>
                                PlaceMate uses AI where structured analysis
                                can make preparation more actionable —
                                helping generate weekly plans, understand
                                progress changes and support resume analysis.
                            </p>


                            <Link
                                to="/register"
                                className="home-text-link"
                            >
                                Explore PlaceMate
                                <ArrowRight size={15} />
                            </Link>

                        </div>


                        <div className="home-ai-points">

                            <div className="home-ai-point">

                                <span>
                                    01
                                </span>

                                <div>

                                    <strong>
                                        Weekly plan generation
                                    </strong>

                                    <p>
                                        Turn your goals into structured
                                        preparation tasks.
                                    </p>

                                </div>

                            </div>


                            <div className="home-ai-point">

                                <span>
                                    02
                                </span>

                                <div>

                                    <strong>
                                        Progress analysis
                                    </strong>

                                    <p>
                                        Understand how your preparation
                                        changes over time.
                                    </p>

                                </div>

                            </div>


                            <div className="home-ai-point">

                                <span>
                                    03
                                </span>

                                <div>

                                    <strong>
                                        Resume analysis
                                    </strong>

                                    <p>
                                        Get additional insight into your
                                        resume quality.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =========================================
                    FINAL CTA
                ========================================= */}

                <section className="home-final-cta">

                    <div className="home-final-glow" />


                    <div className="home-final-content">

                        <span className="home-label">
                            YOUR PLACEMENT JOURNEY
                        </span>


                        <h2>
                            Prepare with context.
                            <br />
                            <span>Track with clarity.</span>
                            <br />
                            Improve continuously.
                        </h2>


                        <p>
                            Everything you need to understand, organize and
                            improve your placement preparation — in one place.
                        </p>


                        <div className="home-final-actions">

                            <Link
                                to="/register"
                                className="home-primary-button"
                            >
                                Create your account
                                <ArrowRight size={17} />
                            </Link>


                            <Link
                                to="/login"
                                className="home-secondary-button"
                            >
                                Sign in
                            </Link>

                        </div>

                    </div>

                </section>

            </main>


            {/* =========================================
                FOOTER
            ========================================= */}

            <footer className="home-footer">

                <div className="home-footer-main">

                    <Link
                        to="/"
                        className="home-brand"
                    >
                        <span className="home-brand-mark">
                            P
                        </span>

                        <span>
                            Place<span>Mate</span>
                        </span>

                    </Link>


                    <p>
                        Your placement preparation,
                        all in one workspace.
                    </p>


                    <div className="home-footer-links">

                        <Link to="/login">
                            Sign in
                        </Link>

                        <Link to="/register">
                            Create account
                        </Link>

                    </div>

                </div>


                <div className="home-footer-bottom">

                    <span>
                        © {new Date().getFullYear()} PlaceMate
                    </span>

                    <span>
                        Built for students who want to be ready.
                    </span>

                </div>

            </footer>

        </div>
    );
}


export default Home;