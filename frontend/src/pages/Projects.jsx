import {
  ExternalLink,
  FolderKanban,
  GitBranch,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../services/projectService";

import "./Projects.css";

const EMPTY_FORM = {
  title: "",
  description: "",
  technologies: "",
  githubLink: "",
  liveDemoLink: "",
  startDate: "",
  endDate: "",
  status: "Planned",
};

const STATUS_OPTIONS = [
  "Planned",
  "In Progress",
  "Completed",
];

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeFilter, setActiveFilter] =
    useState("All");

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingProject, setEditingProject] =
    useState(null);

  const [form, setForm] =
    useState(EMPTY_FORM);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProjects();

      setProjects(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: projects.length,

      completed: projects.filter(
        (project) =>
          project.status === "Completed"
      ).length,

      inProgress: projects.filter(
        (project) =>
          project.status === "In Progress"
      ).length,

      planned: projects.filter(
        (project) =>
          project.status === "Planned"
      ).length,
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") {
      return projects;
    }

    return projects.filter(
      (project) =>
        project.status === activeFilter
    );
  }, [projects, activeFilter]);

  const openAddModal = () => {
    setEditingProject(null);
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);

    setForm({
      title: project.title || "",
      description: project.description || "",
      technologies:
        project.technologies?.join(", ") || "",
      githubLink: project.githubLink || "",
      liveDemoLink:
        project.liveDemoLink || "",
      startDate: formatDateForInput(
        project.startDate
      ),
      endDate: formatDateForInput(
        project.endDate
      ),
      status:
        project.status || "Planned",
    });

    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setIsModalOpen(false);
    setEditingProject(null);
    setForm(EMPTY_FORM);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError(
        "Project title is required."
      );
      return;
    }

    if (!form.description.trim()) {
      setError(
        "Project description is required."
      );
      return;
    }

    if (!form.githubLink.trim()) {
      setError(
        "GitHub link is required."
      );
      return;
    }

    const projectData = {
      title: form.title.trim(),

      description:
        form.description.trim(),

      technologies: form.technologies
        .split(",")
        .map((technology) =>
          technology.trim()
        )
        .filter(Boolean),

      githubLink:
        form.githubLink.trim(),

      liveDemoLink:
        form.liveDemoLink.trim() || null,

      startDate:
        form.startDate || undefined,

      endDate:
        form.endDate || undefined,

      status: form.status,
    };

    try {
      setSaving(true);

      if (editingProject) {
        const updatedProject =
          await updateProject(
            editingProject._id,
            projectData
          );

        setProjects((current) =>
          current.map((project) =>
            project._id ===
            editingProject._id
              ? updatedProject
              : project
          )
        );

        setSuccess(
          "Project updated successfully."
        );
      } else {
        const newProject =
          await createProject(
            projectData
          );

        setProjects((current) => [
          newProject,
          ...current,
        ]);

        setSuccess(
          "Project added successfully."
        );
      }

      setIsModalOpen(false);
      setEditingProject(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save project."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project) => {
    const confirmed =
      window.confirm(
        `Delete "${project.title}"? This action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(project._id);
      setError("");
      setSuccess("");

      await deleteProject(project._id);

      setProjects((current) =>
        current.filter(
          (item) =>
            item._id !== project._id
        )
      );

      setSuccess(
        "Project deleted successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete project."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-loading">
          Loading projects...
        </div>
      </div>
    );
  }

  return (
    <div className="page projects-page">
      <div className="page-hero with-action">
        <div>
          <div className="eyebrow">
            PROJECTS
          </div>

          <h1>
            Projects that make recruiters stop
            scrolling.
          </h1>

          <p>
            Show evidence of what you can build,
            not just what you have studied.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openAddModal}
        >
          <Plus size={17} />
          Add project
        </button>
      </div>

      {error && (
        <div className="project-message error">
          {error}
        </div>
      )}

      {success && (
        <div className="project-message success">
          {success}
        </div>
      )}

      <div className="project-stats">
        <div className="project-stat-card">
          <span>Total Projects</span>
          <strong>{stats.total}</strong>
        </div>

        <div className="project-stat-card">
          <span>Completed</span>
          <strong>{stats.completed}</strong>
        </div>

        <div className="project-stat-card">
          <span>In Progress</span>
          <strong>{stats.inProgress}</strong>
        </div>

        <div className="project-stat-card">
          <span>Planned</span>
          <strong>{stats.planned}</strong>
        </div>
      </div>

      <div className="filter-tabs">
        <button
          className={`filter-tab ${
            activeFilter === "All"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveFilter("All")
          }
        >
          All
          <span>{stats.total}</span>
        </button>

        <button
          className={`filter-tab ${
            activeFilter === "Completed"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveFilter("Completed")
          }
        >
          Completed
          <span>{stats.completed}</span>
        </button>

        <button
          className={`filter-tab ${
            activeFilter === "In Progress"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveFilter("In Progress")
          }
        >
          In Progress
          <span>{stats.inProgress}</span>
        </button>

        <button
          className={`filter-tab ${
            activeFilter === "Planned"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActiveFilter("Planned")
          }
        >
          Planned
          <span>{stats.planned}</span>
        </button>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="projects-grid">
          {filteredProjects.map(
            (project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onEdit={openEditModal}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            )
          )}
        </div>
      ) : (
        <div className="empty-state large">
          <div className="empty-state-icon">
            <FolderKanban size={24} />
          </div>

          <h3>
            {activeFilter === "All"
              ? "No projects yet"
              : `No ${activeFilter.toLowerCase()} projects`}
          </h3>

          <p>
            {activeFilter === "All"
              ? "Add your first project to start building evidence for your placement profile."
              : "Projects matching this status will appear here."}
          </p>

          {activeFilter === "All" && (
            <button
              className="primary-button"
              onClick={openAddModal}
            >
              <Plus size={17} />
              Add project
            </button>
          )}
        </div>
      )}

      {isModalOpen && (
        <ProjectModal
          editingProject={editingProject}
          form={form}
          saving={saving}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

function ProjectCard({
  project,
  onEdit,
  onDelete,
  deletingId,
}) {
  return (
    <article className="project-card">
      <div className="project-card-top">
        <span
          className={`project-status ${getStatusClass(
            project.status
          )}`}
        >
          {project.status}
        </span>

        <div className="project-actions">
          <button
            className="icon-button"
            title="Edit project"
            onClick={() =>
              onEdit(project)
            }
          >
            <Pencil size={16} />
          </button>

          <button
            className="icon-button danger"
            title="Delete project"
            disabled={
              deletingId === project._id
            }
            onClick={() =>
              onDelete(project)
            }
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="project-icon">
        <FolderKanban size={23} />
      </div>

      <h3>{project.title}</h3>

      <p className="project-description">
        {project.description}
      </p>

      {project.technologies?.length > 0 && (
        <div className="tag-list">
          {project.technologies
            .slice(0, 6)
            .map((technology, index) => (
              <span key={index}>
                {technology}
              </span>
            ))}
        </div>
      )}

      {(project.startDate ||
        project.endDate) && (
        <div className="project-dates">
          {project.startDate && (
            <span>
              {formatDate(
                project.startDate
              )}
            </span>
          )}

          {project.startDate &&
            project.endDate && (
              <span>→</span>
            )}

          {project.endDate && (
            <span>
              {formatDate(
                project.endDate
              )}
            </span>
          )}
        </div>
      )}

      <div className="project-footer">
        <div className="project-links">
          <a
            href={project.githubLink}
            target="_blank"
            rel="noreferrer"
            className="project-link"
          >
            <GitBranch size={15} />
            GitHub
          </a>

          {project.liveDemoLink && (
            <a
              href={project.liveDemoLink}
              target="_blank"
              rel="noreferrer"
              className="project-link"
            >
              <ExternalLink
                size={15}
              />
              Live
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function ProjectModal({
  editingProject,
  form,
  saving,
  onChange,
  onSubmit,
  onClose,
}) {
  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="project-modal">
        <div className="modal-header">
          <div>
            <div className="eyebrow">
              PROJECT
            </div>

            <h2>
              {editingProject
                ? "Edit project"
                : "Add project"}
            </h2>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
            disabled={saving}
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="project-form"
          onSubmit={onSubmit}
        >
          <div className="form-field">
            <label htmlFor="title">
              Project title
            </label>

            <input
              id="title"
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="e.g. PlaceMate"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Describe what you built, the problem it solves, and your contribution..."
              rows={5}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="technologies">
              Technologies
            </label>

            <input
              id="technologies"
              name="technologies"
              value={form.technologies}
              onChange={onChange}
              placeholder="React, Node.js, MongoDB"
            />

            <small>
              Separate technologies with commas.
            </small>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="githubLink">
                GitHub link
              </label>

              <input
                id="githubLink"
                name="githubLink"
                type="url"
                value={form.githubLink}
                onChange={onChange}
                placeholder="https://github.com/..."
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="liveDemoLink">
                Live demo
              </label>

              <input
                id="liveDemoLink"
                name="liveDemoLink"
                type="url"
                value={form.liveDemoLink}
                onChange={onChange}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="startDate">
                Start date
              </label>

              <input
                id="startDate"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={onChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="endDate">
                End date
              </label>

              <input
                id="endDate"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="status">
              Status
            </label>

            <select
              id="status"
              name="status"
              value={form.status}
              onChange={onChange}
            >
              {STATUS_OPTIONS.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingProject
                ? "Save changes"
                : "Add project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getStatusClass(status) {
  if (status === "Completed") {
    return "completed";
  }

  if (status === "In Progress") {
    return "in-progress";
  }

  return "planned";
}

function formatDateForInput(date) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate
    .toISOString()
    .split("T")[0];
}

function formatDate(date) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      month: "short",
      year: "numeric",
    }
  );
}

export default Projects;