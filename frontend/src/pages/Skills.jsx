import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill
} from "../services/skillService";

import "./Skills.css";


// ==========================================
// CONSTANTS
// ==========================================

const LEVELS = {
  1: "Beginner",
  2: "Basic",
  3: "Intermediate",
  4: "Strong",
  5: "Advanced"
};


const EMPTY_FORM = {
  name: "",
  selfLevel: 3
};


// ==========================================
// SKILLS PAGE
// ==========================================

function Skills() {

  const [
    skills,
    setSkills
  ] = useState([]);


  const [
    form,
    setForm
  ] = useState(
    EMPTY_FORM
  );


  const [
    editingSkillId,
    setEditingSkillId
  ] = useState(null);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    saving,
    setSaving
  ] = useState(false);


  const [
    deletingId,
    setDeletingId
  ] = useState(null);


  const [
    message,
    setMessage
  ] = useState("");


  const [
    error,
    setError
  ] = useState("");


  // ==========================================
  // LOAD SKILLS
  // ==========================================

  const loadSkills = async () => {

    try {

      setLoading(true);

      setError("");

      const result =
        await getSkills();

      setSkills(
        Array.isArray(result)
          ? result
          : []
      );

    } catch (err) {

      console.error(
        "Failed to load skills:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to load skills."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadSkills();

  }, []);


  // ==========================================
  // HANDLE FORM CHANGE
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

        [name]:
          name === "selfLevel"
            ? Number(value)
            : value
      })
    );


    setMessage("");

    setError("");

  };


  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {

    setForm(
      EMPTY_FORM
    );

    setEditingSkillId(
      null
    );

    setMessage("");

    setError("");

  };


  // ==========================================
  // START EDIT
  // ==========================================

  const handleEdit = (
    skill
  ) => {

    setEditingSkillId(
      skill._id
    );

    setForm({

      name:
        skill.name || "",

      selfLevel:
        skill.selfLevel || 3

    });


    setMessage("");

    setError("");


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();


    const skillName =
      form.name.trim();


    if (!skillName) {

      setError(
        "Skill name is required."
      );

      return;
    }


    if (
      form.selfLevel < 1 ||
      form.selfLevel > 5
    ) {

      setError(
        "Skill level must be between 1 and 5."
      );

      return;
    }


    try {

      setSaving(true);

      setError("");

      setMessage("");


      let updatedSkills;


      if (editingSkillId) {

        updatedSkills =
          await updateSkill(
            editingSkillId,
            {
              name: skillName,
              selfLevel:
                form.selfLevel
            }
          );

        setMessage(
          "Skill updated successfully."
        );

      } else {

        updatedSkills =
          await addSkill({
            name: skillName,
            selfLevel:
              form.selfLevel
          });

        setMessage(
          "Skill added successfully."
        );

      }


      setSkills(
        Array.isArray(updatedSkills)
          ? updatedSkills
          : []
      );


      setForm(
        EMPTY_FORM
      );

      setEditingSkillId(
        null
      );

    } catch (err) {

      console.error(
        "Save skill error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to save skill."
      );

    } finally {

      setSaving(false);

    }

  };


  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (
    skillId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this skill?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setDeletingId(
        skillId
      );

      setError("");

      setMessage("");


      const updatedSkills =
        await deleteSkill(
          skillId
        );


      setSkills(
        Array.isArray(updatedSkills)
          ? updatedSkills
          : []
      );


      if (
        editingSkillId === skillId
      ) {

        resetForm();

      }


      setMessage(
        "Skill deleted successfully."
      );

    } catch (err) {

      console.error(
        "Delete skill error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to delete skill."
      );

    } finally {

      setDeletingId(
        null
      );

    }

  };


  // ==========================================
  // SKILL STATISTICS
  // ==========================================

  const statistics =
    useMemo(() => {

      if (!skills.length) {

        return {
          total: 0,
          average: 0,
          advanced: 0
        };

      }


      const totalLevel =
        skills.reduce(
          (
            total,
            skill
          ) =>
            total +
            Number(
              skill.selfLevel || 0
            ),
          0
        );


      const advanced =
        skills.filter(
          skill =>
            Number(
              skill.selfLevel
            ) >= 4
        ).length;


      return {

        total:
          skills.length,

        average:
          (
            totalLevel /
            skills.length
          ).toFixed(1),

        advanced

      };

    }, [skills]);


  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {

    return (

      <div className="skills-page">

        <div className="skills-loading">

          <div className="skills-spinner" />

          <p>
            Loading your skills...
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="skills-page">


      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <section className="skills-header">

        <div>

          <div className="skills-eyebrow">
            SKILLS
          </div>

          <h1>
            Know your strengths.
          </h1>

          <p>
            Add the technical skills you're
            building and rate your current
            confidence in each one.
          </p>

        </div>


        <div className="skills-summary">

          <div className="skills-summary-item">

            <strong>
              {statistics.total}
            </strong>

            <span>
              Skills
            </span>

          </div>


          <div className="skills-summary-divider" />


          <div className="skills-summary-item">

            <strong>
              {statistics.average}
            </strong>

            <span>
              Avg. level
            </span>

          </div>


          <div className="skills-summary-divider" />


          <div className="skills-summary-item">

            <strong>
              {statistics.advanced}
            </strong>

            <span>
              Strong+
            </span>

          </div>

        </div>

      </section>


      {/* ================================= */}
      {/* MESSAGES */}
      {/* ================================= */}

      {message && (

        <div className="skills-message success">

          <span>
            ✓
          </span>

          {message}

        </div>

      )}


      {error && (

        <div className="skills-message error">

          <span>
            !
          </span>

          {error}

        </div>

      )}


      {/* ================================= */}
      {/* MAIN GRID */}
      {/* ================================= */}

      <div className="skills-layout">


        {/* ================================= */}
        {/* SKILLS LIST */}
        {/* ================================= */}

        <section className="skills-card skills-list-card">

          <div className="skills-card-header">

            <div>

              <h2>
                Your skills
              </h2>

              <p>
                Your self-assessed technical
                strengths.
              </p>

            </div>

            <span className="skills-count">
              {skills.length}
            </span>

          </div>


          {skills.length === 0 ? (

            <div className="skills-empty">

              <div className="skills-empty-icon">
                +
              </div>

              <h3>
                No skills added yet
              </h3>

              <p>
                Add your first technical skill
                using the form.
              </p>

            </div>

          ) : (

            <div className="skills-list">

              {skills.map(
                (skill) => {

                  const level =
                    Number(
                      skill.selfLevel
                    );


                  return (

                    <div
                      className="skill-row"
                      key={
                        skill._id
                      }
                    >


                      {/* ICON */}

                      <div className="skill-icon">

                        {skill.name
                          ?.charAt(0)
                          .toUpperCase()}

                      </div>


                      {/* INFO */}

                      <div className="skill-info">

                        <div className="skill-name-row">

                          <h3>
                            {skill.name}
                          </h3>

                          <span>
                            {LEVELS[level]}
                          </span>

                        </div>


                        <div className="skill-level-row">

                          <div className="skill-level-track">

                            <div
                              className="skill-level-fill"
                              style={{
                                width:
                                  `${level * 20}%`
                              }}
                            />

                          </div>


                          <strong>
                            {level}/5
                          </strong>

                        </div>

                      </div>


                      {/* ACTIONS */}

                      <div className="skill-actions">

                        <button
                          type="button"
                          className="skill-edit-button"
                          onClick={() =>
                            handleEdit(
                              skill
                            )
                          }
                        >
                          Edit
                        </button>


                        <button
                          type="button"
                          className="skill-delete-button"
                          onClick={() =>
                            handleDelete(
                              skill._id
                            )
                          }
                          disabled={
                            deletingId ===
                            skill._id
                          }
                        >

                          {deletingId ===
                          skill._id
                            ? "..."
                            : "Delete"}

                        </button>

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          )}

        </section>


        {/* ================================= */}
        {/* ADD / EDIT FORM */}
        {/* ================================= */}

        <section className="skills-card skills-form-card">

          <div className="skills-card-header">

            <div>

              <div className="skills-form-eyebrow">

                {editingSkillId
                  ? "EDIT SKILL"
                  : "ADD SKILL"}

              </div>

              <h2>

                {editingSkillId
                  ? "Update your skill"
                  : "Add a skill"}

              </h2>

              <p>
                Be honest with your self-level.
                It helps PlaceMate understand
                where you need improvement.
              </p>

            </div>

          </div>


          <form
            className="skill-form"
            onSubmit={
              handleSubmit
            }
          >


            {/* SKILL NAME */}

            <div className="skill-field">

              <label>
                Skill name
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
                placeholder="e.g. Python"
                maxLength="50"
                required
              />

            </div>


            {/* LEVEL */}

            <div className="skill-field">

              <label>
                Self level
              </label>


              <div className="level-selector">

                {[1, 2, 3, 4, 5].map(
                  (level) => (

                    <button
                      key={level}
                      type="button"
                      className={
                        form.selfLevel ===
                        level
                          ? "level-option active"
                          : "level-option"
                      }
                      onClick={() =>
                        setForm(
                          previous => ({
                            ...previous,
                            selfLevel:
                              level
                          })
                        )
                      }
                    >

                      <strong>
                        {level}
                      </strong>

                      <span>
                        {LEVELS[level]}
                      </span>

                    </button>

                  )
                )}

              </div>

            </div>


            {/* FORM ACTIONS */}

            <div className="skill-form-actions">

              {editingSkillId && (

                <button
                  type="button"
                  className="skill-cancel-button"
                  onClick={
                    resetForm
                  }
                  disabled={
                    saving
                  }
                >
                  Cancel
                </button>

              )}


              <button
                type="submit"
                className="skill-save-button"
                disabled={
                  saving
                }
              >

                {saving

                  ? "Saving..."

                  : editingSkillId
                    ? "Update skill"
                    : "Add skill"}

              </button>

            </div>

          </form>


          {/* LEVEL GUIDE */}

          <div className="skill-level-guide">

            <div className="guide-title">
              Self-level guide
            </div>


            <div className="guide-row">

              <span className="guide-number">
                1
              </span>

              <div>

                <strong>
                  Beginner
                </strong>

                <span>
                  Just getting started
                </span>

              </div>

            </div>


            <div className="guide-row">

              <span className="guide-number">
                2
              </span>

              <div>

                <strong>
                  Basic
                </strong>

                <span>
                  Understands the fundamentals
                </span>

              </div>

            </div>


            <div className="guide-row">

              <span className="guide-number">
                3
              </span>

              <div>

                <strong>
                  Intermediate
                </strong>

                <span>
                  Can build with the skill
                </span>

              </div>

            </div>


            <div className="guide-row">

              <span className="guide-number">
                4
              </span>

              <div>

                <strong>
                  Strong
                </strong>

                <span>
                  Comfortable using it independently
                </span>

              </div>

            </div>


            <div className="guide-row">

              <span className="guide-number">
                5
              </span>

              <div>

                <strong>
                  Advanced
                </strong>

                <span>
                  Deep practical understanding
                </span>

              </div>

            </div>

          </div>

        </section>

      </div>

    </div>

  );

}


export default Skills;