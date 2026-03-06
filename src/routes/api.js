const express = require('express');
const multer = require('multer');
const ResumeParser = require('../parsers/resumeParser');
const JDParser = require('../parsers/jdParser');
const Matcher = require('../utils/matcher');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// In-memory storage
let jobs = [];
let resumes = [];

// Parse and match resume
router.post('/parse-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let resumeData;
    
    if (req.file.mimetype === 'application/pdf') {
      resumeData = await ResumeParser.parsePDF(req.file.buffer);
    } else if (req.file.mimetype === 'text/plain') {
      resumeData = ResumeParser.parseText(req.file.buffer.toString());
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Use PDF or TXT' });
    }

    // Store in memory
    resumeData.id = Date.now().toString();
    resumeData.uploadDate = new Date();
    resumes.push(resumeData);

    // Match resume to jobs
    const matchingJobs = Matcher.matchResumeToJobs(resumeData, jobs);

    const response = {
      ...resumeData,
      matchingJobs
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload and parse JD
router.post('/upload-jd', upload.single('jd'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const text = req.file.buffer.toString();
    const parsedJobs = JDParser.parseMultipleJDs(text);

    // Store in memory (replace existing)
    jobs = parsedJobs;

    res.json({ 
      message: `${parsedJobs.length} job descriptions processed`,
      jobs: parsedJobs 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all jobs
router.get('/jobs', async (req, res) => {
  try {
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all resumes
router.get('/resumes', async (req, res) => {
  try {
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Match specific resume to jobs
router.get('/match/:resumeId', async (req, res) => {
  try {
    const resume = resumes.find(r => r.id === req.params.resumeId);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const matchingJobs = Matcher.matchResumeToJobs(resume, jobs);

    res.json({
      ...resume,
      matchingJobs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
