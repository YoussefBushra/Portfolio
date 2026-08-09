import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    name: "Accelerated Deep Neuroevolution",
    kind: "Graduation Research",
    year: "2022",
    featured: true,
    blurb:
      "Research designing evolving Deep Neural Networks that leverage hardware accelerators to solve supervised and reinforcement-learning tasks — tested on MNIST image recognition and simulated 3D robotic training.",
    metrics: [
      { label: "Training time", value: "~30% less" },
      { label: "Compute", value: "~30% less" },
    ],
    tech: ["Neuroevolution", "Deep Learning", "Hardware Accelerators", "MNIST", "RL"],
  },
  {
    name: "Elasticsearch Geo-Search at Scale",
    kind: "Backend / Search Systems",
    year: "2024",
    featured: true,
    blurb:
      "Optimized geo-location search over a very large dataset at Block Gemini, plus a real-time logging pipeline (Filebeat → Elasticsearch → Kibana) for monitoring and visualization.",
    metrics: [
      { label: "Records", value: "10M+" },
      { label: "Query p95", value: "600ms" },
    ],
    tech: ["Elasticsearch", "Kibana", "Filebeat", "NestJS", "PostgreSQL", "Redis"],
  },
  {
    name: "Dynamics 365 ↔ Odoo Integration",
    kind: "Enterprise Integration",
    year: "2024",
    featured: true,
    blurb:
      "Built integrations between Microsoft Dynamics 365 Finance, Odoo and custom third-party financial systems, enabling seamless data synchronization with event-driven, reliable async processing.",
    metrics: [{ label: "Pattern", value: "Event-driven" }],
    tech: ["Microsoft Dynamics 365", "Odoo", "RabbitMQ", "NestJS", "TypeScript"],
  },
  {
    name: "Car Showcase",
    kind: "Web Application",
    year: "2023",
    featured: true,
    blurb:
      "A fully responsive car-browsing app with server-side rendering and static generation. Users search, filter and paginate car data from a public API for a fast, responsive experience.",
    tech: ["Next.js 13", "TypeScript", "React", "Tailwind CSS", "Vercel"],
    links: [{ label: "GitHub", href: "https://github.com/YoussefBushra" }],
  },
  {
    name: "Memories — Social Media App",
    kind: "Full-Stack (MERN)",
    year: "2023",
    featured: true,
    blurb:
      "A responsive full-stack social app for sharing memories with CRUD, email/Google auth, search, filtering, pagination, comments and keyword-based recommendations.",
    tech: ["MongoDB", "Express.js", "React", "Node.js", "Redux"],
    links: [{ label: "GitHub", href: "https://github.com/YoussefBushra" }],
  },
  {
    name: "Data Dashboard Outlook Add-on",
    kind: "Cross-Platform Add-on",
    year: "2023",
    featured: true,
    blurb:
      "An MS Outlook add-on (web + desktop) that surfaces contextual data cards in the task pane based on selected mail content, following the latest cross-platform Microsoft recommendations.",
    tech: ["JavaScript", "Node.js", "Express.js", "MongoDB", "Office.js"],
  },

  // --- Additional work (kept for an optional "view all" expansion) ---
  {
    name: "Pocket Dashboard Browser Extension",
    kind: "Browser Extension (MV3)",
    year: "2023",
    featured: false,
    blurb:
      "A Manifest V3 extension that surfaces informative cards on hover over detected keywords on any page, using a robust keyword-detection algorithm and Firebase data.",
    tech: ["Plasmo", "React", "TypeScript", "Node.js", "Firebase"],
  },
  {
    name: "Students Management System",
    kind: "Full-Stack CRUD",
    year: "2023",
    featured: false,
    blurb:
      "A fully functional CRUD application to manage student data, with API testing and validation to ensure data integrity.",
    tech: ["Django", "Django REST", "React", "Postman"],
  },
  {
    name: "Vehicle Rental System",
    kind: "Distributed Desktop App",
    year: "2022",
    featured: false,
    blurb:
      "A team-built vehicle-rental desktop app on an MVC pattern, later redesigned as a distributed system using RMI with Remote Adapter, Remote Façade and Singleton patterns, migrating from Derby to MongoDB.",
    tech: ["Java", "RMI", "MongoDB", "Apache Derby", "UML"],
  },
  {
    name: "Amazon Clone — E-commerce",
    kind: "Full-Stack (MERN)",
    year: "2021",
    featured: false,
    blurb:
      "An e-commerce site on the MERN stack with PayPal payments, a separate admin dashboard, and extensive API testing for reliability.",
    tech: ["MongoDB", "Express.js", "React", "Node.js", "PayPal API"],
  },
  {
    name: "2D Self-Driving Car (RL)",
    kind: "Reinforcement Learning",
    year: "2021",
    featured: false,
    blurb:
      "A self-driving-car model trained to avoid obstacles and reach its destination via Q-learning, with a Kivy GUI and a PyTorch neural network.",
    tech: ["PyTorch", "Q-Learning", "Kivy", "Python"],
  },
];
