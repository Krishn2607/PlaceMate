import {
  Check,
  RefreshCw,
  Sparkles,
  CalendarDays,
  Target,
  Circle,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  getCurrentWeeklyPlan,
  generateWeeklyPlan,
  updateWeeklyPlan,
} from "../services/weeklyPlanService";

import "./WeeklyPlan.css";

function WeeklyPlan() {
  const [plan, setPlan] = useState(null);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [updatingTask, setUpdatingTask] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      setLoading(true);
      setError("");

      const weeklyPlan =
        await getCurrentWeeklyPlan();

      setPlan(weeklyPlan);
    } catch (err) {
      if (err.response?.status === 404) {
        setPlan(null);
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load weekly plan."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    try {
      setGenerating(true);
      setError("");

      const weeklyPlan =
        await generateWeeklyPlan();

      setPlan(weeklyPlan);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to generate weekly plan."
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleTaskToggle = async (taskIndex) => {
    if (!plan || updatingTask !== null) {
      return;
    }

    try {
      setUpdatingTask(taskIndex);
      setError("");

      const updatedTasks =
        plan.tasks.map((task, index) => ({
          title: task.title,
          category: task.category || "Other",
          completed:
            index === taskIndex
              ? !task.completed
              : task.completed,
        }));

      const updatedPlan =
        await updateWeeklyPlan(
          plan._id,
          {
            tasks: updatedTasks,
          }
        );

      setPlan(updatedPlan);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update task."
      );
    } finally {
      setUpdatingTask(null);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getWeekRange = () => {
    if (!plan) {
      return "";
    }

    return `${formatDate(
      plan.weekStartDate
    )} – ${formatDate(plan.weekEndDate)}`;
  };

  const getCategoryClass = (category) => {
    return `weekly-task-category ${
      category
        ? category.toLowerCase()
        : "other"
    }`;
  };

  if (loading) {
    return (
      <div className="weekly-page-loading">
        <LoaderCircle
          size={22}
          className="spin"
        />

        <span>
          Loading your weekly plan...
        </span>
      </div>
    );
  }

  const tasks = plan?.tasks || [];

  const completedTasks =
    tasks.filter(
      (task) => task.completed
    ).length;

  const totalTasks = tasks.length;

  const calculatedPercentage =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100
        )
      : 0;

  const percentage =
    plan?.progress ?? calculatedPercentage;

  return (
    <div className="weekly-plan-page">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="weekly-page-header">

        <div>

          <div className="eyebrow">
            AI WEEKLY PLAN
          </div>

          <h1>
            A plan you can actually finish.
          </h1>

          <p>
            Your weekly preparation plan is generated
            from the progress and evidence already
            present in PlaceMate.
          </p>

        </div>

        {plan && (
          <button
            className="secondary-button weekly-regenerate-button"
            onClick={handleGeneratePlan}
            disabled={generating}
          >
            {generating ? (
              <LoaderCircle
                size={16}
                className="spin"
              />
            ) : (
              <RefreshCw size={16} />
            )}

            {generating
              ? "Generating..."
              : "Regenerate plan"}
          </button>
        )}

      </div>


      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="weekly-error">
          <AlertCircle size={17} />

          <span>{error}</span>
        </div>
      )}


      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {!plan && (
        <div className="weekly-empty-state">

          <div className="weekly-empty-icon">
            <Sparkles size={28} />
          </div>

          <div className="eyebrow">
            AI MENTOR
          </div>

          <h2>
            Your first weekly plan is waiting.
          </h2>

          <p>
            PlaceMate will use your current profile,
            skills, projects, certifications and
            coding activity to generate a focused
            one-week preparation plan.
          </p>

          <button
            className="primary-button"
            onClick={handleGeneratePlan}
            disabled={generating}
          >
            {generating ? (
              <LoaderCircle
                size={17}
                className="spin"
              />
            ) : (
              <Sparkles size={17} />
            )}

            {generating
              ? "AI is generating..."
              : "Generate weekly plan"}
          </button>

        </div>
      )}


      {/* =====================================================
          PLAN
      ====================================================== */}

      {plan && (
        <>

          {/* -------------------------------------------------
              PLAN SUMMARY
          -------------------------------------------------- */}

          <section className="weekly-summary">

            <div className="weekly-summary-main">

              <div className="weekly-summary-icon">
                <Target size={20} />
              </div>

              <div>

                <div className="card-eyebrow">
                  THIS WEEK'S GOAL
                </div>

                <h2>
                  {plan.goal}
                </h2>

                <div className="weekly-date">

                  <CalendarDays size={14} />

                  <span>
                    {getWeekRange()}
                  </span>

                </div>

              </div>

            </div>

            <div className="weekly-progress-score">

              <strong>
                {percentage}%
              </strong>

              <span>
                {completedTasks} of{" "}
                {totalTasks} complete
              </span>

            </div>

          </section>


          {/* -------------------------------------------------
              MAIN GRID
          -------------------------------------------------- */}

          <div className="weekly-content-grid">

            {/* =================================================
                TASKS
            ================================================== */}

            <section className="weekly-panel">

              <div className="weekly-panel-header">

                <div>

                  <div className="card-eyebrow">
                    YOUR ACTIONS
                  </div>

                  <h2>
                    This week's tasks
                  </h2>

                  <p>
                    Complete each action as you
                    move through the week.
                  </p>

                </div>

                <div className="weekly-status-badge">
                  {plan.status}
                </div>

              </div>


              {/* Progress */}

              <div className="weekly-progress-section">

                <div className="weekly-progress-label">

                  <span>
                    Weekly progress
                  </span>

                  <strong>
                    {percentage}%
                  </strong>

                </div>

                <div className="weekly-progress-track">

                  <div
                    className="weekly-progress-fill"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          percentage
                        )
                      )}%`,
                    }}
                  />

                </div>

              </div>


              {/* Task list */}

              <div className="weekly-task-list">

                {tasks.length === 0 ? (

                  <div className="weekly-no-tasks">

                    <Circle size={18} />

                    <span>
                      No tasks were generated
                      for this plan.
                    </span>

                  </div>

                ) : (

                  tasks.map(
                    (task, index) => {

                      const isUpdating =
                        updatingTask === index;

                      return (

                        <button
                          type="button"
                          className={`weekly-task ${
                            task.completed
                              ? "completed"
                              : ""
                          }`}
                          key={
                            task._id ||
                            index
                          }
                          onClick={() =>
                            handleTaskToggle(
                              index
                            )
                          }
                          disabled={
                            updatingTask !== null
                          }
                        >

                          <div
                            className={`weekly-task-check ${
                              task.completed
                                ? "checked"
                                : ""
                            }`}
                          >

                            {isUpdating ? (

                              <LoaderCircle
                                size={15}
                                className="spin"
                              />

                            ) : task.completed ? (

                              <Check
                                size={15}
                              />

                            ) : (

                              <span />

                            )}

                          </div>


                          <div className="weekly-task-number">

                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}

                          </div>


                          <div className="weekly-task-content">

                            <strong>
                              {task.title}
                            </strong>

                            <div className="weekly-task-meta">

                              <span
                                className={getCategoryClass(
                                  task.category
                                )}
                              >
                                {task.category ||
                                  "Other"}
                              </span>

                              <span>
                                {task.completed
                                  ? "Completed"
                                  : "Pending"}
                              </span>

                            </div>

                          </div>


                          <div className="weekly-task-arrow">
                            →
                          </div>

                        </button>

                      );
                    }
                  )

                )}

              </div>

            </section>


            {/* =================================================
                AI MENTOR CARD
            ================================================== */}

            <aside className="weekly-ai-panel">

              <div className="weekly-ai-icon">
                <Sparkles size={21} />
              </div>

              <div className="card-eyebrow">
                AI MENTOR
              </div>

              <h2>
                Built around your current
                preparation.
              </h2>

              <p>
                This plan isn't a generic checklist.
                The backend AI considers the
                information you've already added to
                PlaceMate before creating the week's
                actions.
              </p>

              <div className="ai-plan-details">

                <div>

                  <span>
                    Tasks
                  </span>

                  <strong>
                    {totalTasks}
                  </strong>

                </div>

                <div>

                  <span>
                    Completed
                  </span>

                  <strong>
                    {completedTasks}
                  </strong>

                </div>

                <div>

                  <span>
                    Status
                  </span>

                  <strong>
                    {plan.status}
                  </strong>

                </div>

              </div>

              <div className="ai-plan-note">

                <Sparkles size={15} />

                <span>
                  Each task is categorized so
                  PlaceMate can track coding,
                  projects, learning and other
                  preparation separately.
                </span>

              </div>

            </aside>

          </div>

        </>
      )}

    </div>
  );
}

export default WeeklyPlan;