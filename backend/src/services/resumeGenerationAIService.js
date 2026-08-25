const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const generateResumeWithAI = async ({
    student,
    projects,
    certifications,
    targetRole
}) => {

    const prompt = `
You are an expert professional resume writer.

Generate a professional, ATS-friendly resume for the student below.

TARGET ROLE:
${targetRole}

STUDENT INFORMATION:
Name: ${student.name}
Email: ${student.email}
Phone: ${student.profile?.phone || ""}
College: ${student.profile?.college || ""}
Branch: ${student.profile?.branch || ""}
CGPA: ${student.profile?.cgpa || ""}
Graduation Year: ${student.profile?.graduationYear || ""}
GitHub: ${student.profile?.github || ""}

SKILLS:
${JSON.stringify(student.skills || [])}

SELECTED PROJECTS:
${JSON.stringify(projects || [])}

SELECTED CERTIFICATIONS:
${JSON.stringify(certifications || [])}

IMPORTANT RULES:

1. Do NOT invent any student information.
2. Do NOT invent projects.
3. Do NOT invent certifications.
4. Do NOT invent skills.
5. Use ONLY the information provided above.
6. Improve wording and presentation where appropriate.
7. Make project descriptions professional and ATS-friendly.
8. Keep the resume suitable for the target role.
9. Do not include a profile picture.
10. Do not include Codolio.
11. Do not include an objective section unless it provides real value.
12. Do not add fake achievements, experience, internships or awards.
13. Do not mention that AI generated the resume.
14. Return ONLY valid JSON.

Return exactly this structure:

{
    "professionalSummary": "",
    "education": {
        "college": "",
        "branch": "",
        "cgpa": "",
        "graduationYear": ""
    },
    "skills": [
        {
            "category": "",
            "items": []
        }
    ],
    "projects": [
        {
            "title": "",
            "technologies": [],
            "description": "",
            "githubLink": "",
            "liveDemoLink": ""
        }
    ],
    "certifications": [
        {
            "title": "",
            "issuer": "",
            "issueDate": "",
            "credentialURL": ""
        }
    ],
    "achievements": []
}

Rules for arrays:
- skills must be an array.
- projects must be an array.
- certifications must be an array.
- achievements must be an array.
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
    generateResumeWithAI
};