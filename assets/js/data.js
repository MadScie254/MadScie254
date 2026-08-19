// ==========================================
// DATA.JS - Joel Ongango's Complete Portfolio Data
// ==========================================

const personalInfo = {
  name: "Joel Ong'ango",
  title: "Full Stack Engineer",
  location: "Kenya",
  email: "ongangojoel@gmail.com",
  phone: "+254 112 200 125",
  linkedin: "https://www.linkedin.com/in/joel-oduor-592399248/",
  github: "https://github.com/Mrjayj123",
  alternateEmail: "qualityprolificarticles@gmail.com",
  tagline: "Building scalable solutions and transforming basic applications into fully fledged full stack applications.",
  bio: "Passionate Full stack engineer working at Tabisun Suppliers Creator of M&C Loan tracking app. Currently mastering adatabase intergraions and more backend applications.",
  workstation: "Dell Latitude 5480 — 16 GB RAM, 256 GB SSD, NVIDIA RTX 9050 GPU"
};

// ==========================================
// PROJECTS
// ==========================================
const projects = [
  {
    name: "M&C Loan Tracker",
    description: "Modern finance application tracking loan applications for users..",
    techStack: ["Python", "Django", "React", "PostgreSQL", "Redis"],
    github: "https://github.com/Mrjayj123/mnc",
    demo: null,
    category: "FinTech",
    featured: true,
    origin: "Developed at Moringa School"
  },
  {
    name: "Readerz",
    description: "A reading app with a public, no-login feed and a personalized experience for logged-in users.",
    techStack: ["Python", "React", "SQLAlchemy backend"],
    github: "https://github.com/Mrjayj123/readerz",
    demo: null,
    category: "Education and Lifestyle",
    featured: true,
    status: "Active Testing"
  },
  {
    name: "Clean Cutz",
    description: "Clean Cutz is a high-performance, browser-based video editing interface designed with a modern glassmorphic aesthetic. It allows you to browse cinematic footage via the Pexels API and perform precise virtual cuts using Media Fragment technology",
    github: "https://github.com/Mrjayj123/CleanCutz",
    demo: null,
    category: "Software and Editing",
    featured: true 
  },
]
  

// ==========================================
// EXPERIENCE
// ==========================================
const experience = [
  {
    company: "Tabisun Suppliers",
    role: "Backend Developer",
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
    company: "Freelance Writer",
    role: "Senior IT Manager and Data Scientist (Volunteer)",
    period: "April 2022 - Present",
    location: "Remote",
    achievements: [
      "worked as a freelance writer for B2B/B2C companies",
      "Wrote about various topics from marketing to health and lifestyle",
      "Focused on SEO writing meaning driving traffic to  websites",
    ]
  },
   {
    company: "Call Center International ",
    role: "Customer Service Executive",
    period: "Aug 2025 - Feb 2026",
    location: "Nairobi, Kenya",
    achievements: [
      "Assist customers from Metro by T-Mobile with plan changes, making online purchases and troubleshooting any issues that they may encounter",
    ]
  },
  {
    company: "Absa Bank Kenya ",
    role: "Financial Service Advisor",
    period: "May 2024 - May 2025",
    location: "Nairobi, Kenya",
    achievements: [
      "Assisted clients to make financial decisions including taking insurances, unsecured loans and buying homes through mortgages",
    ]
  }
];

// ==========================================
// EDUCATION (Chronological - Most Recent First)
// ==========================================
const education = [
  {
    institution: "Moringa School",
    degree: "Certificate in Software Engineering",
    period: "Mar 2026 - November 2026",
    location: "Kenya",
    activities: "Coder Space, Telegram ML Group, Documentation, Analytical Skills",
    skills: "+14 technical skills acquired",
    project: "M&C Loan Tracker"
  },
  {
    institution: "Jomo Kenyatta Universsity Of Agriculture and Technology",
    degree: "Bachelor of Science Supply Chain and Logistics",
    period: "Sep 2020 - December 2023",
    location: "Kenya",
    activities: "Chess, Debate, Music, Coding",
    skills: "+20 technical skills listed"
  },
  {
    institution: "Maranda High School",
    degree: "Kenya Certificate of Secondary Education (KCSE)",
    period: "2016 - 2019",
    location: "Bondo, Kenya",
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
    "Backend Engineering",
    "ETL Pipelines",
    "Rapid Testing",
    "Documentation",
    "Project Leadership"
  ]
};

// ==========================================
// CERTIFICATIONS (with Credential IDs)
// ==========================================

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
  "Built M&C Loan Tracker - ambitious project bridging traditional loan bookeeping with modern finance",
  "Continous platform engagement(Leetcode, coderbyte)",
  "Successfully completed Moringa School Full Stack Software Development",
  "Active GitHub presence (@Mrjayj123) with portfolio of production projects",
];

// ==========================================
// STATS (for animated counters)
// ==========================================
const stats = {
  yearsExperience: 1,
  projectsCompleted: 3,
  certifications: 2,
  technologies: 10
};
