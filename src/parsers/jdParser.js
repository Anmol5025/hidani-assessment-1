const Extractors = require('../utils/extractors');

class JDParser {
  // Parse job description text
  static parseJD(text, jobId) {
    const role = Extractors.extractRole(text);
    const salary = Extractors.extractSalary(text);
    const experience = Extractors.extractExperience(text);
    const skills = Extractors.extractSkills(text);
    const about = Extractors.extractAbout(text);

    // Separate required and optional skills (basic heuristic)
    const requiredSkills = [];
    const optionalSkills = [];

    const lowerText = text.toLowerCase();
    const requiredSection = lowerText.indexOf('required');
    const optionalSection = lowerText.indexOf('optional');
    const desiredSection = lowerText.indexOf('desired');
    const preferredSection = lowerText.indexOf('preferred');

    skills.forEach(skill => {
      const skillIndex = lowerText.indexOf(skill.toLowerCase());
      
      if (skillIndex === -1) {
        requiredSkills.push(skill);
        return;
      }

      const isInOptional = (optionalSection !== -1 && skillIndex > optionalSection) ||
                          (desiredSection !== -1 && skillIndex > desiredSection) ||
                          (preferredSection !== -1 && skillIndex > preferredSection);

      if (isInOptional && requiredSection !== -1 && skillIndex < requiredSection) {
        requiredSkills.push(skill);
      } else if (isInOptional) {
        optionalSkills.push(skill);
      } else {
        requiredSkills.push(skill);
      }
    });

    return {
      jobId: jobId || `JD${Date.now()}`,
      role,
      salary,
      experience,
      skills: requiredSkills.length > 0 ? requiredSkills : skills,
      optionalSkills,
      about
    };
  }

  // Parse multiple JDs from a single file
  static parseMultipleJDs(text) {
    const samples = text.split(/Sample \d+:/i).filter(s => s.trim());
    const jobs = [];

    samples.forEach((sample, index) => {
      if (sample.trim()) {
        const jobId = `JD${String(index + 1).padStart(3, '0')}`;
        const parsedJD = this.parseJD(sample, jobId);
        jobs.push(parsedJD);
      }
    });

    return jobs;
  }
}

module.exports = JDParser;
