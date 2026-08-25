const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const analyzeResumeWithAI = async (resumeText) => {
    const prompt = `
You are an expert ATS resume evaluator.
You are reviewed resume of the many students from the tier-1 colleges and you have also conduceted interviews of the student by reviewing theirs resume 
soo analyze the resume and give me real answer for this student give real and honest answere
Analyze the following resume and provide an objective evaluation.

Resume:
----------------
${resumeText}
----------------

Evaluate:
1. Overall ATS score from 0 to 100
2. Short summary of the resume
3. Main strengths
4. Main weaknesses
5. Missing or weak skills
6. Specific improvement suggestions

Return ONLY valid JSON in exactly this structure:

{
    "atsScore": 0,
    "summary": "",
    "strengths": [],
    "weaknesses": [],
    "missingSkills": [],
    "suggestions": []
}

Rules:
- atsScore must be a number between 0 and 100.
- strengths must be an array of strings.
- weaknesses must be an array of strings.
- missingSkills must be an array of strings.
- suggestions must be an array of strings.
- Do not include markdown.
- Do not include explanations outside the JSON.
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

    const content = response.choices[0].message.content;

    return JSON.parse(content);
};

module.exports = {
    analyzeResumeWithAI
};