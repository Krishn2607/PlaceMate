import { useEffect, useMemo, useState } from "react";

import {
    GraduationCap,
    FileText,
    FolderKanban,
    Award,
    Code2,
    Brain,
    TrendingUp,
    Target,
    Sparkles,
    RefreshCw
} from "lucide-react";

import { getProfile } from "../services/profileService";
import { getCurrentProgress } from "../services/progressService";

import "./Readiness.css";


function Readiness() {

    const [profile, setProfile] =
        useState(null);

    const [progress, setProgress] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        const loadData = async () => {

            try {

                const [
                    profileData,
                    progressData
                ] = await Promise.all([
                    getProfile(),
                    getCurrentProgress()
                ]);

                setProfile(profileData);
                setProgress(progressData);

            } catch (error) {

                console.error(
                    "Failed to load readiness data:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };


        loadData();

    }, []);


    const readiness = useMemo(() => {

        const cgpa =
            Number(profile?.profile?.cgpa || 0);

        const atsScore =
            Number(progress?.atsScore || 0);

        const projectCount =
            Number(progress?.projectCount || 0);

        const certificationCount =
            Number(
                progress?.certificationCount || 0
            );

        const codingStats =
            progress?.codingStats || [];

        const skills =
            progress?.skills || [];


        /*
         * ----------------------------------------
         * INDIVIDUAL READINESS SCORES
         * ----------------------------------------
         */

        // CGPA
        const cgpaScore =
            Math.min(
                Math.round((cgpa / 10) * 100),
                100
            );


        // Resume ATS
        const resumeScore =
            Math.min(
                Math.max(atsScore, 0),
                100
            );


        // Projects
        // 3 meaningful projects = full score
        const projectScore =
            Math.min(
                Math.round(
                    (projectCount / 3) * 100
                ),
                100
            );


        // Certifications
        // 2 certifications = full score
        const certificationScore =
            Math.min(
                Math.round(
                    (certificationCount / 2) * 100
                ),
                100
            );


        // Coding
        const totalProblems =
            codingStats.reduce(
                (total, profile) =>
                    total +
                    Number(
                        profile.problemsSolved || 0
                    ),
                0
            );

        // 100 solved problems = full score
        const codingScore =
            Math.min(
                Math.round(
                    (totalProblems / 100) * 100
                ),
                100
            );


        // Skills
        const skillScore =
            skills.length === 0
                ? 0
                : Math.min(
                    Math.round(
                        (
                            skills.reduce(
                                (total, skill) =>
                                    total +
                                    Number(
                                        skill.selfLevel || 0
                                    ),
                                0
                            ) /
                            skills.length
                        ) *
                        20
                    ),
                    100
                );


        /*
         * ----------------------------------------
         * OVERALL READINESS
         * ----------------------------------------
         */

        const overallScore =
            Math.round(
                (
                    cgpaScore * 0.20 +
                    resumeScore * 0.20 +
                    projectScore * 0.20 +
                    codingScore * 0.20 +
                    skillScore * 0.10 +
                    certificationScore * 0.10
                )
            );


        const scores = [
            {
                name: "CGPA",
                score: cgpaScore,
                rawValue:
                    cgpa > 0
                        ? `${cgpa.toFixed(2)} / 10`
                        : "Not added",
                description:
                    cgpa > 0
                        ? "Academic performance"
                        : "Add your CGPA",
                icon: GraduationCap
            },

            {
                name: "Resume ATS",
                score: resumeScore,
                rawValue:
                    `${resumeScore} / 100`,
                description:
                    resumeScore > 0
                        ? "Resume compatibility"
                        : "Analyze your resume",
                icon: FileText
            },

            {
                name: "Projects",
                score: projectScore,
                rawValue:
                    `${projectCount} project${
                        projectCount === 1
                            ? ""
                            : "s"
                    }`,
                description:
                    "Practical experience",
                icon: FolderKanban
            },

            {
                name: "Certifications",
                score: certificationScore,
                rawValue:
                    `${certificationCount} certification${
                        certificationCount === 1
                            ? ""
                            : "s"
                    }`,
                description:
                    "Additional credentials",
                icon: Award
            },

            {
                name: "Coding",
                score: codingScore,
                rawValue:
                    `${totalProblems} problem${
                        totalProblems === 1
                            ? ""
                            : "s"
                    }`,
                description:
                    "Problem-solving practice",
                icon: Code2
            },

            {
                name: "Skills",
                score: skillScore,
                rawValue:
                    skills.length > 0
                        ? `${skills.length} skill${
                            skills.length === 1
                                ? ""
                                : "s"
                        }`
                        : "No skills",
                description:
                    "Self-rated technical skills",
                icon: Brain
            }
        ];


        return {
            overallScore,
            scores,
            totalProblems,
            projectCount,
            certificationCount,
            skills
        };

    }, [profile, progress]);


    const readinessStatus =
        readiness.overallScore >= 80
            ? {
                label: "Strong foundation",
                className: "strong"
            }
            : readiness.overallScore >= 60
                ? {
                    label: "On track",
                    className: "on-track"
                }
                : readiness.overallScore >= 40
                    ? {
                        label: "Needs development",
                        className: "developing"
                    }
                    : {
                        label: "Early stage",
                        className: "early"
                    };


    const biggestOpportunity =
        [...readiness.scores]
            .sort(
                (a, b) =>
                    a.score - b.score
            )[0];


    const strongestSignal =
        [...readiness.scores]
            .sort(
                (a, b) =>
                    b.score - a.score
            )[0];


    if (loading) {

        return (
            <div className="readiness-page">

                <div className="readiness-loading">

                    <RefreshCw
                        size={22}
                        className="readiness-spinner"
                    />

                    <p>
                        Calculating your readiness...
                    </p>

                </div>

            </div>
        );

    }


    return (

        <div className="readiness-page">

            {/* HERO */}

            <section className="readiness-hero">

                <div>

                    <div className="eyebrow">
                        READINESS CENTER
                    </div>

                    <h1>
                        Know exactly where you stand.
                    </h1>

                    <p>
                        A transparent view of the signals
                        that shape your placement preparation.
                    </p>

                </div>

            </section>


            {/* MAIN READINESS */}

            <div className="readiness-layout">

                <div className="large-readiness-card">

                    <div className="readiness-score-wrapper">

                        <div className="big-score-circle">

                            <strong>
                                {readiness.overallScore}
                            </strong>

                            <span>
                                /100
                            </span>

                        </div>

                    </div>


                    <span
                        className={
                            `readiness-badge ${readinessStatus.className}`
                        }
                    >
                        ● {readinessStatus.label}
                    </span>


                    <h2>
                        Your placement preparation snapshot.
                    </h2>


                    <p>
                        This score is calculated from your
                        current academic profile, resume,
                        projects, coding practice, skills
                        and certifications.
                    </p>


                    <div className="readiness-note">

                        <Target size={16} />

                        <span>
                            The score is based on measurable
                            data already available in PlaceMate.
                        </span>

                    </div>

                </div>


                {/* SCORE BREAKDOWN */}

                <div className="score-card">

                    <div className="score-card-header">

                        <div>

                            <h2>
                                Score breakdown
                            </h2>

                            <p>
                                Current readiness signals
                            </p>

                        </div>

                    </div>


                    <div className="score-list">

                        {readiness.scores.map(
                            (item) => {

                                const Icon =
                                    item.icon;

                                return (

                                    <div
                                        className="score-row"
                                        key={item.name}
                                    >

                                        <div className="score-row-icon">

                                            <Icon size={17} />

                                        </div>


                                        <div className="score-info">

                                            <div className="score-name-row">

                                                <div>

                                                    <strong>
                                                        {item.name}
                                                    </strong>

                                                    <span>
                                                        {item.description}
                                                    </span>

                                                </div>

                                                <strong className="score-number">
                                                    {item.score}
                                                </strong>

                                            </div>


                                            <div className="score-track">

                                                <div
                                                    className="score-fill"
                                                    style={{
                                                        width:
                                                            `${item.score}%`
                                                    }}
                                                />

                                            </div>


                                            <div className="score-raw">
                                                {item.rawValue}
                                            </div>

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                </div>

            </div>


            {/* INTERPRETATION */}

            <section className="readiness-section">

                <div className="eyebrow">
                    READINESS INTERPRETATION
                </div>

                <h2>
                    What your current signals mean.
                </h2>

                <div className="readiness-insight-grid">


                    {/* STRONGEST */}

                    <div className="readiness-insight-card">

                        <div className="insight-icon success">
                            <TrendingUp size={19} />
                        </div>

                        <div>

                            <span className="insight-label">
                                STRONGEST SIGNAL
                            </span>

                            <h3>
                                {strongestSignal.name}
                            </h3>

                            <p>
                                {strongestSignal.score}/100
                                based on your current
                                {` ${strongestSignal.name.toLowerCase()}`}
                                data.
                            </p>

                        </div>

                    </div>


                    {/* OPPORTUNITY */}

                    <div className="readiness-insight-card">

                        <div className="insight-icon warning">
                            <Target size={19} />
                        </div>

                        <div>

                            <span className="insight-label">
                                BIGGEST OPPORTUNITY
                            </span>

                            <h3>
                                {biggestOpportunity.name}
                            </h3>

                            <p>
                                This is currently your
                                lowest readiness signal at
                                {` ${biggestOpportunity.score}/100`}.
                                Improving it would raise
                                your overall score.
                            </p>

                        </div>

                    </div>


                    {/* NEXT CHECKPOINT */}

                    <div className="readiness-insight-card">

                        <div className="insight-icon ai">
                            <Sparkles size={19} />
                        </div>

                        <div>

                            <span className="insight-label">
                                NEXT CHECKPOINT
                            </span>

                            <h3>
                                Improve your weakest signal
                            </h3>

                            <p>
                                Focus on{" "}
                                <strong>
                                    {biggestOpportunity.name}
                                </strong>{" "}
                                before your next Progress
                                snapshot.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* HOW SCORE WORKS */}

            <section className="readiness-method-card">

                <div className="method-header">

                    <div className="method-icon">
                        <Brain size={20} />
                    </div>

                    <div>

                        <div className="eyebrow">
                            TRANSPARENT MODEL
                        </div>

                        <h2>
                            How your readiness score works
                        </h2>

                    </div>

                </div>


                <div className="weight-grid">

                    <div>
                        <strong>20%</strong>
                        <span>CGPA</span>
                    </div>

                    <div>
                        <strong>20%</strong>
                        <span>Resume ATS</span>
                    </div>

                    <div>
                        <strong>20%</strong>
                        <span>Projects</span>
                    </div>

                    <div>
                        <strong>20%</strong>
                        <span>Coding</span>
                    </div>

                    <div>
                        <strong>10%</strong>
                        <span>Skills</span>
                    </div>

                    <div>
                        <strong>10%</strong>
                        <span>Certifications</span>
                    </div>

                </div>


                <p className="method-description">
                    PlaceMate uses your actual profile and
                    preparation data to calculate these signals.
                    The model is intentionally transparent so
                    you can understand what is affecting your
                    readiness score.
                </p>

            </section>

        </div>

    );
}


export default Readiness;