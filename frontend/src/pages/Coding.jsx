import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  createCodingProfile,
  createCodingProblem,
  getCodingProfiles,
  getCodingProblems,
  getCurrentWeeklyPlan,
  updateCodingProfile
} from "../services/codingService";


// ==========================================
// SUPPORTED PLATFORMS
// ==========================================

const SUPPORTED_PLATFORMS = [
  "LeetCode",
  "Codeforces",
  "CodeChef",
  "HackerRank"
];


// ==========================================
// PLATFORM INITIALS
// ==========================================

const PLATFORM_INITIALS = {
  LeetCode: "LC",
  Codeforces: "CF",
  CodeChef: "CC",
  HackerRank: "HR"
};


// ==========================================
// GET PLATFORM INITIALS
// ==========================================

const getPlatformInitials = (
  platform = ""
) => {

  const normalizedPlatform =
    platform.trim();

  if (!normalizedPlatform) {
    return "CP";
  }

  if (
    PLATFORM_INITIALS[
      normalizedPlatform
    ]
  ) {
    return PLATFORM_INITIALS[
      normalizedPlatform
    ];
  }

  const words =
    normalizedPlatform
      .split(/\s+/)
      .filter(Boolean);

  if (words.length >= 2) {

    return (
      words[0][0] +
      words[1][0]
    ).toUpperCase();

  }

  return normalizedPlatform
    .slice(0, 2)
    .toUpperCase();
};


// ==========================================
// EMPTY PROFILE
// ==========================================

const EMPTY_PROFILE = {
  platform: "",
  username: "",
  profileURL: "",
  rating: 0
};


// ==========================================
// EMPTY PROBLEM
// ==========================================

const EMPTY_PROBLEM = {
  codingProfileId: "",
  title: "",
  difficulty: "Easy",
  topics: "",
  solvedDate: "",
  problemURL: ""
};


// ==========================================
// MAIN COMPONENT
// ==========================================

function Coding() {

  const [
    codingProfiles,
    setCodingProfiles
  ] = useState([]);

  const [
    codingProblems,
    setCodingProblems
  ] = useState([]);

  const [
    weeklyPlan,
    setWeeklyPlan
  ] = useState(null);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");

  const [
    showProfileModal,
    setShowProfileModal
  ] = useState(false);

  const [
    showProblemModal,
    setShowProblemModal
  ] = useState(false);

  const [
    profileForm,
    setProfileForm
  ] = useState(EMPTY_PROFILE);

  const [
    problemForm,
    setProblemForm
  ] = useState(EMPTY_PROBLEM);

  const [
    editingProfileId,
    setEditingProfileId
  ] = useState(null);

  const [
    submitting,
    setSubmitting
  ] = useState(false);


  // ==========================================
  // LOAD DATA
  // ==========================================

  const loadCodingData = async () => {

    try {

      setLoading(true);

      setError("");

      const [
        profiles,
        problems,
        plan
      ] = await Promise.all([
        getCodingProfiles(),
        getCodingProblems(),
        getCurrentWeeklyPlan()
          .catch(() => null)
      ]);

      setCodingProfiles(
        profiles || []
      );

      setCodingProblems(
        problems || []
      );

      setWeeklyPlan(plan);

    } catch (err) {

      console.error(
        "Failed to load coding data:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to load coding data."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadCodingData();

  }, []);


  // ==========================================
  // TOTAL PROBLEMS SOLVED
  // ==========================================

  const totalSolved = useMemo(() => {

    return codingProfiles.reduce(
      (
        total,
        profile
      ) =>
        total +
        Number(
          profile.problemsSolved || 0
        ),
      0
    );

  }, [codingProfiles]);


  // ==========================================
  // CODING WEEKLY GOAL
  // ==========================================

  const weeklyStats = useMemo(() => {

    if (!weeklyPlan) {

      return {
        completed: 0,
        total: 0,
        progress: 0
      };

    }


    // Only tasks explicitly categorized
    // as Coding belong to the Coding goal.

    const codingTasks =
      (weeklyPlan.tasks || [])
        .filter(
          task =>
            task.category === "Coding"
        );


    const completed =
      codingTasks.filter(
        task => task.completed
      ).length;


    const total =
      codingTasks.length;


    return {

      completed,

      total,

      progress:
        total === 0
          ? 0
          : Math.round(
              (completed / total) *
              100
            )

    };

  }, [weeklyPlan]);


  // ==========================================
  // PROBLEM ACTIVITY
  //
  // WEEK 1 STARTS FROM THE FIRST
  // PROBLEM THE USER EVER TRACKED.
  //
  // Example:
  //
  // First problem: Sep 29
  //     -> W1
  //
  // Problem on Oct 2
  //     -> W1
  //
  // Problem on Oct 6
  //     -> W2
  //
  // Problem on Oct 13
  //     -> W3
  //
  // ==========================================

  const activityData = useMemo(() => {

    if (
      codingProblems.length === 0
    ) {

      return Array.from(
        { length: 8 },
        (_, index) => ({
          label: `W${index + 1}`,
          count: 0
        })
      );

    }


    // --------------------------------------
    // Find the first problem ever tracked
    // --------------------------------------

    const sortedProblems = [
      ...codingProblems
    ].sort(
      (a, b) =>
        new Date(a.solvedDate) -
        new Date(b.solvedDate)
    );


    const firstProblemDate =
      new Date(
        sortedProblems[0].solvedDate
      );

    firstProblemDate.setHours(
      0,
      0,
      0,
      0
    );


    // --------------------------------------
    // Create 8 tracking weeks
    // --------------------------------------

    const weeks = Array.from(
      { length: 8 },
      (_, index) => ({
        label: `W${index + 1}`,
        count: 0
      })
    );


    // --------------------------------------
    // Put each problem into its
    // tracking week
    // --------------------------------------

    codingProblems.forEach(
      problem => {

        const solvedDate =
          new Date(
            problem.solvedDate
          );

        solvedDate.setHours(
          0,
          0,
          0,
          0
        );


        const difference =
          solvedDate.getTime() -
          firstProblemDate.getTime();


        const daysSinceStart =
          Math.floor(
            difference /
            (
              1000 *
              60 *
              60 *
              24
            )
          );


        const weekIndex =
          Math.floor(
            daysSinceStart / 7
          );


        /*
         * Only display the first
         * eight tracking weeks.
         */

        if (
          weekIndex >= 0 &&
          weekIndex < 8
        ) {

          weeks[
            weekIndex
          ].count += 1;

        }

      }
    );


    return weeks;

  }, [codingProblems]);


  const maxActivity =
    Math.max(
      ...activityData.map(
        week => week.count
      ),
      1
    );


  // ==========================================
  // PROFILE FORM
  // ==========================================

  const handleProfileChange = (
    event
  ) => {

    const {
      name,
      value
    } = event.target;

    setProfileForm(
      previous => ({
        ...previous,
        [name]: value
      })
    );

  };


  // ==========================================
  // PROBLEM FORM
  // ==========================================

  const handleProblemChange = (
    event
  ) => {

    const {
      name,
      value
    } = event.target;

    setProblemForm(
      previous => ({
        ...previous,
        [name]: value
      })
    );

  };


  // ==========================================
  // CREATE / UPDATE PROFILE
  // ==========================================

  const handleSaveProfile =
    async (event) => {

      event.preventDefault();

      try {

        setSubmitting(true);

        setError("");

        const profileData = {

          platform:
            profileForm.platform,

          username:
            profileForm.username.trim(),

          profileURL:
            profileForm.profileURL.trim(),

          rating:
            Number(
              profileForm.rating
            ) || 0

        };


        if (editingProfileId) {

          const updatedProfile =
            await updateCodingProfile(
              editingProfileId,
              profileData
            );

          setCodingProfiles(
            previous =>
              previous.map(
                profile =>
                  profile._id ===
                  editingProfileId
                    ? updatedProfile
                    : profile
              )
          );

        } else {

          const newProfile =
            await createCodingProfile(
              profileData
            );

          setCodingProfiles(
            previous => [
              ...previous,
              newProfile
            ]
          );

        }


        setProfileForm(
          EMPTY_PROFILE
        );

        setEditingProfileId(
          null
        );

        setShowProfileModal(
          false
        );

      } catch (err) {

        console.error(
          "Save coding profile error:",
          err
        );

        setError(
          err.response?.data?.message ||
          "Failed to save coding profile."
        );

      } finally {

        setSubmitting(false);

      }

    };


  // ==========================================
  // CREATE PROBLEM
  // ==========================================

  const handleCreateProblem =
    async (event) => {

      event.preventDefault();

      try {

        setSubmitting(true);

        setError("");

        const newProblem =
          await createCodingProblem({

            codingProfileId:
              problemForm.codingProfileId,

            title:
              problemForm.title.trim(),

            difficulty:
              problemForm.difficulty,

            topics:
              problemForm.topics
                .split(",")
                .map(
                  topic =>
                    topic.trim()
                )
                .filter(Boolean),

            solvedDate:
              problemForm.solvedDate,

            problemURL:
              problemForm.problemURL.trim()

          });


        setCodingProblems(
          previous => [
            ...previous,
            newProblem
          ]
        );


        // Reload profiles so the
        // automatically calculated
        // solved count is reflected.

        const updatedProfiles =
          await getCodingProfiles();

        setCodingProfiles(
          updatedProfiles || []
        );


        setProblemForm(
          EMPTY_PROBLEM
        );

        setShowProblemModal(
          false
        );

      } catch (err) {

        console.error(
          "Create coding problem error:",
          err
        );

        setError(
          err.response?.data?.message ||
          "Failed to create coding problem."
        );

      } finally {

        setSubmitting(false);

      }

    };


  // ==========================================
  // OPEN PROBLEM MODAL
  // ==========================================

  const openProblemModal = () => {

    setProblemForm({

      ...EMPTY_PROBLEM,

      codingProfileId:
        codingProfiles.length > 0
          ? codingProfiles[0]._id
          : ""

    });

    setShowProblemModal(true);

  };


  // ==========================================
  // OPEN CREATE PROFILE MODAL
  // ==========================================

  const openProfileModal = () => {

    setEditingProfileId(
      null
    );

    setProfileForm({
      ...EMPTY_PROFILE
    });

    setShowProfileModal(true);

  };


  // ==========================================
  // OPEN EDIT PROFILE MODAL
  // ==========================================

  const openEditProfileModal = (
    profile
  ) => {

    setEditingProfileId(
      profile._id
    );

    setProfileForm({

      platform:
        profile.platform || "",

      username:
        profile.username || "",

      profileURL:
        profile.profileURL || "",

      rating:
        profile.rating || 0

    });

    setShowProfileModal(true);

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="coding-page">

        <div className="coding-loading">

          <div className="coding-spinner" />

          <p>
            Loading your coding progress...
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="coding-page">


      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <section className="coding-page-header">

        <div>

          <div className="page-eyebrow">
            CODING
          </div>

          <h1>
            Turn consistency into
            interview confidence.
          </h1>

          <p>
            Your solved problems and
            coding-platform profiles,
            in one clean view.
          </p>

        </div>


        <div className="coding-header-actions">

          <button
            className="secondary-action"
            onClick={
              openProfileModal
            }
          >
            + Add coding profile
          </button>


          <button
            className="primary-action"
            onClick={
              openProblemModal
            }
            disabled={
              codingProfiles.length === 0
            }
          >
            + Add problem
          </button>

        </div>

      </section>


      {/* ================================= */}
      {/* ERROR */}
      {/* ================================= */}

      {error && (

        <div className="coding-error">

          <span>
            {error}
          </span>

          <button
            onClick={() =>
              setError("")
            }
          >
            ×
          </button>

        </div>

      )}


      {/* ================================= */}
      {/* STAT CARDS */}
      {/* ================================= */}

      <section className="coding-stat-grid">


        {/* TOTAL SOLVED */}

        <div className="coding-stat-card">

          <div className="stat-icon">
            &lt;/&gt;
          </div>

          <div className="stat-label">
            Problems solved
          </div>

          <div className="stat-value">
            {totalSolved}
          </div>

          <div className="stat-footer positive">
            Across connected platforms
          </div>

        </div>


        {/* PROFILES */}

        <div className="coding-stat-card">

          <div className="stat-icon">
            ◉
          </div>

          <div className="stat-label">
            Coding profiles
          </div>

          <div className="stat-value">
            {codingProfiles.length}
          </div>

          <div className="stat-footer positive">

            {codingProfiles.length === 0
              ? "None connected"
              : `${codingProfiles.length} connected`}

          </div>

        </div>


        {/* CODING WEEKLY GOAL */}

        <div className="coding-stat-card">

          <div className="stat-icon">
            ◎
          </div>

          <div className="stat-label">
            Coding weekly goal
          </div>

          <div className="stat-value weekly-goal-value">

            {weeklyPlan
              ? weeklyStats.completed
              : "—"}

            <span>
              /
              {weeklyPlan
                ? weeklyStats.total
                : "—"}
            </span>

          </div>

          <div className="stat-footer">

            {!weeklyPlan
              ? "No weekly plan"
              : weeklyStats.total === 0
                ? "No coding tasks this week"
                : `${weeklyStats.progress}% complete`}

          </div>

        </div>


      </section>


      {/* ================================= */}
      {/* MAIN CODING GRID */}
      {/* ================================= */}

      <section className="coding-main-grid">


        {/* ACTIVITY */}

        <div className="coding-panel activity-panel">

          <div className="panel-header">

            <div>

              <h2>
                Problem-solving activity
              </h2>

              <p>
                Your solved coding problems
              </p>

            </div>

            <button
              className="panel-button"
            >
              All platforms
            </button>

          </div>


          {codingProblems.length === 0 ? (

            <div className="coding-empty">

              <div className="empty-icon">
                &lt;/&gt;
              </div>

              <h3>
                No coding problems yet
              </h3>

              <p>
                Start adding problems
                you've solved to build
                your coding history.
              </p>

              <button
                className="primary-action"
                onClick={
                  openProblemModal
                }
                disabled={
                  codingProfiles.length === 0
                }
              >
                Add your first problem
              </button>

              {codingProfiles.length === 0 && (

                <small>
                  Add a coding profile first.
                </small>

              )}

            </div>

          ) : (

            <div className="activity-chart">

              <div className="chart-y-axis">

                <span>
                  {maxActivity}
                </span>

                <span>
                  {Math.round(
                    maxActivity / 2
                  )}
                </span>

                <span>
                  0
                </span>

              </div>


              <div className="chart-area">

                <div
                  className="chart-grid-line line-top"
                />

                <div
                  className="chart-grid-line line-middle"
                />

                <div
                  className="chart-grid-line line-bottom"
                />


                <div className="bars">

                  {activityData.map(
                    week => {

                      const height =
                        week.count === 0
                          ? 3
                          : Math.max(
                              8,
                              (
                                week.count /
                                maxActivity
                              ) * 100
                            );

                      return (

                        <div
                          className="bar-column"
                          key={
                            week.label
                          }
                        >

                          <span className="bar-value">
                            {week.count}
                          </span>

                          <div
                            className="activity-bar"
                            style={{
                              height:
                                `${height}%`
                            }}
                          />

                          <span className="bar-label">
                            {week.label}
                          </span>

                        </div>

                      );

                    }
                  )}

                </div>

              </div>

            </div>

          )}

        </div>


        {/* PLATFORMS */}

        <div className="coding-panel platforms-panel">

          <div className="panel-header">

            <div>

              <h2>
                Platforms
              </h2>

              <p>
                Your connected coding profiles
              </p>

            </div>

          </div>


          {codingProfiles.length === 0 ? (

            <div className="platform-empty">

              <div className="empty-icon">
                ◉
              </div>

              <h3>
                No coding profiles
              </h3>

              <p>
                Add your coding platforms
                to start tracking progress.
              </p>

              <button
                className="primary-action"
                onClick={
                  openProfileModal
                }
              >
                Add coding profile
              </button>

            </div>

          ) : (

            <div className="platform-list">

              {codingProfiles.map(
                profile => (

                  <div
                    className="platform-row"
                    key={
                      profile._id
                    }
                  >

                    <div
                      className={
                        `platform-avatar ${
                          profile.platform
                            ?.toLowerCase()
                            .replace(
                              /\s/g,
                              "-"
                            )
                        }`
                      }
                    >

                      {getPlatformInitials(
                        profile.platform
                      )}

                    </div>


                    <div className="platform-info">

                      <strong>
                        {profile.platform}
                      </strong>

                      <span>
                        @{profile.username}
                      </span>

                    </div>


                    <div className="platform-number">

                      <strong>
                        {
                          Number(
                            profile.problemsSolved ||
                            0
                          )
                        }
                      </strong>

                      <span>
                        solved
                      </span>

                    </div>


                    <button
                      className="panel-button"
                      onClick={() =>
                        openEditProfileModal(
                          profile
                        )
                      }
                    >
                      Edit
                    </button>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </section>


      {/* ================================= */}
      {/* RECENT PROBLEMS */}
      {/* ================================= */}

      {codingProblems.length > 0 && (

        <section className="coding-panel recent-problems-panel">

          <div className="panel-header">

            <div>

              <div className="page-eyebrow">
                RECENT SOLVES
              </div>

              <h2>
                Keep the streak alive
              </h2>

            </div>

            <button
              className="primary-action small-action"
              onClick={
                openProblemModal
              }
              disabled={
                codingProfiles.length === 0
              }
            >
              + Add problem
            </button>

          </div>


          <div className="problem-table">

            <div className="problem-table-header">

              <span>
                Problem
              </span>

              <span>
                Platform
              </span>

              <span>
                Difficulty
              </span>

              <span>
                Topics
              </span>

              <span>
                Solved
              </span>

            </div>


            {[
              ...codingProblems
            ]
              .sort(
                (a, b) =>
                  new Date(
                    b.solvedDate
                  ) -
                  new Date(
                    a.solvedDate
                  )
              )
              .slice(0, 6)
              .map(problem => {

                const profile =
                  codingProfiles.find(
                    item =>
                      item._id ===
                      (
                        problem
                          .codingProfileId
                          ?._id ||
                        problem
                          .codingProfileId
                      )
                  );


                return (

                  <div
                    className="problem-table-row"
                    key={
                      problem._id
                    }
                  >

                    <div className="problem-title">

                      <strong>
                        {problem.title}
                      </strong>

                      <a
                        href={
                          problem.problemURL
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open ↗
                      </a>

                    </div>


                    <span>

                      {
                        profile?.platform ||
                        problem
                          .codingProfileId
                          ?.platform ||
                        "—"
                      }

                    </span>


                    <span>

                      <span
                        className={
                          `difficulty-badge ${
                            problem
                              .difficulty
                              ?.toLowerCase()
                          }`
                        }
                      >
                        {
                          problem.difficulty
                        }
                      </span>

                    </span>


                    <span className="topics-cell">

                      {
                        problem.topics
                          ?.slice(0, 2)
                          .join(" · ") ||
                        "—"
                      }

                    </span>


                    <span>

                      {new Date(
                        problem.solvedDate
                      ).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric"
                        }
                      )}

                    </span>

                  </div>

                );

              })}

          </div>

        </section>

      )}


      {/* ================================= */}
      {/* ADD / EDIT PROFILE MODAL */}
      {/* ================================= */}

      {showProfileModal && (

        <div
          className="modal-overlay"
          onMouseDown={
            event => {

              if (
                event.target ===
                event.currentTarget
              ) {

                setShowProfileModal(
                  false
                );

                setEditingProfileId(
                  null
                );

              }

            }
          }
        >

          <div className="modal-card">

            <div className="modal-header">

              <div>

                <div className="page-eyebrow">
                  CODING PROFILE
                </div>

                <h2>
                  {editingProfileId
                    ? "Edit coding profile"
                    : "Add coding profile"}
                </h2>

                <p>
                  Keep your coding platform
                  information up to date.
                </p>

              </div>

              <button
                className="modal-close"
                onClick={() => {

                  setShowProfileModal(
                    false
                  );

                  setEditingProfileId(
                    null
                  );

                }}
              >
                ×
              </button>

            </div>


            <form
              onSubmit={
                handleSaveProfile
              }
              className="coding-form"
            >

              {/* PLATFORM */}

              <label>

                Platform

                <select
                  name="platform"
                  value={
                    profileForm.platform
                  }
                  onChange={
                    handleProfileChange
                  }
                  required
                >

                  <option value="">
                    Select platform
                  </option>

                  {SUPPORTED_PLATFORMS.map(
                    platform => (

                      <option
                        key={platform}
                        value={platform}
                      >
                        {platform}
                      </option>

                    )
                  )}

                </select>

              </label>


              {/* USERNAME */}

              <label>

                Username

                <input
                  type="text"
                  name="username"
                  value={
                    profileForm.username
                  }
                  onChange={
                    handleProfileChange
                  }
                  placeholder="your username"
                  required
                />

              </label>


              {/* PROFILE URL */}

              <label>

                Profile URL

                <input
                  type="url"
                  name="profileURL"
                  value={
                    profileForm.profileURL
                  }
                  onChange={
                    handleProfileChange
                  }
                  placeholder="https://..."
                  required
                />

              </label>


              {/* RATING */}

              <label>

                Rating

                <input
                  type="number"
                  name="rating"
                  min="0"
                  value={
                    profileForm.rating
                  }
                  onChange={
                    handleProfileChange
                  }
                />

              </label>


              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => {

                    setShowProfileModal(
                      false
                    );

                    setEditingProfileId(
                      null
                    );

                  }}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="primary-action"
                  disabled={
                    submitting
                  }
                >

                  {submitting
                    ? "Saving..."
                    : editingProfileId
                      ? "Save changes"
                      : "Add profile"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* ================================= */}
      {/* ADD PROBLEM MODAL */}
      {/* ================================= */}

      {showProblemModal && (

        <div
          className="modal-overlay"
          onMouseDown={
            event => {

              if (
                event.target ===
                event.currentTarget
              ) {

                setShowProblemModal(
                  false
                );

              }

            }
          }
        >

          <div className="modal-card">

            <div className="modal-header">

              <div>

                <div className="page-eyebrow">
                  CODING PROBLEM
                </div>

                <h2>
                  Add solved problem
                </h2>

                <p>
                  Record a problem you
                  solved manually.
                </p>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowProblemModal(
                    false
                  )
                }
              >
                ×
              </button>

            </div>


            <form
              onSubmit={
                handleCreateProblem
              }
              className="coding-form"
            >

              {/* CODING PLATFORM */}

              <label>

                Coding platform

                <select
                  name="codingProfileId"
                  value={
                    problemForm.codingProfileId
                  }
                  onChange={
                    handleProblemChange
                  }
                  required
                >

                  <option value="">
                    Select profile
                  </option>

                  {codingProfiles.map(
                    profile => (

                      <option
                        key={
                          profile._id
                        }
                        value={
                          profile._id
                        }
                      >
                        {profile.platform}
                        {" — "}
                        {profile.username}
                      </option>

                    )
                  )}

                </select>

              </label>


              {/* PROBLEM TITLE */}

              <label>

                Problem title

                <input
                  type="text"
                  name="title"
                  value={
                    problemForm.title
                  }
                  onChange={
                    handleProblemChange
                  }
                  placeholder="Two Sum"
                  required
                />

              </label>


              <div className="form-two-column">

                {/* DIFFICULTY */}

                <label>

                  Difficulty

                  <select
                    name="difficulty"
                    value={
                      problemForm.difficulty
                    }
                    onChange={
                      handleProblemChange
                    }
                    required
                  >

                    <option value="Easy">
                      Easy
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="Hard">
                      Hard
                    </option>

                  </select>

                </label>


                {/* SOLVED DATE */}

                <label>

                  Solved date

                  <input
                    type="date"
                    name="solvedDate"
                    value={
                      problemForm.solvedDate
                    }
                    onChange={
                      handleProblemChange
                    }
                    required
                  />

                </label>

              </div>


              {/* TOPICS */}

              <label>

                Topics

                <input
                  type="text"
                  name="topics"
                  value={
                    problemForm.topics
                  }
                  onChange={
                    handleProblemChange
                  }
                  placeholder={
                    "Array, Hashing, Two Pointers"
                  }
                  required
                />

                <small>
                  Separate topics using commas.
                </small>

              </label>


              {/* PROBLEM URL */}

              <label>

                Problem URL

                <input
                  type="url"
                  name="problemURL"
                  value={
                    problemForm.problemURL
                  }
                  onChange={
                    handleProblemChange
                  }
                  placeholder={
                    "https://leetcode.com/problems/..."
                  }
                  required
                />

              </label>


              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-action"
                  onClick={() =>
                    setShowProblemModal(
                      false
                    )
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="primary-action"
                  disabled={
                    submitting
                  }
                >

                  {submitting
                    ? "Saving..."
                    : "Add problem"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}

export default Coding;