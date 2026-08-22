const { PDFParse } = require("pdf-parse");

const extractResumeText = async (pdfBuffer) => {
    const parser = new PDFParse({
        data: pdfBuffer
    });

    try {
        const result = await parser.getText();

        return result.text;
    } finally {
        await parser.destroy();
    }
};

module.exports = {
    extractResumeText
};