import { useEffect, useState } from "react";

import {
  Check,
  Edit3,
  FileText,
  Sparkles,
  Trash2,
  Upload,
  X,
  WandSparkles,
} from "lucide-react";

import {
  getResumes,
  uploadResume,
  updateResume,
  deleteResume,
  activateResume,
  getResumeFile,
  analyzeResume,
  generateResume,
} from "../services/resumeService";

import { getProjects } from "../services/projectService";
import { getCertifications } from "../services/certificationservice"  ;

import "./Resumes.css";

function Resumes() {
  const [resumes, setResumes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [loadingGeneratorData, setLoadingGeneratorData] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnalyzeModal, setShowAnalyzeModal] =
    useState(false);
  const [showGenerateModal, setShowGenerateModal] =
    useState(false);

  const [selectedResume, setSelectedResume] = useState(null);

  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [targetRole, setTargetRole] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const [selectedProjectIds, setSelectedProjectIds] =
    useState([]);

  const [
    selectedCertificationIds,
    setSelectedCertificationIds,
  ] = useState([]);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getResumes();

      setResumes(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load resumes."
      );
    } finally {
      setLoading(false);
    }
  };

  const activeResume = resumes.find(
    (resume) => resume.isActive
  );

  /* =========================
     UPLOAD
  ========================= */

  const openUploadModal = () => {
    setTitle("");
    setSelectedFile(null);
    setError("");
    setSuccess("");
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    if (saving) return;

    setShowUploadModal(false);
    setTitle("");
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Only PDF resumes are allowed.");
      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    setError("");
    setSelectedFile(file);

    if (!title) {
      setTitle(
        file.name
          .replace(/\.pdf$/i, "")
          .trim()
      );
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Resume title is required.");
      return;
    }

    if (!selectedFile) {
      setError("Please select a PDF resume.");
      return;
    }

    try {
      setSaving(true);

      const resume = await uploadResume(
        selectedFile,
        title.trim()
      );

      setResumes((previous) => [
        resume,
        ...previous,
      ]);

      setShowUploadModal(false);
      setTitle("");
      setSelectedFile(null);

      setSuccess(
        "Resume uploaded successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to upload resume."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     EDIT
  ========================= */

  const openEditModal = (resume) => {
    setSelectedResume(resume);
    setTitle(resume.title || "");
    setError("");
    setSuccess("");
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    if (saving) return;

    setShowEditModal(false);
    setSelectedResume(null);
    setTitle("");
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!selectedResume) return;

    if (!title.trim()) {
      setError("Resume title is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedResume =
        await updateResume(
          selectedResume._id,
          title.trim()
        );

      setResumes((previous) =>
        previous.map((resume) =>
          resume._id === updatedResume._id
            ? updatedResume
            : resume
        )
      );

      setShowEditModal(false);
      setSelectedResume(null);
      setTitle("");

      setSuccess(
        "Resume title updated successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update resume."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     ACTIVATE
  ========================= */

  const handleActivate = async (resume) => {
    try {
      setError("");
      setSuccess("");

      const activatedResume =
        await activateResume(resume._id);

      setResumes((previous) =>
        previous.map((item) => ({
          ...item,
          isActive:
            item._id === activatedResume._id,
        }))
      );

      setSuccess(
        `"${resume.title}" is now your active resume.`
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to activate resume."
      );
    }
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (resume) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${resume.title}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteResume(resume._id);

      setResumes((previous) =>
        previous.filter(
          (item) => item._id !== resume._id
        )
      );

      setSuccess(
        "Resume deleted successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete resume."
      );
    }
  };

  /* =========================
     VIEW PDF
  ========================= */

  const handleViewResume = async (resume) => {
    try {
      setError("");

      const blob = await getResumeFile(
        resume._id
      );

      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to open resume."
      );
    }
  };

  /* =========================
     AI ANALYSIS
  ========================= */

  const openAnalyzeModal = (resume) => {
    setSelectedResume(resume);
    setTargetRole("");
    setAnalysis(null);
    setError("");
    setSuccess("");
    setShowAnalyzeModal(true);
  };

  const closeAnalyzeModal = () => {
    if (analyzing) return;

    setShowAnalyzeModal(false);
    setSelectedResume(null);
    setTargetRole("");
    setAnalysis(null);
  };

  const handleAnalyze = async (event) => {
    event.preventDefault();

    if (!selectedResume) return;

    if (!targetRole.trim()) {
      setError("Target role is required.");
      return;
    }

    try {
      setAnalyzing(true);
      setError("");
      setAnalysis(null);

      const result = await analyzeResume(
        selectedResume._id,
        targetRole.trim()
      );

      setAnalysis(result.analysis);

      setResumes((previous) =>
        previous.map((resume) =>
          resume._id === selectedResume._id
            ? {
                ...resume,
                atsScore:
                  result.analysis?.atsScore ??
                  resume.atsScore,
                aiAnalysis:
                  result.analysis
                    ? {
                        summary:
                          result.analysis.summary,
                        strengths:
                          result.analysis.strengths,
                        weaknesses: [],
                        missingSkills:
                          result.analysis
                            .missingSkills,
                        suggestions:
                          result.analysis
                            .improvements,
                        aiEraReadiness:
                          result.analysis
                            .aiEraReadiness,
                      }
                    : resume.aiAnalysis,
              }
            : resume
        )
      );

      setSuccess(
        "Resume analyzed successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to analyze resume."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  /* =========================
     AI RESUME GENERATOR
  ========================= */

  const openGenerateModal = async () => {
    setError("");
    setSuccess("");

    setTargetRole("");
    setSelectedProjectIds([]);
    setSelectedCertificationIds([]);

    setShowGenerateModal(true);

    try {
      setLoadingGeneratorData(true);

      const [
        projectData,
        certificationData,
      ] = await Promise.all([
        getProjects(),
        getCertifications(),
      ]);

      setProjects(projectData);
      setCertifications(certificationData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load projects and certifications."
      );
    } finally {
      setLoadingGeneratorData(false);
    }
  };

  const closeGenerateModal = () => {
    if (generating) return;

    setShowGenerateModal(false);
    setTargetRole("");
    setSelectedProjectIds([]);
    setSelectedCertificationIds([]);
  };

  const toggleProject = (projectId) => {
    setSelectedProjectIds((previous) =>
      previous.includes(projectId)
        ? previous.filter(
            (id) => id !== projectId
          )
        : [...previous, projectId]
    );
  };

  const toggleCertification = (
    certificationId
  ) => {
    setSelectedCertificationIds((previous) =>
      previous.includes(certificationId)
        ? previous.filter(
            (id) => id !== certificationId
          )
        : [
            ...previous,
            certificationId,
          ]
    );
  };

  const handleGenerateResume = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!targetRole.trim()) {
      setError("Target role is required.");
      return;
    }

    try {
      setGenerating(true);

      const generatedResume =
        await generateResume(
          selectedProjectIds,
          selectedCertificationIds,
          targetRole.trim()
        );

      setResumes((previous) => [
        generatedResume,
        ...previous,
      ]);

      setShowGenerateModal(false);

      setTargetRole("");
      setSelectedProjectIds([]);
      setSelectedCertificationIds([]);

      setSuccess(
        "AI-generated resume created successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to generate resume."
      );
    } finally {
      setGenerating(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="resumes-page">
        <div className="resume-loading">
          <div className="resume-spinner" />
          <p>Loading resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="resumes-page">

      {/* HEADER */}

      <div className="resumes-header">

        <div className="resume-header-copy">
          <p className="resume-eyebrow">
            RESUME WORKSPACE
          </p>

          <h1>
            One resume. Built for the role you want.
          </h1>

          <p className="resume-description">
            Track resume versions, ATS performance,
            and AI-powered feedback.
          </p>
        </div>

        <div className="resume-header-actions">

          <button
            type="button"
            className="resume-secondary-button"
            onClick={openGenerateModal}
          >
            <WandSparkles size={17} />
            Generate with AI
          </button>

          <button
            type="button"
            className="resume-primary-button"
            onClick={openUploadModal}
          >
            <Upload size={17} />
            Upload Resume
          </button>

        </div>

      </div>

      {/* MESSAGES */}

      {error && (
        <div className="resume-message resume-error">
          {error}
        </div>
      )}

      {success && (
        <div className="resume-message resume-success">
          {success}
        </div>
      )}

      {/* ACTIVE RESUME */}

      {activeResume ? (
        <div className="active-resume-card">

          <div className="resume-preview">
            <div className="resume-paper">

              <div className="paper-top">
                <div className="paper-avatar" />

                <div className="paper-heading">
                  <span />
                  <span />
                </div>
              </div>

              <div className="paper-section">
                <span />
                <span />
                <span />
              </div>

              <div className="paper-section">
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="paper-section">
                <span />
                <span />
                <span />
              </div>

            </div>
          </div>

          <div className="active-resume-details">

            <div className="active-badge">
              <Check size={13} />
              Active Resume
            </div>

            <h2>
              {activeResume.title}
            </h2>

            <p className="resume-meta">
              PDF · Current active version
            </p>

            <div className="ats-section">

              <div className="ats-header">
                <span>ATS SCORE</span>

                <strong>
                  {activeResume.atsScore || 0}
                  <small>/100</small>
                </strong>
              </div>

              <div className="ats-track">
                <div
                  style={{
                    width: `${
                      activeResume.atsScore || 0
                    }%`,
                  }}
                />
              </div>

            </div>

            <div className="resume-action-row">

              <button
                type="button"
                className="resume-primary-button"
                onClick={() =>
                  openAnalyzeModal(activeResume)
                }
              >
                <Sparkles size={17} />
                Analyze with AI
              </button>

              <button
                type="button"
                className="resume-secondary-button"
                onClick={() =>
                  handleViewResume(activeResume)
                }
              >
                <FileText size={17} />
                View PDF
              </button>

              <button
                type="button"
                className="resume-secondary-button"
                onClick={openGenerateModal}
              >
                <WandSparkles size={17} />
                Generate New
              </button>

            </div>

          </div>

        </div>
      ) : (
        <div className="resume-empty">

          <div className="resume-empty-icon">
            <FileText size={26} />
          </div>

          <h2>
            No active resume
          </h2>

          <p>
            Upload a resume or generate one with AI
            to start building your resume workspace.
          </p>

          <div className="resume-action-row">

            <button
              type="button"
              className="resume-primary-button"
              onClick={openUploadModal}
            >
              <Upload size={17} />
              Upload Resume
            </button>

            <button
              type="button"
              className="resume-secondary-button"
              onClick={openGenerateModal}
            >
              <WandSparkles size={17} />
              Generate with AI
            </button>

          </div>

        </div>
      )}

      {/* RESUME LIST */}

      <div className="resume-section-header">

        <div>
          <p className="resume-eyebrow">
            YOUR RESUMES
          </p>

          <h2>
            Resume versions
          </h2>
        </div>

        <span className="resume-count">
          {resumes.length}{" "}
          {resumes.length === 1
            ? "resume"
            : "resumes"}
        </span>

      </div>

      {resumes.length > 0 ? (
        <div className="resume-list">

          {resumes.map((resume) => (
            <div
              className={`resume-list-card ${
                resume.isActive
                  ? "is-active"
                  : ""
              }`}
              key={resume._id}
            >

              <div className="resume-list-icon">
                <FileText size={20} />
              </div>

              <div className="resume-list-main">

                <div className="resume-list-title">
                  <h3>
                    {resume.title}
                  </h3>

                  {resume.isActive && (
                    <span className="mini-active">
                      Active
                    </span>
                  )}
                </div>

                <p>
                  ATS Score:{" "}
                  <strong>
                    {resume.atsScore || 0}/100
                  </strong>
                </p>

              </div>

              <div className="resume-list-actions">

                <button
                  type="button"
                  className="resume-icon-button"
                  title="View PDF"
                  onClick={() =>
                    handleViewResume(resume)
                  }
                >
                  <FileText size={16} />
                </button>

                <button
                  type="button"
                  className="resume-icon-button"
                  title="Edit title"
                  onClick={() =>
                    openEditModal(resume)
                  }
                >
                  <Edit3 size={16} />
                </button>

                <button
                  type="button"
                  className="resume-icon-button"
                  title="Analyze with AI"
                  onClick={() =>
                    openAnalyzeModal(resume)
                  }
                >
                  <Sparkles size={16} />
                </button>

                {!resume.isActive && (
                  <button
                    type="button"
                    className="resume-small-button"
                    onClick={() =>
                      handleActivate(resume)
                    }
                  >
                    Make Active
                  </button>
                )}

                <button
                  type="button"
                  className="resume-icon-button danger"
                  title="Delete resume"
                  onClick={() =>
                    handleDelete(resume)
                  }
                >
                  <Trash2 size={16} />
                </button>

              </div>

            </div>
          ))}

        </div>
      ) : (
        <div className="resume-list-empty">
          <p>
            No resumes uploaded or generated yet.
          </p>
        </div>
      )}

      {/* AI REVIEW */}

      <div className="resume-section-header ai-review-header">

        <div>
          <p className="resume-eyebrow">
            AI REVIEW
          </p>

          <h2>
            What your resume is saying
          </h2>
        </div>

      </div>

      <div className="resume-insight-grid">

        <div className="resume-insight-card">

          <div className="insight-icon green">
            <Check size={18} />
          </div>

          <h3>
            Strong evidence
          </h3>

          <p>
            Your projects and certifications are
            matched against your uploaded resume.
          </p>

        </div>

        <div className="resume-insight-card">

          <div className="insight-icon orange">
            <Sparkles size={18} />
          </div>

          <h3>
            AI analysis
          </h3>

          <p>
            Analyze your resume against the role
            you want to target.
          </p>

        </div>

        <div className="resume-insight-card">

          <div className="insight-icon orange">
            <WandSparkles size={18} />
          </div>

          <h3>
            AI resume generation
          </h3>

          <p>
            Select your strongest projects and
            certifications to generate a targeted PDF.
          </p>

        </div>

      </div>

      {/* =========================
          UPLOAD MODAL
      ========================= */}

      {showUploadModal && (
        <div
          className="resume-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeUploadModal();
            }
          }}
        >

          <div className="resume-modal">

            <div className="resume-modal-header">

              <div>
                <p className="resume-eyebrow">
                  NEW RESUME
                </p>

                <h2>
                  Upload Resume
                </h2>
              </div>

              <button
                type="button"
                className="resume-close-button"
                onClick={closeUploadModal}
                disabled={saving}
              >
                <X size={19} />
              </button>

            </div>

            <form
              className="resume-form"
              onSubmit={handleUpload}
            >

              <div className="resume-form-group">

                <label htmlFor="resumeTitle">
                  Resume Title
                </label>

                <input
                  id="resumeTitle"
                  type="text"
                  placeholder="e.g. Software Engineer Resume"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                />

              </div>

              <div className="resume-form-group">

                <label>
                  Resume PDF
                </label>

                <label
                  className={`resume-file-input ${
                    selectedFile
                      ? "has-file"
                      : ""
                  }`}
                  htmlFor="resumeFile"
                >

                  <Upload size={20} />

                  <span>
                    {selectedFile
                      ? selectedFile.name
                      : "Choose a PDF file"}
                  </span>

                  <small>
                    PDF only
                  </small>

                </label>

                <input
                  id="resumeFile"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  hidden
                />

              </div>

              <div className="resume-modal-actions">

                <button
                  type="button"
                  className="resume-secondary-button"
                  onClick={closeUploadModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="resume-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Uploading..."
                    : "Upload Resume"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =========================
          EDIT MODAL
      ========================= */}

      {showEditModal && selectedResume && (
        <div
          className="resume-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeEditModal();
            }
          }}
        >

          <div className="resume-modal small-modal">

            <div className="resume-modal-header">

              <div>
                <p className="resume-eyebrow">
                  RESUME VERSION
                </p>

                <h2>
                  Edit Resume
                </h2>
              </div>

              <button
                type="button"
                className="resume-close-button"
                onClick={closeEditModal}
                disabled={saving}
              >
                <X size={19} />
              </button>

            </div>

            <form
              className="resume-form"
              onSubmit={handleUpdate}
            >

              <div className="resume-form-group">

                <label htmlFor="editResumeTitle">
                  Resume Title
                </label>

                <input
                  id="editResumeTitle"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                />

              </div>

              <div className="resume-modal-actions">

                <button
                  type="button"
                  className="resume-secondary-button"
                  onClick={closeEditModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="resume-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =========================
          AI ANALYSIS MODAL
      ========================= */}

      {showAnalyzeModal && selectedResume && (
        <div
          className="resume-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeAnalyzeModal();
            }
          }}
        >

          <div className="resume-modal analysis-modal">

            <div className="resume-modal-header">

              <div>
                <p className="resume-eyebrow">
                  AI RESUME ANALYSIS
                </p>

                <h2>
                  {analysis
                    ? "Analysis Results"
                    : "Analyze Resume"}
                </h2>
              </div>

              <button
                type="button"
                className="resume-close-button"
                onClick={closeAnalyzeModal}
                disabled={analyzing}
              >
                <X size={19} />
              </button>

            </div>

            {!analysis ? (
              <form
                className="resume-form"
                onSubmit={handleAnalyze}
              >

                <div className="analysis-intro">

                  <Sparkles size={22} />

                  <p>
                    AI will review{" "}
                    <strong>
                      {selectedResume.title}
                    </strong>{" "}
                    against the target role you
                    provide.
                  </p>

                </div>

                <div className="resume-form-group">

                  <label htmlFor="targetRole">
                    Target Role
                  </label>

                  <input
                    id="targetRole"
                    type="text"
                    placeholder="e.g. Software Engineer"
                    value={targetRole}
                    onChange={(event) =>
                      setTargetRole(
                        event.target.value
                      )
                    }
                  />

                  <small className="form-help">
                    Example: Software Engineer,
                    Backend Developer, Data Analyst
                  </small>

                </div>

                <div className="resume-modal-actions">

                  <button
                    type="button"
                    className="resume-secondary-button"
                    onClick={closeAnalyzeModal}
                    disabled={analyzing}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="resume-primary-button"
                    disabled={analyzing}
                  >
                    <Sparkles size={16} />

                    {analyzing
                      ? "Analyzing..."
                      : "Analyze Resume"}
                  </button>

                </div>

              </form>
            ) : (
              <div className="analysis-results">

                <div className="analysis-score-row">

                  <div className="analysis-score">

                    <span>
                      ATS SCORE
                    </span>

                    <strong>
                      {analysis.atsScore || 0}
                    </strong>

                    <small>
                      /100
                    </small>

                  </div>

                  <div className="analysis-role">

                    <span>
                      TARGET ROLE
                    </span>

                    <strong>
                      {analysis.targetRole ||
                        targetRole}
                    </strong>

                  </div>

                </div>

                <div className="analysis-summary">

                  <p className="analysis-label">
                    SUMMARY
                  </p>

                  <p>
                    {analysis.summary ||
                      "No summary available."}
                  </p>

                </div>

                <div className="analysis-grid">

                  <AnalysisList
                    title="Strengths"
                    items={analysis.strengths}
                    type="success"
                  />

                  <AnalysisList
                    title="Missing Skills"
                    items={analysis.missingSkills}
                    type="warning"
                  />

                  <AnalysisList
                    title="Improvements"
                    items={analysis.improvements}
                    type="warning"
                  />

                </div>

                {analysis.aiEraReadiness && (
                  <div className="readiness-card">

                    <div>

                      <p className="analysis-label">
                        AI-ERA READINESS
                      </p>

                      <h3>
                        {
                          analysis.aiEraReadiness
                            .score
                        }
                        /100
                      </h3>

                    </div>

                    <p>
                      {
                        analysis.aiEraReadiness
                          .assessment
                      }
                    </p>

                  </div>
                )}

                <button
                  type="button"
                  className="resume-secondary-button full-width"
                  onClick={closeAnalyzeModal}
                >
                  Done
                </button>

              </div>
            )}

          </div>

        </div>
      )}

      {/* =========================
          AI GENERATE MODAL
      ========================= */}

      {showGenerateModal && (
        <div
          className="resume-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeGenerateModal();
            }
          }}
        >

          <div className="resume-modal generator-modal">

            <div className="resume-modal-header">

              <div>
                <p className="resume-eyebrow">
                  AI RESUME GENERATOR
                </p>

                <h2>
                  Build a targeted resume
                </h2>
              </div>

              <button
                type="button"
                className="resume-close-button"
                onClick={closeGenerateModal}
                disabled={generating}
              >
                <X size={19} />
              </button>

            </div>

            <form
              className="resume-form generator-form"
              onSubmit={handleGenerateResume}
            >

              <div className="analysis-intro">

                <WandSparkles size={22} />

                <p>
                  AI will create a professional,
                  ATS-friendly resume using only
                  the information you provide.
                </p>

              </div>

              <div className="resume-form-group">

                <label htmlFor="generateTargetRole">
                  Target Role
                </label>

                <input
                  id="generateTargetRole"
                  type="text"
                  placeholder="e.g. AI/ML Engineer"
                  value={targetRole}
                  onChange={(event) =>
                    setTargetRole(
                      event.target.value
                    )
                  }
                />

                <small className="form-help">
                  The resume will be tailored to this
                  role.
                </small>

              </div>

              {loadingGeneratorData ? (
                <div className="generator-loading">

                  <div className="resume-spinner" />

                  <p>
                    Loading your projects and
                    certifications...
                  </p>

                </div>
              ) : (
                <>
                  <div className="generator-section">

                    <div className="generator-section-header">

                      <div>
                        <p className="analysis-label">
                          PROJECTS
                        </p>

                        <h3>
                          Choose projects to include
                        </h3>
                      </div>

                      <span>
                        {selectedProjectIds.length}{" "}
                        selected
                      </span>

                    </div>

                    {projects.length > 0 ? (
                      <div className="generator-selection-list">

                        {projects.map((project) => {
                          const selected =
                            selectedProjectIds.includes(
                              project._id
                            );

                          return (
                            <button
                              type="button"
                              key={project._id}
                              className={`generator-selection ${
                                selected
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() =>
                                toggleProject(
                                  project._id
                                )
                              }
                            >

                              <span className="generator-checkbox">
                                {selected && (
                                  <Check size={13} />
                                )}
                              </span>

                              <span className="generator-selection-content">

                                <strong>
                                  {project.title}
                                </strong>

                                <small>
                                  {Array.isArray(
                                    project.technologies
                                  )
                                    ? project.technologies.join(
                                        " · "
                                      )
                                    : ""}
                                </small>

                              </span>

                            </button>
                          );
                        })}

                      </div>
                    ) : (
                      <div className="generator-empty">
                        No projects available. Add
                        projects first.
                      </div>
                    )}

                  </div>

                  <div className="generator-section">

                    <div className="generator-section-header">

                      <div>
                        <p className="analysis-label">
                          CERTIFICATIONS
                        </p>

                        <h3>
                          Choose certifications
                        </h3>
                      </div>

                      <span>
                        {selectedCertificationIds.length}{" "}
                        selected
                      </span>

                    </div>

                    {certifications.length > 0 ? (
                      <div className="generator-selection-list">

                        {certifications.map(
                          (certification) => {
                            const selected =
                              selectedCertificationIds.includes(
                                certification._id
                              );

                            return (
                              <button
                                type="button"
                                key={
                                  certification._id
                                }
                                className={`generator-selection ${
                                  selected
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() =>
                                  toggleCertification(
                                    certification._id
                                  )
                                }
                              >

                                <span className="generator-checkbox">
                                  {selected && (
                                    <Check size={13} />
                                  )}
                                </span>

                                <span className="generator-selection-content">

                                  <strong>
                                    {
                                      certification.title
                                    }
                                  </strong>

                                  <small>
                                    {
                                      certification.issuer
                                    }
                                  </small>

                                </span>

                              </button>
                            );
                          }
                        )}

                      </div>
                    ) : (
                      <div className="generator-empty">
                        No certifications available.
                        You can still generate a resume
                        without them.
                      </div>
                    )}

                  </div>
                </>
              )}

              <div className="resume-modal-actions">

                <button
                  type="button"
                  className="resume-secondary-button"
                  onClick={closeGenerateModal}
                  disabled={generating}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="resume-primary-button"
                  disabled={
                    generating ||
                    loadingGeneratorData
                  }
                >
                  <WandSparkles size={16} />

                  {generating
                    ? "Generating..."
                    : "Generate Resume"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

function AnalysisList({
  title,
  items,
  type,
}) {
  const safeItems = Array.isArray(items)
    ? items
    : [];

  return (
    <div className="analysis-list-card">

      <div
        className={`analysis-list-icon ${type}`}
      >
        {type === "success" ? (
          <Check size={15} />
        ) : (
          <Sparkles size={15} />
        )}
      </div>

      <h3>{title}</h3>

      {safeItems.length > 0 ? (
        <ul>
          {safeItems.map((item, index) => (
            <li
              key={`${title}-${index}`}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="analysis-empty">
          No items returned.
        </p>
      )}

    </div>
  );
}

export default Resumes;