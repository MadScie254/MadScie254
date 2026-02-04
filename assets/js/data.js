// ==========================================
// DATA.JS - Daniel Wanjala's Complete Portfolio Data
// ==========================================

const personalInfo = {
  name: "Daniel Wanjala",
  title: "Data Scientist & ML Engineer",
  location: "Kenya",
  email: "dmwanjala254@gmail.com",
  phone: "+254 742 007 277",
  linkedin: "https://linkedin.com/in/daniel-wanjala-912b8b17b",
  github: "https://github.com/MadScie254",
  alternateEmail: "danieleinstein1998@gmail.com",
  tagline: "Transforming complex data into actionable insights through machine learning, predictive analytics, and innovative AI solutions.",
  bio: "Passionate Data Scientist pursuing a Master's in Data Science & Machine Learning at Cooperative University of Kenya. Creator of InvestWise Predictor and researcher in electricity theft detection using hybrid ensemble ML frameworks. Currently mastering anomaly detection and building production-grade ML systems.",
  workstation: "HP ZBook 15 G5 — 16 GB RAM, 512 GB SSD, NVIDIA Quadro P2000 GPU"
};

// ==========================================
// PROJECTS
// ==========================================
const projects = [
  {
    name: "InvestWise Predictor",
    description: "Life project: Data-driven investment decision support and prediction platform utilizing neural-network models for investment predictions across Kenya's regions. Features user-friendly web UI, continuous improvement pipeline, and security-focused architecture.",
    techStack: ["Python", "Django", "React", "TensorFlow", "PostgreSQL", "Redis"],
    github: "https://github.com/MadScie254/InvestWise-Predictor",
    demo: null,
    category: "FinTech & ML",
    featured: true,
    origin: "Developed at Moringa School"
  },
  {
    name: "Electricity Theft Detection Framework",
    description: "Active research/thesis: A Hybrid Ensemble-Based Machine Learning Framework for Electricity Theft Detection in Smart Grids Under Severe Class Imbalance. Addresses real-world SGCC dataset challenges with advanced ensemble methods.",
    techStack: ["Python", "Ensemble Methods", "Class Imbalance Strategies", "SGCC Dataset", "AUC/F1 Optimization"],
    github: null,
    demo: null,
    category: "Research & Anomaly Detection",
    featured: true,
    status: "Active Thesis Research"
  },
  {
    name: "AI-Driven Plant Disease Detection",
    description: "Advanced plant disease detection system using image processing and machine learning for agricultural applications.",
    techStack: ["Python", "Neural Networks", "Computer Vision", "TensorFlow"],
    github: "https://github.com/MadScie254/Capstone-Lazarus",
    demo: null,
    category: "Agriculture & AI",
    featured: true
  },
  {
    name: "GDP Growth Prediction Model",
    description: "ML model predicting annual GDP growth using economic indicators and statistical analysis.",
    techStack: ["Python", "Statistical Analysis", "ML Algorithms", "Economic Modeling"],
    github: "https://github.com/MadScie254/Phase-3-Project-Modelling",
    demo: null,
    category: "Economics & Forecasting",
    featured: false
  },
  {
    name: "Stress Prediction from Wearables",
    description: "EDA and predictive modeling on wearables dataset (HR, TEMP, accelerometer X/Y/Z) for stress classification.",
    techStack: ["Python", "Pandas", "Scikit-learn", "Signal Processing"],
    github: null,
    demo: null,
    category: "Healthcare & ML",
    featured: false
  },
  {
    name: "Kenya's GDP Forecasting Tool",
    description: "Time-series analysis tool for GDP trend prediction using historical economic data.",
    techStack: ["Python", "Time Series Analysis", "Economic Modeling"],
    github: "https://github.com/MadScie254/GDP-Forecast-Sample",
    demo: null,
    category: "Economics & Analytics",
    featured: false
  },
  {
    name: "Netflix Stock Profit Analysis",
    description: "Historical stock performance analysis to identify profit trends and investment patterns.",
    techStack: ["Python", "Financial Analysis", "Data Visualization"],
    github: "https://github.com/MadScie254/Netflix-Analysis",
    demo: null,
    category: "Finance & Analytics",
    featured: false
  }
];

// ==========================================
// EXPERIENCE
// ==========================================
const experience = [
  {
    company: "Danco Analytics",
    role: "Machine Learning Specialist",
    period: "June 2024 - Present",
    location: "Nairobi County, Kenya",
    achievements: [
      "Developing ML solutions for business optimization",
      "Working with advanced neural networks and deep learning models",
      "Implementing predictive analytics for client projects",
      "Building production-grade ML pipelines"
    ]
  },
  {
    company: "Kingdom Hospital",
    role: "Senior IT Manager and Data Scientist (Volunteer)",
    period: "January 2023 - Present",
    location: "Webuye, Kenya",
    achievements: [
      "Championed data-driven decisions, boosting efficiency and patient care",
      "Led IT interns team - maintained network security and data integrity",
      "Developed predictive analytics models - reduced patient waiting times by 35%",
      "Automated hospital management with Frappe-based solutions",
      "Implemented disaster recovery and cybersecurity compliance"
    ]
  }
];

// ==========================================
// EDUCATION (Chronological - Most Recent First)
// ==========================================
const education = [
  {
    institution: "Cooperative University of Kenya",
    degree: "Master of Science in Data Science and Machine Learning",
    period: "2024 - Present",
    location: "Kenya",
    status: "Pursuing",
    focus: "Anomaly Detection, Ensemble Methods, Smart Grid Analytics"
  },
  {
    institution: "Moringa School",
    degree: "Certificate in Data Science and Machine Learning",
    period: "April 2023 - December 2023",
    location: "Kenya",
    activities: "Coder Space, Telegram ML Group, Documentation, Analytical Skills",
    skills: "+14 technical skills acquired",
    project: "InvestWise Predictor (Life Project)"
  },
  {
    institution: "Zetech University",
    degree: "Bachelor of Applied Science in Information Technology",
    period: "May 2019 - November 2022",
    location: "Kenya",
    activities: "Rugby, Data Science, Documentation",
    skills: "+20 technical skills listed"
  },
  {
    institution: "St Anthony's Boys Kitale",
    degree: "Kenya Certificate of Secondary Education (KCSE)",
    period: "2015 - 2018",
    location: "Kitale, Kenya",
    type: "High School"
  }
];

// ==========================================
// SKILLS
// ==========================================
const skills = {
  programming: [
    { name: "Python", level: 95, icon: "code-slash" },
    { name: "JavaScript", level: 88, icon: "logo-javascript" },
    { name: "SQL", level: 90, icon: "server" },
    { name: "Angular", level: 80, icon: "logo-angular" },
    { name: "React", level: 85, icon: "logo-react" }
  ],
  ml: [
    { name: "TensorFlow", level: 92 },
    { name: "Ensemble Models", level: 90 },
    { name: "Anomaly Detection", level: 88 },
    { name: "Class Imbalance Strategies", level: 90 },
    { name: "Neural Networks", level: 90 },
    { name: "Deep Learning", level: 88 },
    { name: "Scikit-learn", level: 95 },
    { name: "Computer Vision", level: 85 },
    { name: "AUC/F1/Precision/Recall", level: 95 }
  ],
  frameworks: [
    { name: "Django", icon: "code-slash" },
    { name: "React", icon: "logo-react" },
    { name: "Angular", icon: "logo-angular" }
  ],
  databases: [
    { name: "PostgreSQL", icon: "server" },
    { name: "Redis", icon: "flash" }
  ],
  tools: [
    { name: "Git", icon: "git-branch" },
    { name: "Docker", icon: "cube" },
    { name: "Jupyter", icon: "document-text" },
    { name: "VS Code", icon: "code" },
    { name: "Tableau", icon: "bar-chart" }
  ],
  other: [
    "Data Engineering",
    "ETL Pipelines",
    "MLOps",
    "Model Deployment",
    "Model Monitoring",
    "Documentation",
    "Project Leadership"
  ]
};

// ==========================================
// CERTIFICATIONS (with Credential IDs)
// ==========================================
const certifications = [
  {
    issuer: "HackerRank",
    name: "Software Engineer Role Certification",
    date: "June 2024",
    credentialID: "0A531F3CF6CB",
    url: "https://www.hackerrank.com/certificates/0A531F3CF6CB"
  },
  {
    issuer: "HackerRank",
    name: "Problem Solving (Intermediate)",
    date: "November 2023",
    credentialID: "9D0D1B09D24E",
    url: "https://www.hackerrank.com/certificates/9D0D1B09D24E"
  },
  {
    issuer: "HackerRank",
    name: "Problem Solving (Basic)",
    date: "October 2023",
    credentialID: "E2D78956C647",
    url: "https://www.hackerrank.com/certificates/E2D78956C647"
  },
  {
    issuer: "HackerRank",
    name: "Python (Basic)",
    date: "October 2023",
    credentialID: "E883F6B460CF",
    url: "https://www.hackerrank.com/certificates/E883F6B460CF"
  },
  {
    issuer: "LinkedIn Learning",
    name: "A Day In The Life of a Data Scientist",
    date: "April 2024",
    credentialID: null,
    url: null
  },
  {
    issuer: "LinkedIn Learning",
    name: "The Non-Technical Skills of Effective Data Scientists",
    date: "April 2024",
    credentialID: null,
    url: null
  },
  {
    issuer: "LinkedIn Learning",
    name: "Supply Chain Foundations: Analytics",
    date: "March 2024",
    credentialID: null,
    url: null
  },
  {
    issuer: "Udemy",
    name: "Angular Programming",
    date: "June 2023",
    credentialID: "UC-bl22bace-c883-4146-90d9-7e93b5de4cea",
    url: null
  },
  {
    issuer: "Udemy",
    name: "JavaScript",
    date: "June 2023",
    credentialID: "UC-e55aa1de-67d0-4dfe-a859-4d75632lb65d",
    url: null
  },
  {
    issuer: "Udemy",
    name: "Python for Data Science",
    date: "January 2023",
    credentialID: "UC-b80a1f38-abee-4e1b-9a3c-b803fa7c22eb",
    url: null
  },
  {
    issuer: "Udemy",
    name: "Practical Password Cracking",
    date: "July 2020",
    credentialID: "UC-96f1dc40-a050-46eb-9d24-e6eecd694d79",
    url: null
  }
];

// ==========================================
// RESEARCH & PUBLICATIONS
// ==========================================
const research = [
  {
    title: "A Hybrid Ensemble-Based Machine Learning Framework for Electricity Theft Detection in Smart Grids Under Severe Class Imbalance",
    status: "Active Thesis Research",
    focus: ["Severe Class Imbalance", "Ensemble Methods", "Smart Grid Security", "SGCC Dataset"],
    metrics: ["AUC", "F1-Score", "Precision", "Recall"]
  }
];

// ==========================================
// ACHIEVEMENTS & RECOGNITIONS
// ==========================================
const achievements = [
  "Built InvestWise Predictor - ambitious life project bridging ML and investment decisions",
  "Multiple platform certifications (HackerRank, Udemy, LinkedIn Learning)",
  "Successfully completed Moringa School Data Science & ML certificate",
  "Accepted into Master's program in Data Science & ML at Cooperative University",
  "Active GitHub presence (@MadScie254) with portfolio of production projects",
  "Research focus on anomaly detection and electricity theft in smart grids",
  "Experience with large-scale datasets (SGCC, Kaggle competitions)"
];

// ==========================================
// STATS (for animated counters)
// ==========================================
const stats = {
  yearsExperience: 5,
  projectsCompleted: 15,
  certifications: 11,
  technologies: 20
};
