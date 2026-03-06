// Rule-based extraction utilities

class Extractors {
  // Extract salary from text
  static extractSalary(text) {
    const salaryPatterns = [
      /(?:salary|ctc|compensation|package)[\s:]*(?:₹|rs\.?|inr)?[\s]*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:lpa|lakhs?|l\.?p\.?a\.?)/i,
      /(?:₹|rs\.?|inr)[\s]*(\d+(?:,\d+)*)\s*(?:per annum|annually|\/year)/i,
      /\$[\s]*(\d+(?:,\d+)*)\s*(?:per annum|annually|\/year|k)?/i,
      /(\d+(?:,\d+)*)\s*(?:lpa|lakhs? per annum)/i,
      /(?:salary|ctc)[\s:]*\$?[\s]*(\d+(?:,\d+)*)/i
    ];

    for (const pattern of salaryPatterns) {
      const match = text.match(pattern);
      if (match) {
        let salary = match[1].replace(/,/g, '');
        
        if (text.toLowerCase().includes('lpa') || text.toLowerCase().includes('lakhs')) {
          return `${salary} LPA`;
        } else if (text.includes('$')) {
          return `$${salary}`;
        } else if (text.includes('₹')) {
          return `₹${salary}`;
        }
        return salary;
      }
    }
    return null;
  }

  // Extract years of experience
  static extractExperience(text) {
    const expPatterns = [
      /(\d+)\+?\s*(?:to|-)\s*(\d+)\s*years?/i,
      /(\d+)\+?\s*years?/i,
      /experience[\s:]*(\d+)\+?\s*years?/i,
      /(\d+)\s*yrs?/i,
      /fresher|entry[- ]level|0\s*years?/i
    ];

    for (const pattern of expPatterns) {
      const match = text.match(pattern);
      if (match) {
        if (match[0].toLowerCase().includes('fresher') || match[0].toLowerCase().includes('entry')) {
          return 0;
        }
        if (match[2]) {
          return (parseInt(match[1]) + parseInt(match[2])) / 2;
        }
        return parseFloat(match[1]);
      }
    }

    // Calculate from date ranges
    const dateRangePattern = /(\d{4})\s*(?:to|-)\s*(\d{4}|present|current)/gi;
    const matches = [...text.matchAll(dateRangePattern)];
    
    if (matches.length > 0) {
      let totalYears = 0;
      const currentYear = new Date().getFullYear();
      
      matches.forEach(match => {
        const startYear = parseInt(match[1]);
        const endYear = match[2].toLowerCase() === 'present' || match[2].toLowerCase() === 'current' 
          ? currentYear 
          : parseInt(match[2]);
        totalYears += (endYear - startYear);
      });
      
      return totalYears;
    }

    return null;
  }

  // Extract skills using comprehensive skill database
  static extractSkills(text) {
    const skillDatabase = [
      // Programming Languages
      'Java', 'Python', 'JavaScript', 'TypeScript', 'C++', 'C#', 'C', 'Go', 'Rust', 'Ruby', 
      'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl', 'Fortran', 'Shell', 'Bash',
      
      // Web Technologies
      'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Next.js', 'Nuxt.js',
      'jQuery', 'Bootstrap', 'Tailwind', 'SASS', 'LESS', 'Webpack', 'Vite',
      
      // Backend Frameworks
      'Spring Boot', 'Spring', 'Django', 'Flask', 'FastAPI', 'Rails', 'Laravel', 'ASP.NET',
      '.NET', 'Express.js', 'NestJS', 'Gin', 'Echo',
      
      // Databases
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Cassandra', 'Oracle', 'SQL Server', 
      'SQLite', 'MariaDB', 'DynamoDB', 'Elasticsearch', 'Neo4j', 'CouchDB', 'DB2', 'UDB',
      
      // Cloud & DevOps
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab', 'CircleCI',
      'Travis CI', 'Terraform', 'Ansible', 'Chef', 'Puppet', 'Helm', 'ArgoCD',
      
      // Message Queues & Streaming
      'Kafka', 'RabbitMQ', 'ActiveMQ', 'Redis', 'Pulsar', 'NATS',
      
      // API & Protocols
      'REST', 'GraphQL', 'gRPC', 'SOAP', 'WebSocket', 'API', 'Microservices',
      
      // Testing
      'JUnit', 'Jest', 'Mocha', 'Pytest', 'Selenium', 'Cypress', 'TestNG', 'Cucumber',
      
      // AI/ML
      'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'OpenCV', 'NLP', 'Machine Learning',
      'Deep Learning', 'AI', 'ML', 'Computer Vision', 'Neural Networks',
      
      // Version Control
      'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN',
      
      // Operating Systems
      'Linux', 'Unix', 'Windows', 'MacOS', 'Ubuntu', 'CentOS', 'RHEL',
      
      // Methodologies
      'Agile', 'Scrum', 'Kanban', 'DevOps', 'CI/CD', 'TDD', 'BDD',
      
      // Other Technologies
      'Hadoop', 'Spark', 'Airflow', 'ETL', 'Data Pipeline', 'FPGA', 'Embedded Systems',
      'IoT', 'Blockchain', 'Protobuf', 'JSON', 'XML', 'YAML', 'OpenMP', 'MPI'
    ];

    const foundSkills = new Set();
    const lowerText = text.toLowerCase();

    skillDatabase.forEach(skill => {
      const skillLower = skill.toLowerCase();
      const regex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      
      if (regex.test(lowerText)) {
        foundSkills.add(skill);
      }
    });

    return Array.from(foundSkills);
  }

  // Extract name from resume
  static extractName(text) {
    const lines = text.split('\n').filter(line => line.trim());
    
    // First non-empty line is often the name
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      if (firstLine.length < 50 && !firstLine.includes('@') && !firstLine.includes('http')) {
        return firstLine;
      }
    }

    // Look for name patterns
    const namePattern = /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/m;
    const match = text.match(namePattern);
    
    return match ? match[1] : 'Unknown';
  }

  // Extract job role/title
  static extractRole(text) {
    const rolePatterns = [
      /(?:position|role|title|job)[\s:]+([^\n]+)/i,
      /(?:seeking|hiring|looking for)[\s:]+(?:a\s+)?([^\n]+?)(?:\s+to|\s+for|\s+with)/i
    ];

    for (const pattern of rolePatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim().split(/[,\n]/)[0].trim();
      }
    }

    // Common job titles
    const titles = ['Software Engineer', 'Developer', 'Programmer', 'Architect', 'Manager', 
                   'Analyst', 'Consultant', 'Specialist', 'Lead', 'Senior', 'Junior'];
    
    for (const title of titles) {
      if (text.toLowerCase().includes(title.toLowerCase())) {
        const regex = new RegExp(`([^\\n]*${title}[^\\n]*)`, 'i');
        const match = text.match(regex);
        if (match) {
          return match[1].trim().substring(0, 100);
        }
      }
    }

    return 'Not Specified';
  }

  // Extract about/summary section
  static extractAbout(text) {
    const aboutPatterns = [
      /(?:about|summary|overview|description|responsibilities)[\s:]+([^\n]+(?:\n(?!\n)[^\n]+)*)/i,
      /(?:job description|role description)[\s:]+([^\n]+(?:\n(?!\n)[^\n]+)*)/i
    ];

    for (const pattern of aboutPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim().substring(0, 500);
      }
    }

    // Take first meaningful paragraph
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 50);
    return paragraphs.length > 0 ? paragraphs[0].substring(0, 500) : 'No description available';
  }
}

module.exports = Extractors;
