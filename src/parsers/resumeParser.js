const pdfParse = require('pdf-parse');
const Extractors = require('../utils/extractors');

class ResumeParser {
  // Parse PDF resume
  static async parsePDF(buffer) {
    try {
      const data = await pdfParse(buffer);
      return this.parseText(data.text);
    } catch (error) {
      throw new Error(`PDF parsing failed: ${error.message}`);
    }
  }

  // Parse text resume
  static parseText(text) {
    const name = Extractors.extractName(text);
    const yearOfExperience = Extractors.extractExperience(text) || 0;
    const resumeSkills = Extractors.extractSkills(text);
    const salary = Extractors.extractSalary(text);

    return {
      name,
      salary,
      yearOfExperience,
      resumeSkills
    };
  }
}

module.exports = ResumeParser;
