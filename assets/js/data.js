// ==========================================
// DATA.JS - All portfolio data
// ==========================================

const personalInfo = {
  name: "Daniel Wanjala Machimbo",
  title: "Data Scientist / ML Engineer",
  location: "Ruiru, Kiambu, Kenya",
  email: "dmwanjala254@gmail.com",
  phone: "+254 742 007 277",
  linkedin: "https://linkedin.com/in/daniel-wanjala-912b8b17b",
  github: "https://github.com/MadScie254",
  alternateEmail: "danieleinstein1998@gmail.com",
  tagline: "Transforming complex data into actionable insights through machine learning, predictive analytics, and innovative AI solutions.",
  bio: "Passionate Data Scientist with expertise in building ML models that drive business decisions. Currently pursuing Master's in Data Science while leading IT and data initiatives at Kingdom Hospital."
};

const projects = [
  {
    name: "InvestWise Predictor",
    description: "Intelligent online tool utilizing neural networks to predict investment opportunities across Kenya's regions",
    techStack: ["Python", "Django", "React", "TensorFlow", "PostgreSQL", "Redis"],
    github: "https://github.com/MadScie254/InvestWise-Predictor",
    demo: null,
    category: "FinTech & ML",
    featured: true
  },
  {
    name: "AI-Driven Plant Disease Detection",
    description: "Advanced plant disease detection system using image processing and machine learning",
    techStack: ["Python", "Neural Networks", "Computer Vision", "TensorFlow"],
    github: "https://github.com/MadScie254/Capstone-Lazarus",
    demo: null,
    category: "Agriculture & AI",
    featured: true
  },
  {
    name: "GDP Growth Prediction Model",
    description: "ML model predicting annual GDP growth using economic indicators",
    techStack: ["Python", "Statistical Analysis", "ML Algorithms"],
    github: "https://github.com/MadScie254/Phase-3-Project-Modelling",
    demo: null,
    category: "Economics & Forecasting",
    featured: true
  },
  {
    name: "Kenya's GDP Forecasting Tool",
    description: "Time-series analysis tool for GDP trend prediction",
    techStack: ["Python", "Time Series Analysis", "Economic Modeling"],
    github: "https://github.com/MadScie254/GDP-Forecast-Sample",
    demo: null,
    category: "Economics & Analytics",
    featured: false
  },
  {
    name: "Netflix Stock Profit Analysis",
    description: "Historical stock performance analysis to identify profit trends",
    techStack: ["Python", "Financial Analysis", "Data Visualization"],
    github: "https://github.com/MadScie254/Netflix-Analysis",
    demo: null,
    category: "Finance & Analytics",
    featured: false
  }
];

const experience = [
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
  },
  {
    company: "Danco Analytics",
    role: "Machine Learning Specialist",
    period: "June 2024 - Present",
    location: "Nairobi County, Kenya",
    achievements: [
      "Developing ML solutions for business optimization",
      "Working with advanced neural networks and deep learning models"
    ]
  }
];

const skills = {
  programming: [
    { name: "Python", level: 95, icon: "code-slash" },
    { name: "SQL", level: 90, icon: "server" },
    { name: "JavaScript", level: 85, icon: "logo-javascript" },
    { name: "R", level: 80, icon: "stats-chart" }
  ],
  ml: [
    { name: "Predictive Modeling", level: 95 },
    { name: "Neural Networks", level: 90 },
    { name: "Deep Learning", level: 88 },
    { name: "TensorFlow", level: 92 },
    { name: "Scikit-learn", level: 95 },
    { name: "Computer Vision", level: 85 }
  ],
  tools: [
    { name: "Tableau", icon: "bar-chart" },
    { name: "Docker", icon: "cube" },
    { name: "Git", icon: "git-branch" },
    { name: "PostgreSQL", icon: "server" }
  ]
};

const certifications = [
  {
    issuer: "HackerRank",
    name: "Software Engineer Role Certification",
    date: "June 2024",
    credentialID: "0A531F3CF6CB"
  },
  {
    issuer: "Coursera",
    name: "Machine Learning Specialization",
    date: "2023",
    credentialID: "ML2023"
  }
];

const education = [
  {
    institution: "Machakos University",
    degree: "Master of Science in Data Science",
    period: "2025 - Present",
    location: "Machakos, Kenya"
  },
  {
    institution: "Machakos University",
    degree: "Bachelor of Science in Computer Science",
    period: "2020 - 2024",
    location: "Machakos, Kenya",
    grade: "Second Class Honors (Upper Division)"
  }
];
