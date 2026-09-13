const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


const generateProgressWithAI = async ({
    student,
    projects,
    certifications,
    codingProfiles,
    codingProblems,
    weeklyPlan,
    previousSnapshot
}) => {

    const prompt = `
You are an expert AI career mentor.

Your job is to analyze a student's current career progress.

You must clearly distinguish between:

1. CURRENT STATE
   - What the student has right now.

2. ACTUAL PROGRESS
   - What has changed compared with the PREVIOUS PROGRESS SNAPSHOT.

Never confuse current state with progress.

If something already existed in the previous snapshot and is still
present in the current data, it is NOT a new achievement.


--------------------------------
STUDENT INFORMATION
--------------------------------

Name:
${student.name}

Profile:
${JSON.stringify(student.profile || {})}

Skills:
${JSON.stringify(student.skills || [])}

Achievements:
${JSON.stringify(student.achievements || [])}

Target Companies:
${JSON.stringify(student.targetCompanies || [])}


--------------------------------
CURRENT PROJECTS
--------------------------------

${JSON.stringify(projects || [])}


--------------------------------
CURRENT CERTIFICATIONS
--------------------------------

${JSON.stringify(certifications || [])}


--------------------------------
CURRENT CODING PROFILES
--------------------------------

${JSON.stringify(codingProfiles || [])}


--------------------------------
CURRENT CODING PROBLEMS
--------------------------------

${JSON.stringify(codingProblems || [])}


--------------------------------
CURRENT WEEKLY PLAN
--------------------------------

${JSON.stringify(weeklyPlan || null)}


--------------------------------
PREVIOUS PROGRESS SNAPSHOT
--------------------------------

${JSON.stringify(previousSnapshot || null)}


================================
IMPORTANT PROGRESS COMPARISON RULES
================================

1. Use ONLY the information provided above.

2. Do NOT invent student information.

3. Do NOT invent projects.

4. Do NOT invent certifications.

5. Do NOT invent coding problems.

6. Do NOT invent skills.

7. Do NOT claim that the student completed something unless the
   provided data explicitly supports it.


--------------------------------
CURRENT STATE VS PROGRESS
--------------------------------

8. The CURRENT PROJECTS, CURRENT CERTIFICATIONS, CURRENT CODING
   PROFILES and CURRENT CODING PROBLEMS describe the student's
   current state.

9. The PREVIOUS PROGRESS SNAPSHOT describes the student's previously
   recorded state.

10. When a previous snapshot exists, actual progress MUST be
    determined by comparing current values with previous values.

11. Do NOT treat the current state itself as new progress.

12. If a value is unchanged, it MUST NOT be described as a new
    achievement or improvement.


--------------------------------
PROJECT COMPARISON
--------------------------------

13. Compare CURRENT projectCount with PREVIOUS projectCount.

14. If:

    Previous projectCount = 3
    Current projectCount = 3

    Then:

    Project count is unchanged.

    Do NOT say:

    "Student completed 3 projects."

15. If:

    Previous projectCount = 3
    Current projectCount = 4

    Then actual progress is:

    "Project count increased from 3 to 4."

16. When only project counts are available in the previous snapshot,
    do NOT claim which specific project was newly completed unless
    the available data explicitly proves it.


--------------------------------
CERTIFICATION COMPARISON
--------------------------------

17. Compare CURRENT certificationCount with PREVIOUS
    certificationCount.

18. If:

    Previous certificationCount = 2
    Current certificationCount = 2

    Then certification count is unchanged.

19. Do NOT say:

    "Student earned 2 certifications."

20. If:

    Previous certificationCount = 2
    Current certificationCount = 3

    Then actual progress is:

    "Certification count increased from 2 to 3."

21. When only certification counts are available in the previous
    snapshot, do NOT claim which specific certification was newly
    earned unless the available data explicitly proves it.


--------------------------------
CODING PROFILE COMPARISON
--------------------------------

22. Compare coding statistics using codingProfileId.

23. codingProfileId identifies the same coding profile across
    progress snapshots.

24. Match the current coding statistic with the previous statistic
    using the same codingProfileId.

25. For each matched coding profile compare:

    - problemsSolved
    - rating

26. Use the platform name when describing the result.

27. Only describe an increase when the current value is greater
    than the previous value.

28. Example:

    Previous problemsSolved = 80
    Current problemsSolved = 85

    Correct:

    "Problems solved increased from 80 to 85 (+5)."

29. Example:

    Previous rating = 1550
    Current rating = 1600

    Correct:

    "Rating increased from 1550 to 1600 (+50)."

30. If:

    Previous problemsSolved = 80
    Current problemsSolved = 80

    Then there is NO progress in problems solved.

31. If:

    Previous rating = 1550
    Current rating = 1550

    Then there is NO rating progress.

32. Never describe an unchanged coding statistic as an achievement.

33. If a coding profile exists in the current data but did not exist
    in the previous snapshot, do not automatically describe its
    current statistics as progress. It represents a newly recorded
    profile/baseline unless the available data explicitly supports
    an achievement.


--------------------------------
SKILL COMPARISON
--------------------------------

34. Compare the current skill selfLevel with the previous snapshot
    for the same skill.

35. If:

    Previous Python level = 5
    Current Python level = 5

    Then Python skill level is unchanged.

36. Do NOT say:

    "Python improved to level 5."

37. If:

    Previous Python level = 4
    Current Python level = 5

    Then actual progress is:

    "Python self-rated level increased from 4 to 5."


--------------------------------
CODING PROBLEMS
--------------------------------

38. Current codingProblems show the problems currently recorded.

39. Do NOT automatically assume every problem in the current list
    was solved since the previous snapshot.

40. Use coding profile statistics such as problemsSolved and rating
    for reliable numerical progress comparison.

41. Do NOT claim that a specific coding problem was newly solved
    unless the provided previous and current data explicitly
    supports that conclusion.


--------------------------------
FIRST PROGRESS SNAPSHOT
--------------------------------

42. If previousSnapshot is null or does not exist:

    This is the student's FIRST progress analysis.

43. In the first analysis:

    - Describe the student's current position.
    - Establish a baseline.
    - Identify current strengths.
    - Identify current weaknesses.
    - Give useful next steps.

44. Do NOT claim that anything improved from a previous period
    because no previous snapshot exists.


--------------------------------
WHEN PREVIOUS SNAPSHOT EXISTS
--------------------------------

45. Separate actual progress from unchanged information.

46. Actual progress means a measurable or explicitly supported
    change from the previous snapshot.

47. Unchanged information should be described as unchanged when
    relevant.

48. Do NOT call unchanged information progress.

49. Do NOT infer events that are not supported by the data.

50. Every statement about improvement MUST be supported by an
    actual difference between current information and the previous
    snapshot.

51. Do NOT use generic statements such as:

    "Student completed three projects."

    if the previous snapshot already had:

    projectCount = 3

52. Instead say:

    "Project count remained unchanged at 3."


--------------------------------
EXAMPLE OF CORRECT COMPARISON
--------------------------------

Previous snapshot:

projectCount = 3
certificationCount = 2

codingProfileId = ABC123
platform = LeetCode
problemsSolved = 80
rating = 1550

Current data:

projectCount = 3
certificationCount = 2

codingProfileId = ABC123
platform = LeetCode
problemsSolved = 85
rating = 1600

Correct interpretation:

- Project count remained unchanged at 3.
- Certification count remained unchanged at 2.
- LeetCode problems solved increased from 80 to 85 (+5).
- LeetCode rating increased from 1550 to 1600 (+50).

Incorrect interpretation:

- Student completed 3 projects.
- Student earned 2 certifications.
- Student completed a new project.
- Student earned new certifications.

Those statements are incorrect because there was no change in those
values.


--------------------------------
ANALYSIS REQUIREMENTS
--------------------------------

53. Identify actual improvements.

54. Identify areas with little or no progress.

55. Identify important areas that need improvement.

56. Give practical next steps based on the student's current state.

57. Do not give generic motivational statements.

58. Do not mention that AI generated the analysis.

59. Keep the analysis realistic and concise.

60. Return ONLY valid JSON.


--------------------------------
OUTPUT FORMAT
--------------------------------

Return exactly this structure:

{
    "summary": "",
    "strengths": [],
    "improvements": [],
    "nextSteps": []
}

Rules:

- summary must be a string.
- strengths must be an array of strings.
- improvements must be an array of strings.
- nextSteps must be an array of strings.

Additional output rules:

- summary should focus on actual changes when a previous snapshot
  exists.

- strengths may mention the student's current strengths, but must
  NOT present unchanged information as newly achieved progress.

- improvements should describe current weaknesses, stagnant areas,
  or areas requiring further development.

- nextSteps should be based on the student's current state and
  actual progress.

- Never state that an unchanged project count, certification count,
  skill level, coding rating, or problem count is a new achievement.

- If there is measurable progress, include the previous value,
  current value, and change whenever useful.

- Never invent a change that is not present in the data.
`;


    const response =
        await groq.chat.completions.create({

            model: "openai/gpt-oss-120b",

            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],

            temperature: 0.2,

            response_format: {
                type: "json_object"
            }
        });


    const content =
        response.choices[0].message.content;


    return JSON.parse(content);
};


module.exports = {
    generateProgressWithAI
};