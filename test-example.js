// Example test script demonstrating the parsing logic
const ResumeParser = require('./src/parsers/resumeParser');
const JDParser = require('./src/parsers/jdParser');
const Matcher = require('./src/utils/matcher');
const fs = require('fs');

// Sample resume text
const sampleResume = `
John Doe
Senior Software Engineer
john.doe@email.com | +1-234-567-8900

PROFESSIONAL SUMMARY
Experienced software engineer with 5 years of hands-on experience in full-stack development.
Salary expectation: 15 LPA

SKILLS
- Programming: Java, Python, JavaScript, TypeScript
- Frameworks: Spring Boot, React, Node.js, Express
- Databases: MySQL, MongoDB, PostgreSQL
- DevOps: Docker, Kubernetes, Jenkins, AWS
- Tools: Git, REST API, Microservices, Kafka

EXPERIENCE
Senior Developer at Tech Corp (2021 - Present)
- Developed microservices using Spring Boot and Kafka
- Implemented CI/CD pipelines with Jenkins

Software Engineer at StartupXYZ (2019 - 2021)
- Built React applications with Node.js backend
- Worked with MongoDB and PostgreSQL databases
`;

console.log('=== RESUME PARSING TEST ===\n');

// Parse resume
const resumeData = ResumeParser.parseText(sampleResume);
console.log('Parsed Resume:');
console.log(JSON.stringify(resumeData, null, 2));

console.log('\n=== JOB DESCRIPTION PARSING TEST ===\n');

// Read and parse JD file
const jdText = fs.readFileSync('JD.txt', 'utf-8');
const jobs = JDParser.parseMultipleJDs(jdText);

console.log(`Parsed ${jobs.length} job descriptions`);
console.log('\nFirst 3 Jobs:');
jobs.slice(0, 3).forEach(job => {
  console.log(`\n${job.jobId}: ${job.role}`);
  console.log(`Experience: ${job.experience || 'Not specified'}`);
  console.log(`Salary: ${job.salary || 'Not specified'}`);
  console.log(`Skills: ${job.skills.slice(0, 5).join(', ')}...`);
});

console.log('\n=== MATCHING TEST ===\n');

// Match resume to jobs
const matchingJobs = Matcher.matchResumeToJobs(resumeData, jobs);

console.log('Top 5 Matching Jobs:');
matchingJobs.slice(0, 5).forEach(job => {
  console.log(`\n${job.jobId}: ${job.role}`);
  console.log(`Matching Score: ${job.matchingScore}%`);
  console.log(`Matched Skills: ${job.skillsAnalysis.filter(s => s.presentInResume).length}/${job.skillsAnalysis.length}`);
});

console.log('\n=== SAMPLE OUTPUT JSON ===\n');

const output = {
  ...resumeData,
  matchingJobs: matchingJobs.slice(0, 2)
};

console.log(JSON.stringify(output, null, 2));

console.log('\n=== TEST COMPLETE ===');
console.log('\nTo run the web application:');
console.log('1. Run: npm start');
console.log('2. Open: http://localhost:3000');
console.log('3. Upload JD.txt and sample-resume.txt');
