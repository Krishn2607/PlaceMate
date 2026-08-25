const PDFDocument = require("pdfkit");

const generateResumePDF = async (resumeData) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: "A4",
                margin: 50
            });

            const chunks = [];

            doc.on("data", (chunk) => {
                chunks.push(chunk);
            });

            doc.on("end", () => {
                const pdfBuffer = Buffer.concat(chunks);
                resolve(pdfBuffer);
            });

            doc.on("error", reject);

            // =========================
            // HEADER
            // =========================

            doc
                .fontSize(22)
                .font("Helvetica-Bold")
                .text(resumeData.name || "", {
                    align: "center"
                });

            doc.moveDown(0.3);

            const contactDetails = [];

            if (resumeData.email) {
                contactDetails.push(resumeData.email);
            }

            if (resumeData.phone) {
                contactDetails.push(resumeData.phone);
            }

            if (resumeData.github) {
                contactDetails.push(resumeData.github);
            }

            if (contactDetails.length > 0) {
                doc
                    .fontSize(9)
                    .font("Helvetica")
                    .text(contactDetails.join(" | "), {
                        align: "center"
                    });
            }

            doc.moveDown();

            // =========================
            // PROFESSIONAL SUMMARY
            // =========================

            addSection(doc, "PROFESSIONAL SUMMARY");

            doc
                .fontSize(10)
                .font("Helvetica")
                .text(
                    resumeData.professionalSummary || ""
                );

            // =========================
            // EDUCATION
            // =========================

            if (resumeData.education) {
                addSection(doc, "EDUCATION");

                const education =
                    resumeData.education;

                doc
                    .fontSize(11)
                    .font("Helvetica-Bold")
                    .text(education.college || "");

                const educationDetails = [];

                if (education.branch) {
                    educationDetails.push(
                        education.branch
                    );
                }

                if (education.cgpa) {
                    educationDetails.push(
                        `CGPA: ${education.cgpa}`
                    );
                }

                if (education.graduationYear) {
                    educationDetails.push(
                        `Graduation: ${education.graduationYear}`
                    );
                }

                if (educationDetails.length > 0) {
                    doc
                        .fontSize(9)
                        .font("Helvetica")
                        .text(
                            educationDetails.join(" | ")
                        );
                }

                doc.moveDown(0.3);
            }

            // =========================
            // SKILLS
            // =========================

            if (
                Array.isArray(resumeData.skills) &&
                resumeData.skills.length > 0
            ) {
                addSection(doc, "TECHNICAL SKILLS");

                resumeData.skills.forEach((skillGroup) => {
                    if (
                        !skillGroup.category ||
                        !Array.isArray(skillGroup.items)
                    ) {
                        return;
                    }

                    doc
                        .fontSize(10)
                        .font("Helvetica-Bold")
                        .text(
                            `${skillGroup.category}: `,
                            {
                                continued: true
                            }
                        );

                    doc
                        .font("Helvetica")
                        .text(
                            skillGroup.items.join(", ")
                        );
                });

                doc.moveDown(0.3);
            }

            // =========================
            // PROJECTS
            // =========================

            if (
                Array.isArray(resumeData.projects) &&
                resumeData.projects.length > 0
            ) {
                addSection(doc, "PROJECTS");

                resumeData.projects.forEach((project) => {
                    doc
                        .fontSize(11)
                        .font("Helvetica-Bold")
                        .text(project.title || "");

                    if (
                        Array.isArray(project.technologies) &&
                        project.technologies.length > 0
                    ) {
                        doc
                            .fontSize(9)
                            .font("Helvetica-Oblique")
                            .text(
                                project.technologies.join(
                                    " | "
                                )
                            );
                    }

                    if (project.description) {
                        doc
                            .fontSize(9.5)
                            .font("Helvetica")
                            .text(
                                project.description
                            );
                    }

                    const links = [];

                    if (project.githubLink) {
                        links.push(
                            `GitHub: ${project.githubLink}`
                        );
                    }

                    if (project.liveDemoLink) {
                        links.push(
                            `Live: ${project.liveDemoLink}`
                        );
                    }

                    if (links.length > 0) {
                        doc
                            .fontSize(8.5)
                            .font("Helvetica")
                            .text(links.join(" | "));
                    }

                    doc.moveDown(0.5);
                });
            }

            // =========================
            // CERTIFICATIONS
            // =========================

            if (
                Array.isArray(resumeData.certifications) &&
                resumeData.certifications.length > 0
            ) {
                addSection(doc, "CERTIFICATIONS");

                resumeData.certifications.forEach(
                    (certification) => {
                        doc
                            .fontSize(10.5)
                            .font("Helvetica-Bold")
                            .text(
                                certification.title || ""
                            );

                        const details = [];

                        if (certification.issuer) {
                            details.push(
                                certification.issuer
                            );
                        }

                        if (certification.issueDate) {
                            details.push(
                                certification.issueDate
                            );
                        }

                        if (details.length > 0) {
                            doc
                                .fontSize(9)
                                .font("Helvetica")
                                .text(
                                    details.join(" | ")
                                );
                        }

                        if (
                            certification.credentialURL
                        ) {
                            doc
                                .fontSize(8.5)
                                .text(
                                    certification.credentialURL
                                );
                        }

                        doc.moveDown(0.3);
                    }
                );
            }

            // =========================
            // ACHIEVEMENTS
            // =========================

            if (
                Array.isArray(resumeData.achievements) &&
                resumeData.achievements.length > 0
            ) {
                addSection(doc, "ACHIEVEMENTS");

                resumeData.achievements.forEach(
                    (achievement) => {
                        doc
                            .fontSize(10)
                            .font("Helvetica-Bold")
                            .text(
                                achievement.title || ""
                            );

                        if (achievement.description) {
                            doc
                                .fontSize(9)
                                .font("Helvetica")
                                .text(
                                    achievement.description
                                );
                        }

                        doc.moveDown(0.3);
                    }
                );
            }

            doc.end();

        } catch (error) {
            reject(error);
        }
    });
};


// =========================
// SECTION HELPER
// =========================

const addSection = (doc, title) => {
    doc.moveDown(0.5);

    doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(title);

    doc.moveDown(0.2);

    doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .stroke();

    doc.moveDown(0.4);
};


module.exports = {
    generateResumePDF
};