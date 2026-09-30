import { Link } from "react-router-dom";

import "./AboutPlaceMate.css";

const features = [
    {
        number: "01",
        title: "Student Profile",
        description:
            "Keep your academic and personal placement information in one place, including college, branch, semester, CGPA, graduation year, contact information and GitHub.",
        path: "/profile"
    },
    {
        number: "02",
        title: "Skills",
        description:
            "Track the technical skills you are building and maintain a clear view of your current self-assessed skill level.",
        path: "/skills"
    },
    {
        number: "03",
        title: "Coding",
        description:
            "Track solved coding problems and coding-platform profiles across the supported platforms: LeetCode, Codeforces, CodeChef and HackerRank.",
        path: "/coding"
    },
    {
        number: "04",
        title: "Projects",
        description:
            "Maintain your project portfolio so your practical work becomes part of your overall placement preparation picture.",
        path: "/projects"
    },
    {
        number: "05",
        title: "Certifications",
        description:
            "Store your certifications and credentials so your additional learning and achievements stay connected to your placement profile.",
        path: "/certifications"
    },
    {
        number: "06",
        title: "Resume",
        description:
            "Upload and manage resumes, keep an active resume, view the PDF, update resume information and analyze resume quality with ATS scoring.",
        path: "/resumes"
    },
    {
        number: "07",
        title: "Readiness",
        description:
            "See a transparent placement-readiness score built from measurable signals such as CGPA, resume ATS, projects, coding, skills and certifications.",
        path: "/readiness"
    },
    {
        number: "08",
        title: "Weekly Plan",
        description:
            "Turn your preparation into actionable weekly tasks. AI can generate a structured plan and tasks are categorized so progress can be tracked properly.",
        path: "/weekly-plan"
    },
    {
        number: "09",
        title: "Progress",
        description:
            "Create progress snapshots and use AI analysis to understand what has changed in your preparation over time.",
        path: "/progress"
    },
    {
        number: "10",
        title: "Dashboard",
        description:
            "Bring your placement information together into one overview so you can quickly understand what is happening across your preparation.",
        path: "/dashboard"
    }
];

const workflow = [
    "Build your profile",
    "Add your skills, projects and certifications",
    "Track coding and resume progress",
    "Review your placement readiness",
    "Generate and follow weekly preparation plans",
    "Compare progress over time"
];

function AboutPlaceMate() {
    return (
        <div className="about-page">
            <section className="about-hero">
                <div className="about-eyebrow">
                    <span className="about-eyebrow-dot" />
                    ABOUT PLACEMATE
                </div>

                <h1>
                    Your placement preparation,
                    <span> in one workspace.</span>
                </h1>

                <p className="about-hero-description">
                    PlaceMate is an AI-powered placement preparation
                    platform designed to help students understand where
                    they currently stand, organize their preparation,
                    track progress and decide what to work on next.
                </p>

                <div className="about-hero-actions">
                    <Link
                        to="/dashboard"
                        className="about-primary-button"
                    >
                        Go to dashboard
                        <span>→</span>
                    </Link>

                    <Link
                        to="/readiness"
                        className="about-secondary-button"
                    >
                        View readiness
                    </Link>
                </div>
            </section>

            <section className="about-purpose">
                <div className="about-section-heading">
                    <span className="about-label">
                        THE IDEA
                    </span>

                    <h2>
                        Why PlaceMate exists
                    </h2>

                    <p>
                        Placement preparation is usually spread across
                        resumes, coding platforms, project notes,
                        certificates, study plans and personal trackers.
                        PlaceMate brings those signals together into one
                        continuous preparation workspace.
                    </p>
                </div>

                <div className="about-purpose-grid">
                    <div className="about-purpose-card">
                        <span className="about-card-number">
                            01
                        </span>

                        <h3>
                            Know your current state
                        </h3>

                        <p>
                            Keep the important preparation signals in one
                            place instead of checking disconnected tools.
                        </p>
                    </div>

                    <div className="about-purpose-card">
                        <span className="about-card-number">
                            02
                        </span>

                        <h3>
                            Find what needs attention
                        </h3>

                        <p>
                            Readiness and progress views turn your stored
                            preparation data into a clearer picture of
                            strengths and areas that need development.
                        </p>
                    </div>

                    <div className="about-purpose-card">
                        <span className="about-card-number">
                            03
                        </span>

                        <h3>
                            Keep moving
                        </h3>

                        <p>
                            Weekly planning and progress tracking turn
                            preparation into an ongoing process rather than
                            a last-minute activity.
                        </p>
                    </div>
                </div>
            </section>

            <section className="about-section">
                <div className="about-section-heading">
                    <span className="about-label">
                        WHAT'S INSIDE
                    </span>

                    <h2>
                        Everything PlaceMate brings together
                    </h2>

                    <p>
                        Each part of PlaceMate focuses on one area of
                        placement preparation while contributing to the
                        larger picture.
                    </p>
                </div>

                <div className="about-feature-grid">
                    {features.map((feature) => (
                        <Link
                            key={feature.number}
                            to={feature.path}
                            className="about-feature-card"
                        >
                            <div className="about-feature-top">
                                <span className="about-feature-number">
                                    {feature.number}
                                </span>

                                <span className="about-feature-arrow">
                                    ↗
                                </span>
                            </div>

                            <h3>
                                {feature.title}
                            </h3>

                            <p>
                                {feature.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="about-section">
                <div className="about-section-heading">
                    <span className="about-label">
                        HOW IT WORKS
                    </span>

                    <h2>
                        Your preparation loop
                    </h2>

                    <p>
                        PlaceMate is meant to be used continuously. Your
                        preparation data becomes more useful as you keep
                        updating it.
                    </p>
                </div>

                <div className="about-workflow">
                    {workflow.map((step, index) => (
                        <div
                            className="about-workflow-step"
                            key={step}
                        >
                            <div className="about-workflow-number">
                                {String(index + 1).padStart(2, "0")}
                            </div>

                            <div>
                                <strong>
                                    {step}
                                </strong>

                                {index < workflow.length - 1 && (
                                    <span className="about-workflow-arrow">
                                        ↓
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="about-architecture">
                <div className="about-section-heading">
                    <span className="about-label">
                        UNDER THE HOOD
                    </span>

                    <h2>
                        How PlaceMate is structured
                    </h2>

                    <p>
                        The application follows a frontend-to-backend
                        architecture where the React interface communicates
                        with protected Express APIs and the backend manages
                        business logic and persistent student data.
                    </p>
                </div>

                <div className="about-architecture-flow">
                    <div className="about-tech-node">
                        <span>01</span>
                        <strong>React</strong>
                        <small>Frontend</small>
                    </div>

                    <div className="about-flow-arrow">→</div>

                    <div className="about-tech-node">
                        <span>02</span>
                        <strong>Express.js</strong>
                        <small>API layer</small>
                    </div>

                    <div className="about-flow-arrow">→</div>

                    <div className="about-tech-node">
                        <span>03</span>
                        <strong>Services</strong>
                        <small>Business logic</small>
                    </div>

                    <div className="about-flow-arrow">→</div>

                    <div className="about-tech-node">
                        <span>04</span>
                        <strong>MongoDB</strong>
                        <small>Data storage</small>
                    </div>
                </div>

                <div className="about-tech-grid">
                    <div>
                        <span>Frontend</span>
                        <strong>React + Vite</strong>
                    </div>

                    <div>
                        <span>Backend</span>
                        <strong>Node.js + Express</strong>
                    </div>

                    <div>
                        <span>Database</span>
                        <strong>MongoDB + Mongoose</strong>
                    </div>

                    <div>
                        <span>Authentication</span>
                        <strong>JWT</strong>
                    </div>

                    <div>
                        <span>File storage</span>
                        <strong>MongoDB GridFS</strong>
                    </div>

                    <div>
                        <span>AI</span>
                        <strong>Groq-powered services</strong>
                    </div>
                </div>
            </section>

            <section className="about-ai">
                <div>
                    <span className="about-label">
                        AI IN PLACEMATE
                    </span>

                    <h2>
                        AI is used to make preparation more actionable.
                    </h2>

                    <p>
                        PlaceMate uses AI where structured analysis can
                        help: generating weekly plans, analyzing progress
                        changes and supporting resume-related analysis.
                        The goal is to turn the data you maintain into
                        useful preparation information.
                    </p>
                </div>

                <div className="about-ai-points">
                    <div>
                        <span>✦</span>
                        <strong>Weekly plan generation</strong>
                    </div>

                    <div>
                        <span>✦</span>
                        <strong>Progress comparison</strong>
                    </div>

                    <div>
                        <span>✦</span>
                        <strong>Resume analysis</strong>
                    </div>
                </div>
            </section>

            <section className="about-final">
                <span className="about-label">
                    PLACE MATE
                </span>

                <h2>
                    Prepare with context.
                    <br />
                    Track with clarity.
                    <br />
                    Improve continuously.
                </h2>

                <p>
                    PlaceMate is your central workspace for building,
                    measuring and improving your placement preparation.
                </p>

                <Link
                    to="/dashboard"
                    className="about-primary-button"
                >
                    Open PlaceMate
                    <span>→</span>
                </Link>
            </section>
        </div>
    );
}

export default AboutPlaceMate;
