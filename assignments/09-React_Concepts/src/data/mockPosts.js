/**
 * ==============================================================================
 * KBTCOE Connect — Mock Community Posts (mockPosts.js)
 * Assignment 09: React Concepts
 * 
 * Fictional synthetic community posts demonstrating React state management,
 * controlled form input submissions, like/unlike toggles, and category filtering.
 * ==============================================================================
 */

export const initialPosts = [
  {
    id: "post-1",
    author: "Aarav Sharma",
    department: "Computer Engineering",
    deptCode: "comp",
    timestamp: "15 minutes ago",
    content: "Excited to share that our team 'TechSprint' has been shortlisted for the Grand Finale of Smart India Hackathon (SIH) 2026 under the Smart Campus category! Looking for feedback on our cloud telemetry architecture.",
    category: "Achievements",
    likes: 18,
    isLiked: false,
    isUserCreated: false
  },
  {
    id: "post-2",
    author: "Pooja Deshmukh",
    department: "Information Technology",
    deptCode: "it",
    timestamp: "1 hour ago",
    content: "Published our new open-source dataset for crop disease classification using leaf spectrograms. If you are experimenting with PyTorch or lightweight edge inference models, check out our GitHub repository!",
    category: "Technical",
    likes: 24,
    isLiked: false,
    isUserCreated: false
  },
  {
    id: "post-3",
    author: "Aditya Jadhav",
    department: "Mechanical Engineering",
    deptCode: "mech",
    timestamp: "3 hours ago",
    content: "SAE BAJA 2026 Buggy roll cage simulation completed in ANSYS! We achieved a 14% reduction in structural weight while maintaining full compliance with torsional stiffness standards. Testing commences next week in the CAD/CAM lab.",
    category: "Technical",
    likes: 15,
    isLiked: false,
    isUserCreated: false
  },
  {
    id: "post-4",
    author: "Campus Training & Placement Cell",
    department: "Campus Wide Announcement",
    deptCode: "campus",
    timestamp: "5 hours ago",
    content: "Reminder: Resume review and mock technical interview workshop scheduled this Saturday at 10:00 AM in the Central Seminar Hall. Industry alumni from Pune and Bengaluru will be mentoring student attendees.",
    category: "Events",
    likes: 32,
    isLiked: false,
    isUserCreated: false
  },
  {
    id: "post-5",
    author: "Sneha Patil",
    department: "Electronics & Telecommunication",
    deptCode: "entc",
    timestamp: "Yesterday",
    content: "Any third-year students interested in collaborating on an IoT-based air quality monitoring network for Nashik city? We have prototype ESP32 sensor boards ready and are seeking students with dashboard/frontend skills.",
    category: "General",
    likes: 9,
    isLiked: false,
    isUserCreated: false
  },
  {
    id: "post-6",
    author: "Rohan Kulkarni",
    department: "Artificial Intelligence & Data Science",
    deptCode: "aids",
    timestamp: "2 days ago",
    content: "Conducting an introductory hands-on session on 'Transformers & Attention Mechanisms from Scratch' this Friday evening on Google Meet. Beginners are warmly welcome! Drop a comment if you'd like the meeting link.",
    category: "Events",
    likes: 27,
    isLiked: false,
    isUserCreated: false
  }
];

export const AVAILABLE_CATEGORIES = [
  "All",
  "Technical",
  "Achievements",
  "Events",
  "General"
];

export const AVAILABLE_DEPARTMENTS = [
  { label: "Computer Engineering", code: "comp" },
  { label: "Information Technology", code: "it" },
  { label: "Artificial Intelligence & Data Science", code: "aids" },
  { label: "Electronics & Telecommunication", code: "entc" },
  { label: "Mechanical Engineering", code: "mech" },
  { label: "Civil Engineering", code: "civil" },
  { label: "Instrumentation Engineering", code: "instru" }
];
