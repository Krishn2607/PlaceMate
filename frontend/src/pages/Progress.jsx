import { useEffect, useState } from "react";

import {
    TrendingUp,
    Target,
    Brain,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    ArrowUpRight,
    RefreshCw
} from "lucide-react";

import {
    getCurrentProgress,
    generateProgress
} from "../services/progressService";

import "./Progress.css";


function Progress() {

    const [progress, setProgress] =
        useState(null);

    const [analysis, setAnalysis] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [generating, setGenerating] =
        useState(false);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadProgress = async () => {

            try {

                const result =
                    await getCurrentProgress();

                setProgress(result);

            } catch {

                setProgress(null);

            } finally {

                setLoading(false);

            }
        };


        loadProgress();

    }, []);


    const handleAskAI = async () => {

        try {

            setGenerating(true);
            setError("");

            const result =
                await generateProgress();

            setProgress(
                result.snapshot
            );

            setAnalysis(
                result.analysis
            );

        } catch (error) {

            console.error(
                "Progress AI error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to generate progress analysis."
            );

        } finally {

            setGenerating(false);

        }
    };


    if (loading) {

        return (
            <div className="page-loading">
                Loading progress...
            </div>
        );

    }


    const projectCount =
        progress?.projectCount ?? 0;

    const certificationCount =
        progress?.certificationCount ?? 0;

    const codingStats =
        progress?.codingStats || [];

    const totalProblems =
        codingStats.reduce(
            (total, profile) =>
                total +
                (profile.problemsSolved || 0),
            0
        );

    const atsScore =
        progress?.atsScore ?? 0;

    const skills =
        progress?.skills || [];


    return (

        <div className="progress-page">

            {/* HERO */}

            <div className="progress-hero">

                <div>

                    <div className="eyebrow">
                        PROGRESS
                    </div>

                    <h1>
                        See how your preparation is moving.
                    </h1>

                    <p>
                        Ask AI to compare your current
                        progress with your previous snapshot.
                    </p>

                </div>


                <button
                    className="progress-ai-button"
                    onClick={handleAskAI}
                    disabled={generating}
                >

                    {generating ? (
                        <>
                            <RefreshCw
                                size={18}
                                className="spin"
                            />

                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} />

                            Ask AI About My Progress
                        </>
                    )}

                </button>

            </div>


            {error && (

                <div className="progress-error">
                    {error}
                </div>

            )}


            {/* CURRENT PROGRESS */}

            <section className="progress-section">

                <div className="section-heading">

                    <div>

                        <div className="card-eyebrow">
                            CURRENT STATE
                        </div>

                        <h2>
                            Your preparation
                        </h2>

                    </div>

                    {progress && (
                        <span className="snapshot-date">
                            Snapshot saved
                        </span>
                    )}

                </div>


                <div className="progress-stat-grid">

                    <div className="progress-stat-card">

                        <div className="progress-stat-icon">
                            <Target size={20} />
                        </div>

                        <div className="progress-stat-value">
                            {projectCount}
                        </div>

                        <div className="progress-stat-label">
                            Projects
                        </div>

                    </div>


                    <div className="progress-stat-card">

                        <div className="progress-stat-icon">
                            <CheckCircle2 size={20} />
                        </div>

                        <div className="progress-stat-value">
                            {certificationCount}
                        </div>

                        <div className="progress-stat-label">
                            Certifications
                        </div>

                    </div>


                    <div className="progress-stat-card">

                        <div className="progress-stat-icon">
                            <TrendingUp size={20} />
                        </div>

                        <div className="progress-stat-value">
                            {totalProblems}
                        </div>

                        <div className="progress-stat-label">
                            Problems solved
                        </div>

                    </div>


                    <div className="progress-stat-card">

                        <div className="progress-stat-icon">
                            <Brain size={20} />
                        </div>

                        <div className="progress-stat-value">
                            {atsScore}
                        </div>

                        <div className="progress-stat-label">
                            Resume ATS
                        </div>

                    </div>

                </div>

            </section>


            {/* SKILLS */}

            <section className="progress-section">

                <div className="section-heading">

                    <div>

                        <div className="card-eyebrow">
                            SKILLS
                        </div>

                        <h2>
                            Current skill levels
                        </h2>

                    </div>

                </div>


                {skills.length === 0 ? (

                    <div className="progress-empty">
                        No skills added yet.
                    </div>

                ) : (

                    <div className="skills-grid">

                        {skills.map((skill) => (

                            <div
                                className="skill-card"
                                key={skill.name}
                            >

                                <div className="skill-card-top">

                                    <span>
                                        {skill.name}
                                    </span>

                                    <strong>
                                        {skill.selfLevel}/5
                                    </strong>

                                </div>


                                <div className="skill-bar">

                                    <div
                                        className="skill-bar-fill"
                                        style={{
                                            width:
                                                `${(
                                                    skill.selfLevel / 5
                                                ) * 100}%`
                                        }}
                                    />

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>


            {/* AI ANALYSIS */}

            {analysis && (

                <section className="ai-progress-section">

                    <div className="ai-progress-header">

                        <div className="ai-title">

                            <div className="ai-icon">
                                <Sparkles size={20} />
                            </div>

                            <div>

                                <div className="card-eyebrow">
                                    AI PROGRESS ANALYSIS
                                </div>

                                <h2>
                                    What changed?
                                </h2>

                            </div>

                        </div>

                    </div>


                    {/* SUMMARY */}

                    <div className="ai-summary">

                        <div className="ai-summary-icon">
                            <ArrowUpRight size={20} />
                        </div>

                        <div>

                            <div className="ai-label">
                                SUMMARY
                            </div>

                            <p>
                                {analysis.summary}
                            </p>

                        </div>

                    </div>


                    <div className="ai-analysis-grid">

                        {/* STRENGTHS */}

                        <div className="ai-analysis-card">

                            <div className="ai-analysis-card-header">

                                <CheckCircle2 size={19} />

                                <h3>
                                    Strengths
                                </h3>

                            </div>


                            {analysis.strengths?.length > 0 ? (

                                <ul>

                                    {analysis.strengths.map(
                                        (item, index) => (

                                            <li key={index}>
                                                {item}
                                            </li>

                                        )
                                    )}

                                </ul>

                            ) : (

                                <p className="ai-empty">
                                    No specific strengths identified.
                                </p>

                            )}

                        </div>


                        {/* IMPROVEMENTS */}

                        <div className="ai-analysis-card">

                            <div className="ai-analysis-card-header">

                                <AlertCircle size={19} />

                                <h3>
                                    Improvements
                                </h3>

                            </div>


                            {analysis.improvements?.length > 0 ? (

                                <ul>

                                    {analysis.improvements.map(
                                        (item, index) => (

                                            <li key={index}>
                                                {item}
                                            </li>

                                        )
                                    )}

                                </ul>

                            ) : (

                                <p className="ai-empty">
                                    No specific improvements identified.
                                </p>

                            )}

                        </div>

                    </div>


                    {/* NEXT STEPS */}

                    <div className="ai-next-steps">

                        <div className="ai-analysis-card-header">

                            <Target size={19} />

                            <h3>
                                Next Steps
                            </h3>

                        </div>


                        {analysis.nextSteps?.length > 0 ? (

                            <div className="next-step-list">

                                {analysis.nextSteps.map(
                                    (item, index) => (

                                        <div
                                            className="next-step"
                                            key={index}
                                        >

                                            <span>
                                                {index + 1}
                                            </span>

                                            <p>
                                                {item}
                                            </p>

                                        </div>

                                    )
                                )}

                            </div>

                        ) : (

                            <p className="ai-empty">
                                No next steps were generated.
                            </p>

                        )}

                    </div>

                </section>

            )}


            {/* EMPTY AI STATE */}

            {!analysis && (

                <section className="progress-ai-empty">

                    <div className="progress-ai-empty-icon">
                        <Sparkles size={24} />
                    </div>

                    <h2>
                        Want to know how you're progressing?
                    </h2>

                    <p>
                        Generate an AI progress analysis to compare
                        your current preparation with your previous
                        snapshot.
                    </p>

                    <button
                        className="progress-ai-button secondary"
                        onClick={handleAskAI}
                        disabled={generating}
                    >

                        <Sparkles size={17} />

                        {generating
                            ? "Analyzing..."
                            : "Analyze My Progress"
                        }

                    </button>

                </section>

            )}

        </div>

    );
}


export default Progress;