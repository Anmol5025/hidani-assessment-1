# Resume Parsing and Job Matching System

A rule-based system to parse resumes, extract job descriptions, and match candidates to jobs using regex patterns and text processing.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation & Running

1. **Install dependencies:**
```bash
npm install
```

2. **Start the server:**
```bash
npm start
```

3. **Access the application:**
Open your browser and navigate to: `http://localhost:3000`

### Quick Test

Run the test script to verify everything works:
```bash
node test-example.js
```

This will parse sample data and display matching results in the console.

## Technical Requirements Compliance

### Preferred Language
 Node.js

### Allowed Libraries
 regex (built-in JavaScript)
 pdf-parse (for PDF parsing)

Note: Express, CORS, and Multer are used for API/server infrastructure, not for parsing logic.

### Code Quality
 Clean modular code with separation of concerns
 Reusable extraction and matching functions
 Proper error handling

## Evaluation Criteria

### 1. Extraction Accuracy (40%)

**Salary Extraction:**
- Patterns: `12 LPA`, `₹10,00,000 per annum`, `$180,000`, `CTC: 15 lakhs`
- Handles: LPA, lakhs, CTC, salary, compensation keywords
- Supports: ₹, $, INR, Rs formats

**Experience Extraction:**
- Patterns: `5 years`, `3-5 years`, `7+ years`, `fresher`, `entry-level`
- Date range calculation: `2019 - 2021` = 2 years
- Multiple date ranges are summed
- Returns numeric value (0 for fresher)

**Skills Extraction:**
- 100+ technology skills database
- Categories: Programming, Web, Backend, Databases, Cloud, DevOps, AI/ML
- Case-insensitive matching with word boundaries
- Exact skill matching to avoid false positives

### 2. Matching Logic and Score Calculation (25%)

Formula: `(Matched Skills / Total JD Skills) × 100`

```javascript
// Example:
// Resume Skills: [Java, Python, MySQL, Docker]
// JD Skills: [Java, Python, Kafka, MySQL, Redis]
// Matched: 3 (Java, Python, MySQL)
// Score: (3/5) × 100 = 60%
```

All JD skills displayed with `presentInResume` boolean flag.
Jobs sorted by matching score (descending).

### 3. Code Quality and Structure (20%)

```
src/
├── utils/
│   ├── extractors.js    # Salary, experience, skills, name extraction
│   └── matcher.js        # Matching logic and scoring
├── parsers/
│   ├── resumeParser.js   # Resume parsing (PDF/TXT)
│   └── jdParser.js       # Job description parsing
├── routes/
│   └── api.js            # REST API endpoints
└── server.js             # Express server
```

- Modular architecture with clear separation
- Reusable utility functions
- Clean, commented code
- Proper error handling

### 4. Performance and Efficiency (10%)

- In-memory storage for fast access
- Efficient regex patterns with word boundaries
- Single-pass skill extraction
- Optimized matching algorithm O(n×m)

### 5. Documentation (5%)

- Complete README with all sections
- Code comments explaining logic
- API documentation
- Usage examples

## Project Structure

```
resume-job-matcher/
├── src/
│   ├── utils/
│   │   ├── extractors.js      # Core extraction logic
│   │   └── matcher.js          # Matching and scoring
│   ├── parsers/
│   │   ├── resumeParser.js     # Resume parsing
│   │   └── jdParser.js         # JD parsing
│   ├── routes/
│   │   └── api.js              # API endpoints
│   └── server.js               # Server setup
├── public/
│   └── index.html              # Web UI
├── JD.txt                      # Sample job descriptions
├── sample-resume.txt           # Sample resume
├── test-example.js             # Test script
└── package.json
```

## API Endpoints

### POST /api/parse-resume
Upload and parse resume, get matching jobs

```bash
curl -X POST http://localhost:3000/api/parse-resume \
  -F "resume=@sample-resume.txt"
```

### POST /api/upload-jd
Upload job descriptions file

```bash
curl -X POST http://localhost:3000/api/upload-jd \
  -F "jd=@JD.txt"
```

### GET /api/jobs
Get all job descriptions

```bash
curl http://localhost:3000/api/jobs
```

### GET /api/resumes
Get all uploaded resumes

```bash
curl http://localhost:3000/api/resumes
```

### GET /api/match/:resumeId
Match specific resume to all jobs

```bash
curl http://localhost:3000/api/match/1234567890
```

## Sample Output

See `sample-output.json` for a complete example.

### Output Format

```json
{
  "name": "John Doe",
  "salary": "12 LPA",
  "yearOfExperience": 4.5,
  "resumeSkills": ["Java", "Spring Boot", "MySQL"],
  "matchingJobs": [
    {
      "jobId": "JD001",
      "role": "Backend Developer",
      "aboutRole": "Responsible for backend development.",
      "requiredSkills": ["Java", "Spring Boot", "MySQL", "Kafka"],
      "optionalSkills": ["Docker", "Kubernetes"],
      "salary": "15 LPA",
      "experience": 5,
      "skillsAnalysis": [
        { "skill": "Java", "presentInResume": true },
        { "skill": "Spring Boot", "presentInResume": true },
        { "skill": "MySQL", "presentInResume": true },
        { "skill": "Kafka", "presentInResume": false }
      ],
      "matchingScore": 75
    }
  ]
}
```

### Field Descriptions

- `name`: Candidate name extracted from resume
- `salary`: Expected/current salary
- `yearOfExperience`: Total years of experience (numeric)
- `resumeSkills`: Array of all skills found in resume
- `matchingJobs`: Array of jobs sorted by matching score (descending)
  - `jobId`: Unique job identifier
  - `role`: Job title/position
  - `aboutRole`: Job description/responsibilities
  - `requiredSkills`: Must-have skills for the job
  - `optionalSkills`: Nice-to-have skills
  - `salary`: Offered salary range
  - `experience`: Required years of experience
  - `skillsAnalysis`: Skill-by-skill breakdown
  - `matchingScore`: Percentage match (0-100)

## Usage

### Web UI
1. Start server: `npm start`
2. Open: http://localhost:3000
3. Upload `JD.txt` file
4. Upload `sample-resume.txt` or your resume
5. View matching results

### Test Script
```bash
node test-example.js
```

### API Testing
Use curl commands or Postman with the endpoints above.

## Extraction Logic Details

### Skills Database (100+ technologies)
- Programming: Java, Python, JavaScript, TypeScript, C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, Scala
- Web: HTML, CSS, React, Angular, Vue.js, Node.js, Express, Next.js, jQuery, Bootstrap, Tailwind
- Backend: Spring Boot, Django, Flask, FastAPI, Rails, Laravel, ASP.NET
- Databases: MySQL, PostgreSQL, MongoDB, Redis, Cassandra, Oracle, SQL Server, Elasticsearch
- Cloud/DevOps: AWS, Azure, GCP, Docker, Kubernetes, Jenkins, GitLab, Terraform, Ansible
- Message Queues: Kafka, RabbitMQ, ActiveMQ, Pulsar
- API: REST, GraphQL, gRPC, SOAP, WebSocket, Microservices
- Testing: JUnit, Jest, Mocha, Pytest, Selenium, Cypress
- AI/ML: TensorFlow, PyTorch, Keras, Scikit-learn, OpenCV, NLP
- Version Control: Git, GitHub, GitLab, Bitbucket
- OS: Linux, Unix, Windows, Ubuntu, CentOS
- Methodologies: Agile, Scrum, Kanban, DevOps, CI/CD, TDD

### Regex Patterns

**Salary:**
```javascript
/(?:salary|ctc|compensation)[\s:]*(?:₹|rs\.?)?[\s]*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:lpa|lakhs?)/i
/\$[\s]*(\d+(?:,\d+)*)\s*(?:per annum|annually)/i
```

**Experience:**
```javascript
/(\d+)\+?\s*(?:to|-)\s*(\d+)\s*years?/i
/(\d+)\+?\s*years?/i
/fresher|entry[- ]level|0\s*years?/i
```

**Skills:**
```javascript
// Word boundary matching for each skill
/\b${skill}\b/i
```

## Technology Stack

- Backend: Node.js, Express.js
- Storage: In-memory arrays
- Parsing: pdf-parse, regex
- Frontend: HTML5, CSS3, JavaScript
- File Upload: Multer

## Testing

Run the test script to verify parsing and matching:

```bash
node test-example.js
```

Expected output:
- Parsed resume with name, salary, experience, skills
- Parsed job descriptions from JD.txt
- Matching scores for top jobs
- Sample JSON output

## Troubleshooting

**Port already in use:**
Change port in `src/server.js`:
```javascript
const PORT = 3001;
```

**File upload fails:**
- Ensure file format is PDF or TXT
- Check file size (< 10MB)
- Verify file is not corrupted

**No skills detected:**
- Skills must match database (case-insensitive)
- Check spelling
- Add custom skills to `src/utils/extractors.js`

**Node modules error:**
```bash
rm -rf node_modules package-lock.json
npm install
```

MIT
