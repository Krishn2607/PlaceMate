import {
  Award,
  ExternalLink,
  FileText,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createCertification,
  deleteCertification,
  getCertifications,
  updateCertification,
} from "../services/certificationService";

import "./Certifications.css";

const EMPTY_FORM = {
  title: "",
  issuer: "",
  issueDate: "",
  credentialURL: "",
  certificateFileURL: "",
};

function Certifications() {
  const [certifications, setCertifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingCertification, setEditingCertification] =
    useState(null);

  const [form, setForm] =
    useState(EMPTY_FORM);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getCertifications();

      setCertifications(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load certifications."
      );
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const currentYear =
      new Date().getFullYear();

    return {
      total: certifications.length,

      thisYear:
        certifications.filter(
          (certification) => {
            if (
              !certification.issueDate
            ) {
              return false;
            }

            return (
              new Date(
                certification.issueDate
              ).getFullYear() ===
              currentYear
            );
          }
        ).length,

      withCredential:
        certifications.filter(
          (certification) =>
            Boolean(
              certification.credentialURL
            )
        ).length,
    };
  }, [certifications]);

  const openAddModal = () => {
    setEditingCertification(null);
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  const openEditModal = (
    certification
  ) => {
    setEditingCertification(
      certification
    );

    setForm({
      title:
        certification.title || "",

      issuer:
        certification.issuer || "",

      issueDate:
        formatDateForInput(
          certification.issueDate
        ),

      credentialURL:
        certification.credentialURL ||
        "",

      certificateFileURL:
        certification.certificateFileURL ||
        "",
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
    setEditingCertification(null);
    setForm(EMPTY_FORM);
  };

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError(
        "Certification title is required."
      );
      return;
    }

    if (!form.issuer.trim()) {
      setError(
        "Issuer is required."
      );
      return;
    }

    if (!form.issueDate) {
      setError(
        "Issue date is required."
      );
      return;
    }

    const certificationData = {
      title: form.title.trim(),

      issuer: form.issuer.trim(),

      issueDate: form.issueDate,

      credentialURL:
        form.credentialURL.trim() ||
        null,

      certificateFileURL:
        form.certificateFileURL.trim() ||
        null,
    };

    try {
      setSaving(true);

      if (editingCertification) {
        const updatedCertification =
          await updateCertification(
            editingCertification._id,
            certificationData
          );

        setCertifications(
          (current) =>
            current.map(
              (certification) =>
                certification._id ===
                editingCertification._id
                  ? updatedCertification
                  : certification
            )
        );

        setSuccess(
          "Certification updated successfully."
        );
      } else {
        const newCertification =
          await createCertification(
            certificationData
          );

        setCertifications(
          (current) => [
            newCertification,
            ...current,
          ]
        );

        setSuccess(
          "Certification added successfully."
        );
      }

      setIsModalOpen(false);
      setEditingCertification(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save certification."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    certification
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${certification.title}"? This action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        certification._id
      );

      setError("");
      setSuccess("");

      await deleteCertification(
        certification._id
      );

      setCertifications(
        (current) =>
          current.filter(
            (item) =>
              item._id !==
              certification._id
          )
      );

      setSuccess(
        "Certification deleted successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete certification."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-loading">
          Loading certifications...
        </div>
      </div>
    );
  }

  return (
    <div className="page certifications-page">
      <div className="page-hero with-action">
        <div>
          <div className="eyebrow">
            CERTIFICATIONS
          </div>

          <h1>
            Keep your credentials
            recruiter-ready.
          </h1>

          <p>
            Track certifications and the
            evidence behind your technical
            profile.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openAddModal}
        >
          <Plus size={17} />
          Add certification
        </button>
      </div>

      {error && (
        <div className="certification-message error">
          {error}
        </div>
      )}

      {success && (
        <div className="certification-message success">
          {success}
        </div>
      )}

      <div className="certification-stats">
        <div className="certification-stat-card">
          <span>
            Total Certifications
          </span>

          <strong>
            {stats.total}
          </strong>
        </div>

        <div className="certification-stat-card">
          <span>
            Earned This Year
          </span>

          <strong>
            {stats.thisYear}
          </strong>
        </div>

        <div className="certification-stat-card">
          <span>
            With Credential
          </span>

          <strong>
            {stats.withCredential}
          </strong>
        </div>
      </div>

      {certifications.length > 0 ? (
        <div className="certifications-grid">
          {certifications.map(
            (certification) => (
              <CertificationCard
                key={
                  certification._id
                }
                certification={
                  certification
                }
                onEdit={
                  openEditModal
                }
                onDelete={
                  handleDelete
                }
                deletingId={
                  deletingId
                }
              />
            )
          )}
        </div>
      ) : (
        <div className="empty-state large">
          <div className="empty-state-icon">
            <Award size={24} />
          </div>

          <h3>
            No certifications yet
          </h3>

          <p>
            Add your certifications to
            strengthen your placement
            profile.
          </p>

          <button
            className="primary-button"
            onClick={openAddModal}
          >
            <Plus size={17} />
            Add certification
          </button>
        </div>
      )}

      {isModalOpen && (
        <CertificationModal
          editingCertification={
            editingCertification
          }
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

function CertificationCard({
  certification,
  onEdit,
  onDelete,
  deletingId,
}) {
  return (
    <article className="certification-card">
      <div className="certification-card-top">
        <div className="certification-icon">
          <Award size={21} />
        </div>

        <div className="certification-actions">
          <button
            className="icon-button"
            title="Edit certification"
            onClick={() =>
              onEdit(certification)
            }
          >
            <Pencil size={15} />
          </button>

          <button
            className="icon-button danger"
            title="Delete certification"
            disabled={
              deletingId ===
              certification._id
            }
            onClick={() =>
              onDelete(certification)
            }
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <h3>
        {certification.title}
      </h3>

      <p className="certification-issuer">
        {certification.issuer}
      </p>

      <div className="certification-date">
        <span>Issued</span>

        <strong>
          {formatDate(
            certification.issueDate
          )}
        </strong>
      </div>

      <div className="certification-footer">
        <div className="certification-links">
          {certification.credentialURL && (
            <a
              href={
                certification.credentialURL
              }
              target="_blank"
              rel="noreferrer"
              className="certification-link"
            >
              <ExternalLink
                size={14}
              />
              Credential
            </a>
          )}

          {certification.certificateFileURL && (
            <a
              href={
                certification.certificateFileURL
              }
              target="_blank"
              rel="noreferrer"
              className="certification-link"
            >
              <FileText size={14} />
              Certificate
            </a>
          )}

          {!certification.credentialURL &&
            !certification.certificateFileURL && (
              <span className="no-evidence">
                No credential link
              </span>
            )}
        </div>
      </div>
    </article>
  );
}

function CertificationModal({
  editingCertification,
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
      <div className="certification-modal">
        <div className="modal-header">
          <div>
            <div className="eyebrow">
              CERTIFICATION
            </div>

            <h2>
              {editingCertification
                ? "Edit certification"
                : "Add certification"}
            </h2>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
            disabled={saving}
          >
            <X size={19} />
          </button>
        </div>

        <form
          className="certification-form"
          onSubmit={onSubmit}
        >
          <div className="form-field">
            <label htmlFor="title">
              Certification title
            </label>

            <input
              id="title"
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="e.g. AWS Certified Cloud Practitioner"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="issuer">
              Issuing organization
            </label>

            <input
              id="issuer"
              name="issuer"
              value={form.issuer}
              onChange={onChange}
              placeholder="e.g. Amazon Web Services"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="issueDate">
              Issue date
            </label>

            <input
              id="issueDate"
              name="issueDate"
              type="date"
              value={form.issueDate}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="credentialURL">
              Credential URL
            </label>

            <input
              id="credentialURL"
              name="credentialURL"
              type="url"
              value={
                form.credentialURL
              }
              onChange={onChange}
              placeholder="https://..."
            />

            <small>
              Link to the online credential or
              verification page.
            </small>
          </div>

          <div className="form-field">
            <label htmlFor="certificateFileURL">
              Certificate file URL
            </label>

            <input
              id="certificateFileURL"
              name="certificateFileURL"
              type="url"
              value={
                form.certificateFileURL
              }
              onChange={onChange}
              placeholder="https://..."
            />

            <small>
              Optional URL to the certificate
              file.
            </small>
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
                : editingCertification
                ? "Save changes"
                : "Add certification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatDateForInput(date) {
  if (!date) {
    return "";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "";
  }

  return parsedDate
    .toISOString()
    .split("T")[0];
}

function formatDate(date) {
  if (!date) {
    return "Not specified";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "Not specified";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      month: "short",
      year: "numeric",
    }
  );
}

export default Certifications;