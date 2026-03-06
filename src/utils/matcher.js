// Job matching logic

class Matcher {
  // Calculate matching score between resume and job
  static calculateMatch(resumeSkills, jdSkills) {
    if (!jdSkills || jdSkills.length === 0) {
      return { matchingScore: 0, skillsAnalysis: [] };
    }

    const resumeSkillsLower = resumeSkills.map(s => s.toLowerCase());
    const skillsAnalysis = [];
    let matchedCount = 0;

    jdSkills.forEach(skill => {
      const presentInResume = resumeSkillsLower.includes(skill.toLowerCase());
      if (presentInResume) {
        matchedCount++;
      }
      skillsAnalysis.push({
        skill: skill,
        presentInResume: presentInResume
      });
    });

    const matchingScore = Math.round((matchedCount / jdSkills.length) * 100);

    return { matchingScore, skillsAnalysis };
  }

  // Match resume against multiple jobs
  static matchResumeToJobs(resumeData, jobs) {
    const matchingJobs = [];

    jobs.forEach(job => {
      const { matchingScore, skillsAnalysis } = this.calculateMatch(
        resumeData.resumeSkills,
        job.skills
      );

      matchingJobs.push({
        jobId: job.jobId,
        role: job.role,
        aboutRole: job.about,
        requiredSkills: job.skills,
        optionalSkills: job.optionalSkills || [],
        salary: job.salary,
        experience: job.experience,
        skillsAnalysis: skillsAnalysis,
        matchingScore: matchingScore
      });
    });

    // Sort by matching score descending
    matchingJobs.sort((a, b) => b.matchingScore - a.matchingScore);

    return matchingJobs;
  }
}

module.exports = Matcher;
