const Abhishek = "https://picsum.photos/seed/abhishek/200/200";
const Pratik = "https://picsum.photos/seed/pratik/200/200";
const Himanshu = "https://picsum.photos/seed/himanshu/200/200";

export const programsList = [
  {
    id: "full-stack-dev",
    category: "Development",
    title: "4-Month Full Stack Web Development",
    img: "https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1688411254/catalog/1675939827045449728/vqtae03vq1tguxyg9s1l.jpg",
    duration: "4 Months",
    level: "Beginner to Advanced",
    modules: ["Frontend Foundations", "JavaScript & DOM", "React & Node.js", "Express & MongoDB"],
    outcome: "Full-Stack Developer",
    salary: "5 LPA",
    type: "Intensive (Monster Approach)",
    trainer: {
      name: "Pratik Bhoyar",
      role: "Web Development Trainer",
      bio: "5+ years of experience in building scalable web applications. Lead developer for multiple open-source projects.",
      img: Pratik
    },
    syllabus: [
      "HTML & CSS (Frontend Foundations)",
      "JavaScript (Core Programming + DOM Manipulation)",
      "React.js & State Management",
      "Node.js & Backend Architecture",
      "Express.js & RESTful API Development",
      "MongoDB & Database Design",
      "Authentication (JWT) & Protected Routes",
      "Frontend + Backend Integration & Deployment"
    ],
    detailedSyllabus: [
      {
        month: "Month 1 — HTML & CSS (Frontend Foundations)",
        weeks: [
          {
            title: "Week 1 — HTML Basics",
            topics: ["Web fundamentals (how internet & websites work)", "HTML structure", "Basic tags (headings, paragraphs, links, images)", "Lists, tables", "Forms & input types", "Semantic HTML", "Basic SEO concepts"]
          },
          {
            title: "Week 2 — CSS Fundamentals",
            topics: ["CSS syntax & selectors", "Colors, fonts, typography", "Box model (margin, padding, border)", "Display properties"]
          },
          {
            title: "Week 3 — Advanced CSS",
            topics: ["Flexbox", "CSS Grid", "Responsive design (media queries)", "Transitions & animations"]
          },
          {
            title: "Week 4 — Mini Projects",
            topics: ["Portfolio website", "Landing page"]
          }
        ]
      },
      {
        month: "Month 2 — JavaScript (Core Programming + DOM)",
        weeks: [
          {
            title: "Week 1 — JavaScript Basics",
            topics: ["Variables, data types", "Operators", "Conditions (if-else, switch)", "Loops (for, while)", "Functions", "Arrays"]
          },
          {
            title: "Week 2 — Advanced JavaScript",
            topics: ["Objects", "ES6 features (arrow functions, destructuring, spread/rest)", "Array methods (map, filter, reduce)"]
          },
          {
            title: "Week 3 — DOM & Events",
            topics: ["DOM manipulation", "Selecting elements", "Event handling", "Form validation"]
          },
          {
            title: "Week 4 — Async JavaScript + Projects",
            topics: ["Callbacks", "Promises", "Async/Await", "Fetch API", "API integration", "Project: To-Do App", "Project: Weather App"]
          }
        ]
      },
      {
        month: "Month 3 — React.js + Node.js (Full Stack Introduction)",
        weeks: [
          {
            title: "Week 1 — React Basics",
            topics: ["React setup (Vite)", "Components", "Props", "Event handling"]
          },
          {
            title: "Week 2 — React Advanced",
            topics: ["useState", "Forms handling", "Conditional rendering", "useEffect", "API integration", "React Router"]
          },
          {
            title: "Week 3 — Node.js Basics",
            topics: ["Introduction to backend", "Node.js environment", "Creating server", "Modules", "Environment variables"]
          },
          {
            title: "Week 4 — Mini Full Stack Project",
            topics: ["Connecting React with Node.js", "API creation & consumption", "Project: Notes App / Dashboard"]
          }
        ]
      },
      {
        month: "Month 4 — Express.js & MongoDB (Backend Mastery)",
        weeks: [
          {
            title: "Week 1 — Express.js",
            topics: ["Express setup", "Routing", "Middleware", "REST API development"]
          },
          {
            title: "Week 2 — MongoDB",
            topics: ["Database fundamentals", "MongoDB basics", "CRUD operations", "Mongoose (schema & models)"]
          },
          {
            title: "Week 3 — Authentication",
            topics: ["JWT authentication", "Login & signup system", "Protected routes"]
          },
          {
            title: "Week 4 — Major Project",
            topics: ["Full stack application development", "Projects: E-commerce, LMS, Job portal, or CRM", "Includes: Frontend + Backend, Database, Auth, Deployment"]
          }
        ]
      }
    ],
    skills: ["React", "Node.js", "MongoDB", "HTML5", "CSS3", "JavaScript","Express","firebase","WordPress","Wix","git","GitHub","Tailwind CSS"],
    pricing: {
      online: 8000,
      offline: 14999,
      registrationFee: 1000
    },
    brochureUrl: "https://drive.google.com/file/d/1EcYjf0KuqJxmENXsuMLg_HZw8SXJgqMQ/view?usp=sharing"
  },
  {
    id: "data-science-ml",
    category: "Data Science",
    title: "Data Science & Machine Learning",
    img: "https://charvijobs.com/wp-content/uploads/2023/09/Artificial-Intelligence-and-Data-Science-1024x576.jpg",
    duration: "3 Months",
    level: "Advanced",
    modules: ["Advanced Python & Statistics", "Predictive Modeling & ML", "Big Data & Cloud Computing"],
    outcome: "Data Scientist",
    salary: "6 LPA",
    type: "Fast-Track",
    trainer: {
      name: "Abhishek Mishra",
      role: "Trainer",
      bio: "Expert in AI/ML with data science",
      img: Abhishek
    },
    syllabus: [
      "Python for Data Science & Advanced Statistics",
      "Exploratory Data Analysis & Visualization",
      "Supervised & Unsupervised Machine Learning",
      "Deep Learning with TensorFlow & PyTorch",
      "Natural Language Processing & Computer Vision",
      "Big Data Processing with Spark"
    ],
    detailedSyllabus: [
      {
        month: "Month 1 — Data Analysis Foundations",
        weeks: [
          {
            title: "Week 1 — Excel for Data Analysis",
            topics: ["Excel Interface & Shortcuts", "Data Types & Formatting", "Basic Formulas (SUM, AVERAGE, COUNT, IF)", "Sorting & Filtering", "Data Cleaning Techniques", "Practice on Business Dataset"]
          },
          {
            title: "Week 2 — Advanced Excel",
            topics: ["VLOOKUP / XLOOKUP", "INDEX + MATCH", "Pivot Tables & Pivot Charts", "Conditional Formatting", "Data Validation", "Dashboard Basics"]
          },
          {
            title: "Week 3 — SQL Basics (MySQL)",
            topics: ["Introduction to Databases", "Installing MySQL", "SELECT Queries", "WHERE, ORDER BY, LIMIT", "Aggregations (COUNT, SUM, AVG, GROUP BY)", "Real Dataset Practice"]
          },
          {
            title: "Week 4 — Advanced SQL",
            topics: ["JOINS (INNER, LEFT, RIGHT)", "Subqueries", "HAVING Clause", "CASE Statements", "Window Functions Intro", "Real Business Queries"]
          }
        ]
      },
      {
        month: "Month 2 — Python + Data Science Core",
        weeks: [
          {
            title: "Week 5 — Python Fundamentals",
            topics: ["Variables & Data Types", "Operators & Conditions", "Loops", "Functions", "Lists, Tuples, Dictionary", "File Handling"]
          },
          {
            title: "Week 6 — Python for Data Analysis",
            topics: ["NumPy Basics", "Pandas (Data Cleaning, Filtering, Grouping)", "Handling Missing Data", "Data Visualization (Matplotlib / Seaborn)"]
          },
          {
            title: "Week 7 — Statistics & EDA",
            topics: ["Mean, Median, Mode", "Variance & Standard Deviation", "Correlation", "Distribution & Outliers", "Exploratory Data Analysis Steps"]
          },
          {
            title: "Week 8 — Machine Learning Basics",
            topics: ["What is Machine Learning", "Types (Supervised / Unsupervised)", "Train Test Split", "Linear Regression", "Logistic Regression", "Model Evaluation"]
          }
        ]
      },
      {
        month: "Month 3 — AI + Power BI + Projects",
        weeks: [
          {
            title: "Week 9 — Advanced ML",
            topics: ["Decision Tree", "Random Forest", "KNN", "Clustering (K-Means)", "Feature Engineering Basics"]
          },
          {
            title: "Week 10 — AI Fundamentals",
            topics: ["Introduction to AI", "NLP Basics", "Chatbot Concept", "Recommendation System Basics", "AI Tools Overview"]
          },
          {
            title: "Week 11 — Power BI",
            topics: ["Power BI Interface", "Data Import", "Power Query Transformation", "DAX Basics", "Charts & Dashboard Creation"]
          },
          {
            title: "Week 12 — Capstone Project",
            topics: ["End-to-End Data Science Project", "Excel + SQL + Python + ML + Power BI Integration", "Project Documentation", "Portfolio Preparation", "Presentation + Viva"]
          }
        ]
      }
    ],
    skills: ["Python", "TensorFlow", "PyTorch", "SQL", "Spark", "Pandas"],
    pricing: {
      online: 17999,
      offline: 24999,
      registrationFee: 1000
    },
    brochureUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "ux-ui-design",
    category: "Design",
    title: "UI/UX Design Masterclass",
    img: "https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/308538467/original/914e3458208734d5882d8f96bd7530ed8e454d85/design-creative-unique-and-high-quality-app-and-website-ui-ux.png",
    duration: "3 Months",
    level: "Beginner",
    modules: ["Figma & Design Systems", "User Research & Persona", "Interactive Prototyping"],
    outcome: "Product Designer",
    salary: "5 LPA",
    type: "Creative",
    trainer: {
      name: "Pratik BHOYAR",
      role: "UI/UX Design Trainer",
      bio: "Passionate about human-centered design. Helped scale Airbnb's design system.",
      img: Pratik
    },
    syllabus: [
      "Foundations of UX Research & User Psychology",
      "Information Architecture & Wireframing",
      "Visual Design Principles & Figma Mastery",
      "Design Systems & Component Libraries",
      "Usability Testing & Iterative Design",
      "Portfolio Building & Presentation Skills"
    ],
    detailedSyllabus: [
      {
        month: "Phase 1 — Research & Strategy",
        weeks: [
          {
            title: "Week 1 — Introduction to UI/UX",
            topics: ["What is UI vs UX", "Importance of UX in products", "Design Thinking Process", "Types of Apps / Websites", "Good vs Bad Design Examples", "Introduction to Design Tools (Figma Overview)"]
          },
          {
            title: "Week 2 — UX Research & Psychology",
            topics: ["User Research Methods", "Surveys & Interviews", "Creating User Persona", "Empathy Map", "User Journey Mapping", "Understanding User Pain Points"]
          },
          {
            title: "Week 3 — Architecture & Flow",
            topics: ["Sitemap Creation", "Navigation Patterns", "User Flow Diagram", "Task Flow vs User Flow", "Content Structuring"]
          },
          {
            title: "Week 4 — Wireframing Fundamentals",
            topics: ["Low Fidelity Wireframes", "Paper Wireframing", "Digital Wireframing in Figma", "Layout & Grid System", "Spacing & Alignment"]
          }
        ]
      },
      {
        month: "Phase 2 — Visual Design & UI",
        weeks: [
          {
            title: "Week 5 — Visual Design Principles",
            topics: ["Typography Basics", "Color Theory", "Contrast & Hierarchy", "Iconography", "Design Consistency"]
          },
          {
            title: "Week 6 — High Fidelity Design",
            topics: ["Components & Variants in Figma", "Buttons / Cards / Forms Design", "Design System Basics", "Auto Layout"]
          },
          {
            title: "Week 7 — Responsive Design",
            topics: ["Mobile First Design", "Breakpoints", "Responsive Layout Practice", "Grid & Flex Concepts (Design Level)"]
          },
          {
            title: "Week 8 — Prototyping & Interaction",
            topics: ["Interactive Prototyping", "Micro Interactions", "Smart Animate", "Page Transitions"]
          }
        ]
      },
      {
        month: "Phase 3 — Testing & Portfolio",
        weeks: [
          {
            title: "Week 9 — Usability Testing",
            topics: ["What is Usability Testing", "Heuristic Evaluation", "User Feedback Collection", "Iteration & Improvement"]
          },
          {
            title: "Week 10 — Real App Design Project",
            topics: ["Choose Problem Statement", "Research + Wireframe + UI", "Multi Screen App Design", "Mentor Review Sessions"]
          },
          {
            title: "Week 11 — Portfolio & Case Study",
            topics: ["How to Create UI/UX Portfolio", "Case Study Writing", "Behance / Dribbble Profile Setup", "Resume for Designers"]
          },
          {
            title: "Week 12 — Freelancing & Final Project",
            topics: ["Freelancing Basics", "Client Communication", "Pricing Strategy", "Final Project Submission", "Portfolio Presentation + Viva"]
          }
        ]
      }
    ],
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems"],
    pricing: {
      online: 11999,
      offline: 19999,
      registrationFee: 1000
    },
    brochureUrl: "https://drive.google.com/file/d/1CQ_ujhGb6DKmJhN-44DHfDf8xAEp1kN4/view?usp=sharing"
  },
  {
    id: "trading-analysis",
    category: "Finance",
    title: "Professional Trading & Risk Analysis",
    img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800",
    duration: "12 Weeks",
    level: "Advanced",
    modules: ["Technical Analysis Pro", "Options Trading Strategies", "Portfolio & Risk Management"],
    outcome: "Financial Trader",
    salary: "High-Yield",
    type: "Strategic",
    trainer: {
      name: "Himanshu",
      role: "Finance Trainer",
      bio: "Former Wall Street trader with a focus on quantitative risk management.",
      img: Himanshu
    },
    syllabus: [
      "Market Microstructure & Order Flow",
      "Advanced Technical Analysis & Chart Patterns",
      "Options Greeks & Hedging Strategies",
      "Algorithmic Trading Foundations",
      "Psychology of Trading & Discipline",
      "Risk Management & Capital Allocation"
    ],
    skills: ["Technical Analysis", "Options", "Risk Management", "Excel", "TradingView"],
    pricing: {
      online: 7999,
      offline: 9999,
      registrationFee: 1000
    },
    brochureUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "digital-marketing",
    category: "Marketing",
    title: "Digital Marketing Mastery",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800",
    duration: "5 Months",
    level: "Beginner",
    modules: ["SEO, SEM & PPC Ads", "Content & Social Strategy", "Analytics & CRM Tools"],
    outcome: "Growth Marketer",
    salary: "$65k/yr",
    type: "Growth",
    trainer: {
      name: "Pratik Bhoyar",
      role: "Digitial marketing Trainer",
      bio: "Specialist in inbound marketing and automated sales funnels.",
      img: Pratik
    },
    syllabus: [
      "SEO Mastery & Keyword Research",
      "Paid Advertising (Google, Meta, LinkedIn)",
      "Content Marketing & Brand Storytelling",
      "Email Marketing & Automation Funnels",
      "Conversion Rate Optimization (CRO)",
      "Marketing Analytics & Data-Driven Growth"
    ],
    detailedSyllabus: [
      {
        month: "Month 1 — SEO & Fundamentals",
        weeks: [
          {
            title: "Week 1 — DM Fundamentals",
            topics: ["Introduction to Digital Marketing & Scope", "Types of Digital Marketing Channels", "Understanding Marketing Funnel", "Buyer Persona & Target Audience", "Market Research Basics", "Competitor Analysis"]
          },
          {
            title: "Week 2 — Website & SEO Basics",
            topics: ["Introduction to Websites & Landing Pages", "Domain, Hosting, CMS (WordPress Basics)", "Introduction to SEO", "Keyword Research (Tools Practical)", "On-Page SEO Basics", "Technical SEO Basics"]
          },
          {
            title: "Week 3 — Advanced SEO",
            topics: ["Off-Page SEO", "Backlink Strategies", "Google Search Console Setup", "Google Analytics Basics", "Local SEO & Google Business Profile", "SEO Content Strategy"]
          },
          {
            title: "Week 4 — SMM Basics",
            topics: ["Introduction to Social Media Marketing", "Platform Understanding (Instagram, Facebook, LinkedIn)", "Content Strategy & Content Calendar", "Reel & Short Video Strategy", "Hashtag Strategy", "Social Media Tools (Canva, Scheduling Tools)"]
          }
        ]
      },
      {
        month: "Month 2 — Ads & Lead Gen",
        weeks: [
          {
            title: "Week 5 — Paid Advertising",
            topics: ["Introduction to Paid Ads", "Meta Ads Manager Overview", "Campaign Objective & Targeting", "Ad Creative Strategy", "Budgeting & Bidding", "Campaign Setup Practical"]
          },
          {
            title: "Week 6 — Google Ads",
            topics: ["Introduction to Google Ads", "Search Campaign Setup", "Display Ads Basics", "Keyword Planner Practical", "Landing Page Optimization", "Lead Funnel Strategy"]
          },
          {
            title: "Week 7 — Content & Email",
            topics: ["Content Marketing Basics", "Blog Writing & SEO Content", "Copywriting Fundamentals", "Email Marketing Basics", "Email Tools (Mailchimp etc.)", "Automation Basics"]
          },
          {
            title: "Week 8 — Analytics & Freelancing",
            topics: ["KPI & Marketing Metrics", "Conversion Tracking", "Reporting & Dashboard", "Personal Branding", "Freelancing Platforms (Upwork, Fiverr)", "Client Proposal & Pricing Strategy"]
          }
        ]
      },
      {
        month: "Month 3 — Final Project",
        weeks: [
          {
            title: "Final Project Week",
            topics: ["Live Campaign Planning", "Campaign Execution", "Result Analysis", "Final Presentation + Certification + Viva"]
          }
        ]
      }
    ],
    skills: ["Google Ads", "SEO", "Copywriting", "Analytics", "CRM", "Social Media"],
    pricing: {
      online: 9999,
      offline: 14999,
      registrationFee: 1000
    },
    brochureUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "c-programming",
    category: "Development",
    title: "C Programming: The Foundation",
    img: "https://logodix.com/logo/640469.png",
    duration: "8 Weeks",
    level: "Beginner",
    modules: ["Syntax & Logic", "Memory Management", "Data Structures"],
    outcome: "Systems Programmer",
    salary: "$60k/yr",
    type: "Fundamental",
    trainer: {
      name: "Pratik Bhoyar",
      role: "Trainer",
      bio: "Specialist in low-level programming and hardware interfacing with 5 years of experience.",
      img: Pratik
    },
    syllabus: [
      "Introduction to C & Development Environment",
      "Variables, Data Types & Operators",
      "Control Flow: Loops & Conditionals",
      "Functions & Scope",
      "Arrays & String Manipulation",
      "Pointers & Memory Management",
      "Structures & Unions",
      "File Handling & Preprocessor Directives"
    ],
    detailedSyllabus: [
      {
        month: "Month 1 — Basics & Fundamentals",
        weeks: [
          {
            title: "Week 1 — Basics & Fundamentals",
            topics: [
              "Day 1 → Introduction to Programming, History of C, Applications",
              "Day 2 → Installing Compiler (GCC / Turbo), First Program, Structure of C Program",
              "Day 3 → Variables, Data Types, Keywords",
              "Day 4 → Input Output (printf, scanf)",
              "Day 5 → Operators (Arithmetic, Relational, Logical)",
              "Day 6 → Type Casting, sizeof Operator",
              "Day 7 → Practice Day + Mini Assignment"
            ]
          },
          {
            title: "Week 2 — Decision Making",
            topics: [
              "Day 8 → if Statement",
              "Day 9 → if-else, Nested if",
              "Day 10 → else-if Ladder",
              "Day 11 → switch Statement",
              "Day 12 → Conditional Operator",
              "Day 13 → Programs (Largest Number, Grade System etc.)",
              "Day 14 → Practice + Test"
            ]
          },
          {
            title: "Week 3 — Loops",
            topics: [
              "Day 15 → while Loop",
              "Day 16 → do-while Loop",
              "Day 17 → for Loop",
              "Day 18 → Nested Loops",
              "Day 19 → Pattern Programs",
              "Day 20 → break & continue",
              "Day 21 → Practice + Logic Building Session"
            ]
          },
          {
            title: "Week 4 — Functions & Arrays",
            topics: [
              "Day 22 → Functions Basics",
              "Day 23 → Function Types (With / Without Return Type & Arguments)",
              "Day 24 → Recursion",
              "Day 25 → 1D Arrays",
              "Day 26 → 2D Arrays (Matrix Addition, Multiplication)",
              "Day 27 → String Basics",
              "Day 28 → String Functions (strlen, strcpy, strcat, strcmp)"
            ]
          }
        ]
      },
      {
        month: "Month 2 — Advanced Topics",
        weeks: [
          {
            title: "Week 5 — Advanced Topics",
            topics: [
              "Day 29 → Pointers Basics",
              "Day 30 → Pointer with Array",
              "Day 31 → Structure & Union",
              "Day 32 → File Handling (fopen, fclose, fprintf, fscanf)",
              "Day 33 → Dynamic Memory (malloc, calloc, realloc, free)",
              "Day 34 → Small Project (Student Management System)",
              "Day 35 → Final Test + Logic Building Session"
            ]
          }
        ]
      }
    ],
    skills: ["C", "Algorithms", "Logic", "Memory Management"],
    pricing: {
      online: 2999,
      offline: 4999,
      registrationFee: 1000
    },
    brochureUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "cpp-mastery",
    category: "Development",
    title: "C++ Programming Mastery",
    img: "https://d502jbuhuh9wk.cloudfront.net/courses/63039510e4b070f16d3bc09a/63039510e4b070f16d3bc09a_scaled_cover.jpg?v=1",
    duration: "12 Weeks",
    level: "Intermediate",
    modules: ["OOP Principles", "STL & Templates", "Game Dev Basics"],
    outcome: "Software Engineer",
    salary: "5-6 LPA",
    type: "Advanced",
    trainer: {
      name: "Pratik Bhoyar",
      role: "Trainer",
      bio: "Expert in high-performance computing and large-scale software systems.",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200"
    },
    syllabus: [
      "C++ Basics & Transition from C",
      "Object-Oriented Programming (OOP) Concepts",
      "Classes, Objects & Constructors",
      "Inheritance, Polymorphism & Encapsulation",
      "Operator Overloading & Virtual Functions",
      "Templates & Generic Programming",
      "Standard Template Library (STL) Mastery",
      "Exception Handling & File I/O"
    ],
    detailedSyllabus: [
      {
        month: "Month 1 — Fundamentals & Loops",
        weeks: [
          {
            title: "Week 1 — Fundamentals",
            topics: ["Day 1: Intro to C++", "Day 2: First Program", "Day 3: Variables", "Day 4: Operators", "Day 5: Control Statements", "Day 6: switch & Practice", "Day 7: Test"]
          },
          {
            title: "Week 2 — Loops & Functions",
            topics: ["Day 8: while & do-while", "Day 9: for Loop", "Day 10: Nested Loops", "Day 11: Functions Basics", "Day 12: Function Overloading", "Day 13: Default Arguments", "Day 14: Practice"]
          },
          {
            title: "Week 3 — OOP Concepts (Core)",
            topics: ["Day 15: Intro to OOP", "Day 16: Class & Object", "Day 17: Constructor", "Day 18: Destructor", "Day 19: this Pointer", "Day 20: Static Members", "Day 21: Mini Project"]
          },
          {
            title: "Week 4 — OOP Advanced",
            topics: ["Day 22: Inheritance", "Day 23: Types of Inheritance", "Day 24: Polymorphism", "Day 25: Function Overriding", "Day 26: Virtual Function", "Day 27: Friend Function", "Day 28: Practice"]
          }
        ]
      },
      {
        month: "Month 2 — Advanced C++",
        weeks: [
          {
            title: "Week 5 — Advanced C++",
            topics: ["Day 29: Operator Overloading", "Day 30: File Handling", "Day 31: Templates", "Day 32: Exception Handling", "Day 33: STL Intro", "Day 34: Final Project", "Day 35: Final Evaluation"]
          }
        ]
      }
    ],
    skills: ["C++", "OOP", "STL", "Data Structures"],
    pricing: {
      online: 2999,
      offline: 4999,
      registrationFee: 1000
    },
    brochureUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "java Programming",
    category: "Development",
    title: "Java Enterprise Development",
    img: "data:image/webp;base64,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",
    duration: "4 Months",
    level: "Intermediate",
    modules: ["Java Core", "Spring Boot", "Microservices"],
    outcome: "Backend Developer",
    salary: "5-6 LPA",
    type: "Professional",
    trainer: {
      name: "Pratik Bhoyar",
      role: "Trainer",
      bio: "Java champion with extensive experience in enterprise-grade application development.",
      img: Pratik
    },
    syllabus: [
      "Java Syntax & Core Concepts",
      "Collections Framework & Generics",
      "Multithreading & Concurrency",
      "Java Database Connectivity (JDBC)",
      "Spring Framework & Spring Boot",
      "Hibernate & JPA for Persistence",
      "Building RESTful Microservices",
      "Unit Testing with JUnit & Mockito"
    ],
    detailedSyllabus: [
      {
        month: "Month 1 — Java Basics",
        weeks: [
          {
            title: "Week 1 — Intro & Setup",
            topics: ["Day 1: Intro to Java", "Day 2: JDK/JVM Architecture", "Day 3: IDE Setup", "Day 4: Program Structure", "Day 5: Variables", "Day 6: Type Casting", "Day 7: Practice"]
          },
          {
            title: "Week 2 — Operators & Control",
            topics: ["Day 8: Operators", "Day 9: Assignment Ops", "Day 10: if Statement", "Day 11: if-else", "Day 12: else-if Ladder", "Day 13: switch Statement", "Day 14: Logic Programs"]
          },
          {
            title: "Week 3 — Loops & Patterns",
            topics: ["Day 15: while Loop", "Day 16: do-while Loop", "Day 17: for Loop", "Day 18: Nested Loops", "Day 19: Pattern Programs", "Day 20: break & continue", "Day 21: Practice"]
          },
          {
            title: "Week 4 — Methods & Arrays",
            topics: ["Day 22: Methods Basics", "Day 23: Method Overloading", "Day 24: Recursion", "Day 25: 1D Arrays", "Day 26: 2D Arrays", "Day 27: Searching & Sorting", "Day 28: Practice"]
          }
        ]
      },
      {
        month: "Month 2 — OOP & Advanced",
        weeks: [
          {
            title: "Week 5 — OOP Core",
            topics: ["Day 29: Intro to OOP", "Day 30: Class & Object", "Day 31: Constructor", "Day 32: this Keyword", "Day 33: Static Keyword", "Day 34: Encapsulation", "Day 35: Mini Project"]
          },
          {
            title: "Week 6 — OOP Advanced",
            topics: ["Day 36: Inheritance", "Day 37: Types of Inheritance", "Day 38: Method Overriding", "Day 39: Polymorphism", "Day 40: Abstraction", "Day 41: Interface", "Day 42: Practice"]
          },
          {
            title: "Week 7 — Exception & Packages",
            topics: ["Day 43: Exception Basics", "Day 44: try-catch-finally", "Day 45: throw & throws", "Day 46: Custom Exception", "Day 47: Packages", "Day 48: Access Modifiers", "Day 49: Practice"]
          },
          {
            title: "Week 8 — Strings & Wrapper",
            topics: ["Day 50: String Class", "Day 51: StringBuffer", "Day 52: Wrapper Classes", "Day 53: Autoboxing", "Day 54: Practice", "Day 55: Test"]
          }
        ]
      },
      {
        month: "Month 3 — Collections",
        weeks: [
          {
            title: "Week 9 — Collections",
            topics: ["Day 56: Intro to Collections", "Day 57: ArrayList", "Day 58: HashSet", "Day 59: HashMap", "Day 60: Final Project"]
          }
        ]
      }
    ],
    skills: ["Java", "Spring Boot", "Hibernate", "SQL", "Maven"],
    pricing: {
      online: 7999,
      offline: 9999,
      registrationFee: 1000
    },
    brochureUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "python-versatile",
    category: "Development",
    title: "Python for Everything",
    img: "https://cdn-images-1.medium.com/v2/resize:fit:2000/1*SSutxOFoBUaUmgeNWAPeBA.jpeg",
    duration: "10 Weeks",
    level: "Beginner",
    modules: ["Python Basics", "Automation & Scripting", "Web Scrapping"],
    outcome: "Python Developer",
    salary: "4 LPA",
    type: "Versatile",
    trainer: {
      name: "Abhishek Mishra",
      role: "Trainer",
      bio: "Python enthusiast focused on simplifying complex tasks through automation and scripting.",
      img: Abhishek
    },
    syllabus: [
      "Python Installation & Basics",
      "Data Structures: Lists, Tuples, Dictionaries",
      "Functional Programming in Python",
      "File Handling & OS Module",
      "Web Scraping with Beautiful Soup",
      "Automation with Selenium",
      "Introduction to Data Analysis (NumPy, Pandas)",
      "Building CLI Applications"
    ],
    detailedSyllabus: [
      {
        month: "Month 1 — Python Basics",
        weeks: [
          {
            title: "Week 1 — Intro & Basics",
            topics: ["Day 1: Intro to Python", "Day 2: IDE Setup", "Day 3: Variables", "Day 4: Input Output", "Day 5: Type Casting", "Day 6: Operators", "Day 7: Practice"]
          },
          {
            title: "Week 2 — Control Statements",
            topics: ["Day 8: if Statement", "Day 9: if-else", "Day 10: elif Ladder", "Day 11: Logical Programs", "Day 12: match-case", "Day 13: Practice", "Day 14: Test"]
          },
          {
            title: "Week 3 — Loops & Patterns",
            topics: ["Day 15: while Loop", "Day 16: for Loop", "Day 17: Nested Loops", "Day 18: Pattern Programs", "Day 19: break, continue", "Day 20: Range Function", "Day 21: Practice"]
          },
          {
            title: "Week 4 — Data Structures",
            topics: ["Day 22: Lists Basics", "Day 23: List Methods", "Day 24: Tuples", "Day 25: Sets", "Day 26: Dictionary", "Day 27: Programs", "Day 28: Test"]
          }
        ]
      },
      {
        month: "Month 2 — Functions & OOP",
        weeks: [
          {
            title: "Week 5 — Functions & Modules",
            topics: ["Day 29: Functions Basics", "Day 30: Arguments", "Day 31: Lambda Functions", "Day 32: Recursion", "Day 33: Modules", "Day 34: Packages", "Day 35: Mini Project"]
          },
          {
            title: "Week 6 — Strings & File I/O",
            topics: ["Day 36: String Basics", "Day 37: String Methods", "Day 38: f-string", "Day 39: File Handling", "Day 40: CSV/JSON", "Day 41: Practice", "Day 42: Test"]
          },
          {
            title: "Week 7 — OOP in Python",
            topics: ["Day 43: OOP Intro", "Day 44: Class & Object", "Day 45: Constructor", "Day 46: Inheritance", "Day 47: Polymorphism", "Day 48: Encapsulation", "Day 49: Mini Project"]
          },
          {
            title: "Week 8 — Exceptions & Advanced",
            topics: ["Day 50: Exception Handling", "Day 51: Custom Exception", "Day 52: Iterators", "Day 53: Decorators", "Day 54: Date & Time", "Day 55: Math & Random", "Day 56: Practice"]
          }
        ]
      },
      {
        month: "Month 3 — Libraries & Project",
        weeks: [
          {
            title: "Week 9 — Libraries & Project",
            topics: ["Day 57: NumPy", "Day 58: Pandas", "Day 59: Matplotlib", "Day 60: Final Project"]
          }
        ]
      }
    ],
    skills: ["Python", "Automation", "Scripting", "Data Analysis"],
    pricing: {
      online: 5999,
      offline: 9999,
      registrationFee: 1000
    },
    brochureUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  }
];

export const agencyServices = [
  {
    id: "web-dev",
    title: "Web Development Services",
    price: 49999,
    category: "Development",
    description: "Custom-built, responsive ecosystems and portals designed for performance.",
    features: ["Next.js & React", "E-commerce Solutions", "Custom CMS", "API Integration"],
    plans: [
      {
        type: "basic",
        title: "Basic Web Plan",
        price: 19999,
        description: "Perfect for high-converting landing pages, corporate representation, or personal portfolios.",
        features: ["1 Custom Clean Page", "Aesthetic Typography Pairs", "Fully Responsive Layout", "SEO Foundations", "1 Month Support"]
      },
      {
        type: "intermediate",
        title: "Intermediate Web Plan",
        price: 49999,
        description: "Optimized for active businesses needing dynamic pages, blogging engines, or simple integrations.",
        features: ["Up to 5 Pages Layout", "React/Next.js Core", "Framer Motion Interactive animations", "Custom Admin CMS Integration", "3 Months Live Support"]
      },
      {
        type: "advanced",
        title: "Advanced Web Plan",
        price: 99999,
        description: "Full-scale custom dashboard interfaces, intelligent CMS frameworks, and checkout/payment portals.",
        features: ["Unlimited Custom Pages", "High performance Serverless DB", "Integrated Payment Gateway", "Secure User Auth (clerk/firebase)", "6 Months Priority Care SLA"]
      },
      {
        type: "custom",
        title: "Custom Web Plan",
        price: "Custom",
        description: "Have unique or complex requirements? Connect with our top engineer to design a custom solution tailor-made for your enterprise.",
        features: ["100% Bespoke Tech Stack", "Unlimited Scale Server Configuration", "Strategic Consulting Sessions", "Industrial-grade Security Audits", "Lifetime Priority Support SLA"]
      }
    ]
  },
  {
    id: "app-dev",
    title: "App Development Services",
    price: 99999,
    category: "Development",
    description: "Native and cross-platform mobile experiences that users love.",
    features: ["iOS & Android", "React Native", "Flutter Apps", "App Store Optimization"],
    plans: [
      {
        type: "basic",
        title: "Basic Mobile Plan",
        price: 39999,
        description: "Single-platform high-fidelity application for validating product ideas.",
        features: ["Single Platform (iOS or Android)", "React Native/Flutter Layouts", "3 Core User Interactive Screens", "Standard Local Cache Store", "Basic App Stores deployment help"]
      },
      {
        type: "intermediate",
        title: "Intermediate Mobile Plan",
        price: 99999,
        description: "Complete cross-platform app containing database linkages, auth systems, and push alerts.",
        features: ["Both platforms (iOS & Android)", "Full Firebase Backend integrated", "Up to 10 Custom screens", "Push Notifications framework", "App Stores Submission guarantee"]
      },
      {
        type: "advanced",
        title: "Advanced Mobile Plan",
        price: 199999,
        description: "Elite application built with highly custom gestures, payments, and complex server integration.",
        features: ["Native Swift/Kotlin Core UI", "Secure Custom Cloud REST API", "Fully Integrated Stripe Payment Portal", "Offline-first data sync support", "Dedicated automated DevOps pipeline"]
      },
      {
        type: "custom",
        title: "Custom Mobile Plan",
        price: "Custom",
        description: "Get custom integration with hardware, Bluetooth/IoT devices, high performance streaming, or custom AI agents.",
        features: ["Enterprise Architecture Planning", "Custom SDK & BLE integrations", "Pre-vetted UI motion systems", "Full Source Handoff & IP Transfer", "Dedicated ongoing SLA operations support"]
      }
    ]
  },
  {
    id: "cloud-crm",
    title: "Cloud CRM Services",
    price: 74999,
    category: "Cloud",
    description: "Scalable infrastructure and customer relationship management systems.",
    features: ["AWS/GCP Setup", "Salesforce Integration", "Data Warehousing", "Legacy Migration"],
    plans: [
      {
        type: "basic",
        title: "Basic Cloud CRM Plan",
        price: 24999,
        description: "Clean deployment of key CRM properties or starting VPS clusters securely.",
        features: ["Single Cloud Instance Provision", "Secure docker container deployment", "Basic firewall & SSL config", "Automated weekly file back-ups", "General technical email care"]
      },
      {
        type: "intermediate",
        title: "Intermediate Cloud CRM Plan",
        price: 74999,
        description: "Full setup of custom automated marketing pipelines and analytical sales tracking integrations.",
        features: ["High-availability load balancers", "Cloudfront CDN distribution", "Automated CI/CD workflows", "Salesforce workflow automation triggers", "24/7 server health monitors with SMS"]
      },
      {
        type: "advanced",
        title: "Advanced Cloud CRM Plan",
        price: 149999,
        description: "Enterprise scale multi-region server scaling, data warehousing setups, and custom server auditing.",
        features: ["Multi-region auto-scaling clusters", "Kubernetes secure orchestration", "BI Warehouse analytics pipeline", "Continuous Security Compliance Monitoring", "Top Tier priority SLA response (<30 mins)"]
      },
      {
        type: "custom",
        title: "Custom Cloud CRM Plan",
        price: "Custom",
        description: "Have hybrid server constraints or legacy systems? Let our DevOps architecture team tailor a zero-downtime migration blueprint.",
        features: ["Zero-downtime database migration", "Bespoke strict data isolation designs", "Fully specialized localized clouds", "Full-time support personnel SLA", "Dedicated cloud architects"]
      }
    ]
  },
  {
    id: "ui-ux",
    title: "UI/UX Design",
    price: 29999,
    category: "Design",
    description: "Award-winning interfaces centered around human-first interaction.",
    features: ["User Research", "Prototyping", "Design Systems", "Usability Testing"],
    plans: [
      {
        type: "basic",
        title: "Basic Design Plan",
        price: 12999,
        description: "Clear modern wireframes and landing page presentation look-and-feel.",
        features: ["Up to 3 design screen layouts", "Interactive clickable Figma link", "Modern premium vector assets", "Elegant custom typography sets", "2 Rounds revision iterations"]
      },
      {
        type: "intermediate",
        title: "Intermediate Design Plan",
        price: 29999,
        description: "Full UI design framework mapping complete customer flow and components design.",
        features: ["Complete 10 Screens Workspace", "Custom UI Components Design Library", "User journey maps & interaction charts", "Responsive Desktop & Mobile layouts", "Unlimited design iterations"]
      },
      {
        type: "advanced",
        title: "Advanced Design Plan",
        price: 59999,
        description: "Professional multi-platform product layout, user interview testing, and full components specifications.",
        features: ["Comprehensive Design System variables", "UX discovery phase with user interviews", "High-fidelity interactive prototypes", "Figma design token files", "Developer assets Handoff specifications"]
      },
      {
        type: "custom",
        title: "Custom Design Plan",
        price: "Custom",
        description: "Comprehensive product identity, creative direction workshops, or infinite design layouts for complex products.",
        features: ["Dynamic interactive brand book", "Full corporate styling & identity files", "Creative board alignment alignment", "Physical screen UX specifications", "Full design director consulting hours"]
      }
    ]
  },
  {
    id: "digital-strategy",
    title: "Digital Strategy",
    price: 24999,
    category: "Strategy",
    description: "Data-driven growth hacking and market entry strategies.",
    features: ["Growth Hacking", "SEO/SEM Strategy", "Social Media Management", "Brand Identity"],
    plans: [
      {
        type: "basic",
        title: "Basic Strategy Plan",
        price: 9999,
        description: "Targeted market strategy mapping and standard seo configuration blueprint.",
        features: ["Comprehensive keyword research file", "1 Competitor strategy breakdown", "Advanced metadata page SEO", "Monthly ranking progression review", "Basic social marketing overview"]
      },
      {
        type: "intermediate",
        title: "Intermediate Strategy Plan",
        price: 24999,
        description: "Complete leads funnel setup including target tracking events and lead-capture systems.",
        features: ["Omnipresent sales acquisition lead funnel", "Google & Facebook Retargeting configuration", "Structured monthly content generation calendar", "Active lead-gathering page configuration", "A/B campaign keyword test structures"]
      },
      {
        type: "advanced",
        title: "Advanced Strategy Plan",
        price: 49999,
        description: "High velocity growth hacking campaigns, executive level branding materials, and fully integrated automation dashboards.",
        features: ["High scale premium growth channels", "Influencer relations campaign templates", "Automated email newsletters templates", "Full high contrast design branding packs", "Weekly progress meetings & statistics review"]
      },
      {
        type: "custom",
        title: "Custom Strategy Plan",
        price: "Custom",
        description: "Complete custom multinational product launch strategist, corporate strategic directions, and fund-raising consultation.",
        features: ["Multiregional marketing structures", "Custom interactive research panels", "Executive pitch assets design", "Dedicated personal strategic advisor", "Fundraise pitch and structure guidance"]
      }
    ]
  },
  {
    id: "ai-automation",
    title: "AI and Automation Services",
    price: 149999,
    category: "AI",
    description: "Modernize workflows with custom AI models and automations.",
    features: ["LLM Integration", "Workflow Automation", "Predictive Analytics", "Chatbot Dev"],
    plans: [
      {
        type: "basic",
        title: "Basic AI Plan",
        price: 29999,
        description: "Custom cloud task routing and simple AI assistant integration.",
        features: ["Basic automation loops (Zapier/Make)", "Direct OpenAI API credentials config", "Ready-to-use custom bot interface", "Detailed user handoff guidelines", "30-Days automation technical diagnostics"]
      },
      {
        type: "intermediate",
        title: "Intermediate AI Plan",
        price: 149999,
        description: "Custom pipeline flow running trained knowledge maps and custom database integrations.",
        features: ["Bespoke agent processes workflows", "Trained data integration models (Fine-tuning)", "Semantic search Vector database indexing", "Server automation continuous logs", "Custom frontend dashboard UI"]
      },
      {
        type: "advanced",
        title: "Advanced AI Plan",
        price: 299999,
        description: "Elite enterprise-scale deep-learning pipelines, proprietary models deployments, and custom prediction panels.",
        features: ["High speed fine-tuned local models", "Large scale real-time prediction charts", "High velocity streaming outputs integration", "Strict secure data privacy compliance", "Unlimited throughput support scale"]
      },
      {
        type: "custom",
        title: "Custom AI Plan",
        price: "Custom",
        description: "Bespoke artificial intelligence research integration matching specialized proprietary business logic models.",
        features: ["Academic-grade machine learning R&D", "Custom trained local neural networks", "Hardware/robotics integrations", "Dedicated deep learning research team", "Ongoing dynamic scaling SLA care"]
      }
    ]
  }
];

export const getServicePlans = (service: any) => {
  if (!service) return [];
  const matched = agencyServices.find(s => s.id === service.id || s.title.toLowerCase().includes((service.title || '').toLowerCase()));
  if (matched && matched.plans) {
    return matched.plans;
  }
  
  const basePrice = service.price || 49999;
  return [
    {
      type: "basic",
      title: "Basic Plan",
      price: Math.round(basePrice * 0.4),
      description: `Essential entry-level features for standard ${service.title || 'Service'} deployments.`,
      features: ["Standard Essential setups", "Responsive formatting", "Includes core features", "1 Month Support checkups"]
    },
    {
      type: "intermediate",
      title: "Intermediate Plan",
      price: basePrice,
      description: `Our recommended full-featured setup for growing organizations requiring high performance ${service.title || 'Service'}.`,
      features: ["All features included", "High performance processing frameworks", "Advanced user configurations", "3 Months Priority Support care"]
    },
    {
      type: "advanced",
      title: "Advanced Plan",
      price: Math.round(basePrice * 2.0),
      description: `Premium multi-platform scaling, absolute custom security models, and priority SLA backups for ${service.title || 'Service'}.`,
      features: ["Unlimited deployment modules", "Dedicated cloud databases", "Stripe payment/advanced auth configs", "6 Months Priority care SLA"]
    },
    {
      type: "custom",
      title: "Custom Plan",
      price: "Custom",
      description: `Have specialized requirements? Work with a senior advisor to shape a bespoke ${service.title || 'Service'} package.`,
      features: ["100% tailored scope", "Bespoke technology stack selection", "Strategic executive advisory", "Continuous dedicated scaling SLA support"]
    }
  ];
};
