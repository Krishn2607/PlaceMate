const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const generateWeeklyPlanWithAI = async ({
    student,
    projects,
    certifications,
    codingProfiles,
    codingProblems,
    previousPlan
}) => {

    const prompt = `
You are an expert AI career mentor.

Your job is to create a realistic and useful weekly development plan
for a student.

The plan must be based ONLY on the student's actual information.

STUDENT INFORMATION:

Name:
${student.name}

Email:
${student.email}

Profile:
${JSON.stringify(student.profile || {})}

Skills:
${JSON.stringify(student.skills || [])}

Achievements:
${JSON.stringify(student.achievements || [])}

Target Companies:
${JSON.stringify(student.targetCompanies || [])}


PROJECTS:
${JSON.stringify(projects || [])}


CERTIFICATIONS:
${JSON.stringify(certifications || [])}


CODING PROFILES:
${JSON.stringify(codingProfiles || [])}


CODING PROBLEMS:
${JSON.stringify(codingProblems || [])}


PREVIOUS WEEKLY PLAN:
${JSON.stringify(previousPlan || null)}


IMPORTANT RULES:

1. Analyze what the student has already completed.

2. Do NOT give tasks for things the student has clearly already completed
   unless additional improvement is genuinely useful.

3. Identify the most important next steps for the student's career.

4. Consider the student's projects, certifications, coding activity,
   skills and target companies.

5. The plan must be realistic for ONE WEEK.

6. Do NOT overload the student with too many tasks.

7. Prioritize the most valuable tasks.

8. Do NOT invent student information.

9. Do NOT invent completed projects.

10. Do NOT invent certifications.

11. Do NOT invent skills.

12. Do NOT claim that the student completed something unless the data
    explicitly shows it.

13. If there is a previous weekly plan, use it to understand what was
    already planned.

14. Do not simply repeat the previous week's tasks.

15. Generate tasks that represent the student's NEXT logical steps.

16. Keep the tasks actionable and specific.

17. The goal should describe the main objective of the week.

18. Every task MUST have exactly one category.

19. Use ONLY one of these categories:

    Coding
    Project
    Resume
    Aptitude
    Interview
    Learning
    Profile
    Other

20. Category definitions:

    Coding:
    Programming practice, DSA, coding problems, competitive programming,
    or coding interview practice.

    Project:
    Building, improving, testing, debugging, documenting, or deploying
    a project.

    Resume:
    Resume creation, resume improvement, resume tailoring, or resume review.

    Aptitude:
    Quantitative aptitude, logical reasoning, verbal aptitude,
    or placement-test practice.

    Interview:
    Technical interview preparation, HR preparation,
    mock interviews, interview questions, or communication practice.

    Learning:
    Learning or revising technical concepts, frameworks, libraries,
    tools, or subjects.

    Profile:
    GitHub, LinkedIn, portfolio, professional profile,
    or other career-profile improvements.

    Other:
    Any useful task that does not fit the categories above.

21. Only classify a task as Coding when the task is actually related
    to programming, DSA, coding problems, competitive programming,
    or coding interview practice.

22. If coding practice is appropriate for the student's current stage,
    include at least one Coding task.

23. Do not assign multiple categories to one task.

24. Do not put category information inside the title.

25. Generate approximately 5 to 8 tasks.

26. Return ONLY valid JSON.


Return exactly this structure:

{
    "goal": "",
    "tasks": [
        {
            "title": "",
            "category": ""
        }
    ]
}

The category must be exactly one of:

"Coding"
"Project"
"Resume"
"Aptitude"
"Interview"
"Learning"
"Profile"
"Other"
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
    generateWeeklyPlanWithAI
};