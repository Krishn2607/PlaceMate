import api from "./api";

export async function getDashboardData() {
  const [
    projectsResponse,
    certificationsResponse,
    codingProfilesResponse,
    codingProblemsResponse,
    resumesResponse,
    weeklyPlanResponse,
    progressResponse,
  ] = await Promise.allSettled([
    api.get("/projects"),
    api.get("/certifications"),
    api.get("/coding-profiles"),
    api.get("/coding-problems"),
    api.get("/resumes"),
    api.get("/weekly-plans/current"),
    api.get("/progress-snapshots/current"),
  ]);

  const getValue = (result, key, fallback) => {
    if (result.status !== "fulfilled") {
      return fallback;
    }

    return result.value.data?.[key] ?? fallback;
  };

  return {
    projects: getValue(projectsResponse, "projects", []),

    certifications: getValue(
      certificationsResponse,
      "certifications",
      []
    ),

    codingProfiles: getValue(
      codingProfilesResponse,
      "codingProfiles",
      []
    ),

    codingProblems: getValue(
      codingProblemsResponse,
      "codingProblems",
      []
    ),

    resumes: getValue(
      resumesResponse,
      "resumes",
      []
    ),

    weeklyPlan:
      weeklyPlanResponse.status === "fulfilled"
        ? weeklyPlanResponse.value.data?.weeklyPlan ?? null
        : null,

    progress:
      progressResponse.status === "fulfilled"
        ? progressResponse.value.data?.progress ?? null
        : null,
  };
}