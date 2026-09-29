import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  getProfile,
  updateProfile
} from "../services/profileService";

import "./Profile.css";


// ==========================================
// EMPTY FORM
// ==========================================

const EMPTY_FORM = {
  name: "",
  phone: "",
  college: "",
  branch: "",
  semester: "",
  cgpa: "",
  graduationYear: "",
  github: ""
};


// ==========================================
// PROFILE PAGE
// ==========================================

function Profile() {

  const [
    profile,
    setProfile
  ] = useState(null);

  const [
    form,
    setForm
  ] = useState(EMPTY_FORM);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    saving,
    setSaving
  ] = useState(false);

  const [
    message,
    setMessage
  ] = useState("");

  const [
    error,
    setError
  ] = useState("");


  // ==========================================
  // LOAD PROFILE
  // ==========================================

  const loadProfile = async () => {

    try {

      setLoading(true);

      setError("");

      const student =
        await getProfile();

      setProfile(student);

      setForm({

        name:
          student?.name || "",

        phone:
          student?.profile?.phone || "",

        college:
          student?.profile?.college || "",

        branch:
          student?.profile?.branch || "",

        semester:
          student?.profile?.semester ?? "",

        cgpa:
          student?.profile?.cgpa ?? "",

        graduationYear:
          student?.profile?.graduationYear ?? "",

        github:
          student?.profile?.github || ""

      });

    } catch (err) {

      console.error(
        "Failed to load profile:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to load profile."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadProfile();

  }, []);


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value
    } = event.target;

    setForm(
      previous => ({
        ...previous,
        [name]: value
      })
    );

    setMessage("");

    setError("");

  };


  // ==========================================
  // PROFILE COMPLETENESS
  // ==========================================

  const profileCompletion =
    useMemo(() => {

      const fields = [
        form.name,
        profile?.email,
        form.phone,
        form.college,
        form.branch,
        form.semester,
        form.cgpa,
        form.graduationYear,
        form.github
      ];

      const completed =
        fields.filter(
          field =>
            field !== undefined &&
            field !== null &&
            String(field).trim() !== ""
        ).length;

      return Math.round(
        (completed / fields.length) *
        100
      );

    }, [form, profile]);


  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    try {

      setSaving(true);

      setMessage("");

      setError("");


      const profileData = {

        name:
          form.name.trim(),

        phone:
          form.phone.trim(),

        college:
          form.college.trim(),

        branch:
          form.branch.trim(),

        semester:
          form.semester === ""
            ? undefined
            : Number(form.semester),

        cgpa:
          form.cgpa === ""
            ? undefined
            : Number(form.cgpa),

        graduationYear:
          form.graduationYear === ""
            ? undefined
            : Number(
                form.graduationYear
              ),

        github:
          form.github.trim()

      };


      const response =
        await updateProfile(
          profileData
        );


      if (response.student) {

        setProfile(
          previous => ({
            ...previous,
            ...response.student
          })
        );

      }


      setMessage(
        "Profile updated successfully."
      );

    } catch (err) {

      console.error(
        "Update profile error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to update profile."
      );

    } finally {

      setSaving(false);

    }

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="profile-page">

        <div className="profile-loading">

          <div className="profile-spinner" />

          <p>
            Loading your profile...
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="profile-page">


      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <section className="profile-header">

        <div>

          <div className="profile-eyebrow">
            PROFILE
          </div>

          <h1>
            Build your placement profile.
          </h1>

          <p>
            Keep your academic and
            professional information
            up to date.
          </p>

        </div>


        <div className="profile-completion-card">

          <div className="completion-top">

            <span>
              Profile completeness
            </span>

            <strong>
              {profileCompletion}%
            </strong>

          </div>

          <div className="completion-track">

            <div
              className="completion-fill"
              style={{
                width:
                  `${profileCompletion}%`
              }}
            />

          </div>

        </div>

      </section>


      {/* ================================= */}
      {/* MESSAGES */}
      {/* ================================= */}

      {message && (

        <div className="profile-message success">

          <span>
            ✓
          </span>

          {message}

        </div>

      )}


      {error && (

        <div className="profile-message error">

          <span>
            !
          </span>

          {error}

        </div>

      )}


      {/* ================================= */}
      {/* MAIN GRID */}
      {/* ================================= */}

      <div className="profile-layout">


        {/* ================================= */}
        {/* PROFILE FORM */}
        {/* ================================= */}

        <form
          className="profile-card profile-form"
          onSubmit={
            handleSubmit
          }
        >


          {/* ================================= */}
          {/* BASIC INFORMATION */}
          {/* ================================= */}

          <section className="profile-section">

            <div className="section-heading">

              <div>

                <h2>
                  Basic information
                </h2>

                <p>
                  Your identity and contact
                  information.
                </p>

              </div>

            </div>


            <div className="profile-form-grid">


              {/* NAME */}

              <div className="profile-field">

                <label>
                  Full name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Your full name"
                  required
                />

              </div>


              {/* EMAIL */}

              <div className="profile-field">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={
                    profile?.email || ""
                  }
                  disabled
                />

                <small>
                  Email is managed through
                  your account.
                </small>

              </div>


              {/* PHONE */}

              <div className="profile-field">

                <label>
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={
                    form.phone
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="+91..."
                />

              </div>


              {/* GITHUB */}

              <div className="profile-field">

                <label>
                  GitHub
                </label>

                <input
                  type="url"
                  name="github"
                  value={
                    form.github
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://github.com/username"
                />

              </div>

            </div>

          </section>


          {/* ================================= */}
          {/* ACADEMIC INFORMATION */}
          {/* ================================= */}

          <section className="profile-section">

            <div className="section-heading">

              <div>

                <h2>
                  Academic information
                </h2>

                <p>
                  Information recruiters may
                  use to understand your
                  academic background.
                </p>

              </div>

            </div>


            <div className="profile-form-grid">


              {/* COLLEGE */}

              <div className="profile-field full-width">

                <label>
                  College
                </label>

                <input
                  type="text"
                  name="college"
                  value={
                    form.college
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Your college or university"
                />

              </div>


              {/* BRANCH */}

              <div className="profile-field">

                <label>
                  Branch
                </label>

                <input
                  type="text"
                  name="branch"
                  value={
                    form.branch
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Computer Engineering"
                />

              </div>


              {/* SEMESTER */}

              <div className="profile-field">

                <label>
                  Current semester
                </label>

                <input
                  type="number"
                  name="semester"
                  min="1"
                  max="12"
                  value={
                    form.semester
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="7"
                />

              </div>


              {/* CGPA */}

              <div className="profile-field">

                <label>
                  CGPA
                </label>

                <input
                  type="number"
                  name="cgpa"
                  min="0"
                  max="10"
                  step="0.01"
                  value={
                    form.cgpa
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="8.50"
                />

              </div>


              {/* GRADUATION YEAR */}

              <div className="profile-field">

                <label>
                  Graduation year
                </label>

                <input
                  type="number"
                  name="graduationYear"
                  min="2000"
                  max="2100"
                  value={
                    form.graduationYear
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="2027"
                />

              </div>

            </div>

          </section>


          {/* ================================= */}
          {/* SAVE */}
          {/* ================================= */}

          <div className="profile-form-footer">

            <p>
              Keep this information updated
              because other PlaceMate features
              will use it.
            </p>

            <button
              type="submit"
              className="profile-save-button"
              disabled={
                saving
              }
            >

              {saving
                ? "Saving..."
                : "Save profile"}

            </button>

          </div>

        </form>


        {/* ================================= */}
        {/* PROFILE SUMMARY */}
        {/* ================================= */}

        <aside className="profile-side-column">


          {/* PROFILE CARD */}

          <div className="profile-card identity-card">

            <div className="identity-avatar">

              {(
                form.name ||
                "S"
              )
                .charAt(0)
                .toUpperCase()}

            </div>


            <h2>
              {form.name ||
                "Your name"}
            </h2>

            <p>
              {profile?.email ||
                "Your email"}
            </p>


            <div className="identity-divider" />


            <div className="identity-row">

              <span>
                College
              </span>

              <strong>
                {form.college ||
                  "Not added"}
              </strong>

            </div>


            <div className="identity-row">

              <span>
                Branch
              </span>

              <strong>
                {form.branch ||
                  "Not added"}
              </strong>

            </div>


            <div className="identity-row">

              <span>
                Graduation
              </span>

              <strong>
                {form.graduationYear ||
                  "Not added"}
              </strong>

            </div>

          </div>


          {/* NEXT MODULES */}

          <div className="profile-card next-modules-card">

            <div className="profile-eyebrow">
              YOUR PLACEMENT PROFILE
            </div>

            <h3>
              Complete the rest
            </h3>

            <p>
              Skills, achievements and target
              companies will be managed in
              their dedicated sections.
            </p>


            <div className="module-preview">

              <div className="module-preview-row">

                <span className="module-icon">
                  &lt;/&gt;
                </span>

                <div>

                  <strong>
                    Skills
                  </strong>

                  <span>
                    Technical strengths
                  </span>

                </div>

              </div>


              <div className="module-preview-row">

                <span className="module-icon">
                  ★
                </span>

                <div>

                  <strong>
                    Achievements
                  </strong>

                  <span>
                    Highlights and accomplishments
                  </span>

                </div>

              </div>


              <div className="module-preview-row">

                <span className="module-icon">
                  ◎
                </span>

                <div>

                  <strong>
                    Target companies
                  </strong>

                  <span>
                    Companies you're preparing for
                  </span>

                </div>

              </div>

            </div>

          </div>

        </aside>

      </div>

    </div>

  );

}


export default Profile;