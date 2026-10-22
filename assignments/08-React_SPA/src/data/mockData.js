/**
 * ==============================================================================
 * KBTCOE Connect — Mock Data Store (mockData.js)
 * Assignment 08: React SPA
 * 
 * Fictional synthetic data for demonstrating React component mapping,
 * props passing, and key reconciliation in single-page applications.
 * ==============================================================================
 */

export const statsData = [
  {
    id: "stat-1",
    label: "Registered Students",
    value: "150+",
    desc: "Active Campus Innovators",
    icon: "👥",
    color: "#2563EB"
  },
  {
    id: "stat-2",
    label: "Technical Blogs",
    value: "45+",
    desc: "Peer Technical Articles",
    icon: "📝",
    color: "#059669"
  },
  {
    id: "stat-3",
    label: "Project Achievements",
    value: "30+",
    desc: "Competitions & Hackathons",
    icon: "🏆",
    color: "#D97706"
  },
  {
    id: "stat-4",
    label: "Active Opportunities",
    value: "12+",
    desc: "Internships & Contests",
    icon: "💼",
    color: "#7C3AED"
  }
];

export const recentActivityData = [
  {
    id: "act-1",
    type: "achievement",
    title: "1st Prize at SIH 2025 Grand Finale",
    student: "Aarav Sharma & Team",
    dept: "Computer Engineering",
    timeAgo: "2 hours ago"
  },
  {
    id: "act-2",
    type: "blog",
    title: "Published article: 'Practical Computer Vision with PyTorch'",
    student: "Pooja Deshmukh",
    dept: "Information Technology",
    timeAgo: "5 hours ago"
  },
  {
    id: "act-3",
    type: "opportunity",
    title: "New Opportunity: 'Cloud & DevOps Summer Internship 2026'",
    student: "Campus Training & Placement Cell",
    dept: "All Departments",
    timeAgo: "1 day ago"
  },
  {
    id: "act-4",
    type: "project",
    title: "Unveiled SAE BAJA Electric Buggy Roll Cage Simulation",
    student: "Aditya Jadhav",
    dept: "Mechanical Engineering",
    timeAgo: "2 days ago"
  }
];

export const studentsData = [
  {
    id: "stud-1",
    name: "Aarav Sharma",
    studentId: "KBT-2023-CS01",
    department: "Computer Engineering",
    deptCode: "comp",
    year: "Final Year (BE)",
    cgpa: "9.15",
    skills: ["React", "Node.js", "TypeScript", "Docker"],
    bio: "Full-stack developer enthusiastic about distributed systems, microservices, and open-source tooling."
  },
  {
    id: "stud-2",
    name: "Pooja Deshmukh",
    studentId: "KBT-2023-IT04",
    department: "Information Technology",
    deptCode: "it",
    year: "Third Year (TE)",
    cgpa: "8.84",
    skills: ["Python", "Machine Learning", "FastAPI", "PostgreSQL"],
    bio: "Data science researcher exploring computer vision pipelines and deep learning models for precision agriculture."
  },
  {
    id: "stud-3",
    name: "Rohan Kulkarni",
    studentId: "KBT-2024-AI02",
    department: "Artificial Intelligence & Data Science",
    deptCode: "aids",
    year: "Third Year (TE)",
    cgpa: "9.32",
    skills: ["PyTorch", "Deep Learning", "Computer Vision", "Python"],
    bio: "AI enthusiast working on multimodal neural networks, real-time edge inference, and autonomous drone navigation."
  },
  {
    id: "stud-4",
    name: "Sneha Patil",
    studentId: "KBT-2023-ET07",
    department: "Electronics & Telecommunication",
    deptCode: "entc",
    year: "Final Year (BE)",
    cgpa: "8.65",
    skills: ["Embedded C", "IoT", "VLSI", "Arduino"],
    bio: "Hardware-software integration specialist designing low-power telemetry nodes and smart city environmental monitors."
  },
  {
    id: "stud-5",
    name: "Aditya Jadhav",
    studentId: "KBT-2023-ME03",
    department: "Mechanical Engineering",
    deptCode: "mech",
    year: "Final Year (BE)",
    cgpa: "8.42",
    skills: ["SolidWorks", "ANSYS", "AutoCAD", "3D Printing"],
    bio: "Formula Student chassis lead engineer focusing on FEA crashworthiness simulations and lightweight EV materials."
  },
  {
    id: "stud-6",
    name: "Neha Joshi",
    studentId: "KBT-2024-CV05",
    department: "Civil Engineering",
    deptCode: "civil",
    year: "Second Year (SE)",
    cgpa: "8.78",
    skills: ["STAAD Pro", "AutoCAD", "Surveying", "Revit"],
    bio: "Civil engineering innovator researching seismic retrofitting of structural frames and eco-friendly geo-polymers."
  }
];

export const blogsData = [
  {
    id: "blog-1",
    title: "Understanding Microservices & Event-Driven Architecture with Node.js",
    author: "Aarav Sharma",
    department: "Computer Engineering",
    category: "Cloud Architecture",
    readTime: "6 min read",
    date: "Oct 10, 2026",
    excerpt: "An architectural exploration of decoupling monolithic web applications into resilient, event-driven microservices using message queues and Docker containers."
  },
  {
    id: "blog-2",
    title: "Practical Computer Vision: Detecting Plant Diseases Using Deep Learning",
    author: "Pooja Deshmukh",
    department: "Information Technology",
    category: "Artificial Intelligence",
    readTime: "8 min read",
    date: "Oct 08, 2026",
    excerpt: "A step-by-step breakdown of training convolutional neural networks (CNNs) on leaf spectrograms to identify crop pathogens in real-time edge devices."
  },
  {
    id: "blog-3",
    title: "Design & FEA Crash Simulation of a Formula Student EV Chassis",
    author: "Aditya Jadhav",
    department: "Mechanical Engineering",
    category: "Automotive & EV",
    readTime: "7 min read",
    date: "Oct 04, 2026",
    excerpt: "Detailed structural analysis of tubular steel space frames undergoing torsional stiffness testing and frontal impact simulation under SAE BAJA regulations."
  }
];

export const opportunitiesData = [
  {
    id: "opp-1",
    title: "Smart Campus Innovation Hackathon 2026",
    type: "Competition",
    organization: "KBTCOE Institution's Innovation Council (IIC)",
    eligibility: "Open to FE, SE, TE & BE Students of All Branches",
    deadline: "Nov 15, 2026",
    location: "KBTCOE Campus, Nashik",
    description: "48-hour continuous technical hackathon challenging multidisciplinary student squads to engineer hardware and software solutions for campus sustainability."
  },
  {
    id: "opp-2",
    title: "Cloud & DevOps Summer Engineering Internship",
    type: "Internship",
    organization: "TechSprint Cloud Systems (Campus Partner)",
    eligibility: "TE & BE Students (Comp / IT / AIDS)",
    deadline: "Dec 01, 2026",
    location: "Hybrid (Nashik / Pune)",
    description: "Paid 8-week summer internship immersing students in CI/CD pipeline automation, Kubernetes container orchestration, and AWS infrastructure."
  },
  {
    id: "opp-3",
    title: "Smart City IoT Solutions Research & Project Grant",
    type: "Project Grant",
    organization: "National Science & Engineering Research Board",
    eligibility: "Teams of 3–5 Undergraduate Students with Faculty Mentor",
    deadline: "Dec 20, 2026",
    location: "College R&D Center",
    description: "Seed funding opportunity of ₹50,000 for student prototypes addressing urban traffic telemetry, municipal water quality monitoring, or smart grid metering."
  }
];
