const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const analyzeResumeWithAI = async (
    resumeText,
    targetRole
) => {

    const prompt = `
You are an expert ATS resume evaluator and technical recruiter.

You evaluate resumes of students applying to modern technology
roles in the current AI-driven software industry. You evaluate resumes for relevance to the target role, technical skills, projects, keywords, education, experience, resume structure, measurable achievements, and overall job readiness.
You also evaluate the candidate's readiness for the AI era, including their ability to work with AI tools, AI/ML knowledge where relevant, modern development practices, cloud and deployment knowledge, automation, system design and scalability, ability to build real-world projects, and engineering fundamentals.
You provide an honest, realistic and objective evaluation of the candidate's resume for the target role.
Your job is to give an honest, realistic and objective evaluation.
Do NOT blindly praise the candidate.

Target Role:
----------------
${targetRole}
----------------

Resume:
----------------
${resumeText}
----------------

Analyze this resume specifically for the TARGET ROLE.

Evaluate the following:

1. ATS Score
Give an overall ATS score from 0 to 100 based on:
- relevance to the target role
- technical skills
- projects
- keywords
- education
- experience
- resume structure
- measurable achievements
- overall job readiness

2. Summary
Give a short and honest summary of the candidate's current profile.

3. Strengths
Identify the strongest aspects of the resume for the target role.

4. Improvements
Identify weaknesses or areas that should be improved in the current resume.

5. Missing Skills
Identify important technical skills, tools, concepts or experience
that are missing or weak for the target role.

Consider what is relevant in the current AI-driven software industry.

6. AI Era Readiness
Evaluate how prepared this candidate currently is for the target role
in today's AI-driven software industry.

Consider:
- ability to work with AI tools
- AI/ML knowledge where relevant
- modern development practices
- cloud and deployment knowledge
- automation
- system design and scalability
- ability to build real-world projects
- engineering fundamentals

Give an AI-era readiness score from 0 to 100 and a short assessment.

IMPORTANT:
Do not invent experience, projects, certifications or achievements
that are not present in the resume.

Return ONLY valid JSON.

Return exactly this structure:

{
    "atsScore": 0,
    "summary": "",
    "strengths": [],
    "improvements": [],
    "missingSkills": [],
    "aiEraReadiness": {
        "score": 0,
        "assessment": ""
    }
}

Rules:

- atsScore must be a number between 0 and 100.
- summary must be a string.
- strengths must be an array of strings.
- improvements must be an array of strings.
- missingSkills must be an array of strings.
- aiEraReadiness.score must be a number between 0 and 100.
- aiEraReadiness.assessment must be a string.
- Do not include markdown.
- Do not include explanations outside the JSON.
- Do not invent information.
`;

    const response = await groq.chat.completions.create({
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
    analyzeResumeWithAI
};