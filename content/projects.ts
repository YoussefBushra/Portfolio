import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    name: "Elasticsearch geo-search at scale",
    kind: "Backend and search systems",
    year: "2024",
    featured: true,
    blurb:
      "Optimized geo-location search over a very large dataset at Block Gemini, plus a real-time logging pipeline (Filebeat to Elasticsearch to Kibana) for monitoring and visualization.",
    metrics: [
      { label: "records", value: "10M+" },
      { label: "query p95", value: "600ms" },
    ],
    tech: ["Elasticsearch", "Kibana", "Filebeat", "NestJS", "PostgreSQL", "Redis"],
  },
  {
    name: "Dynamics 365 and Odoo integration",
    kind: "Enterprise integration",
    year: "2024",
    featured: true,
    blurb:
      "Integrations between Microsoft Dynamics 365 Finance, Odoo and custom third-party financial systems, keeping data synchronized through event-driven, reliable async processing.",
    metrics: [{ label: "pattern", value: "Event-driven" }],
    tech: ["Microsoft Dynamics 365", "Odoo", "RabbitMQ", "NestJS", "TypeScript"],
  },
  {
    name: "Accelerated deep neuroevolution",
    kind: "Graduation research",
    year: "2022",
    featured: true,
    blurb:
      "Research designing evolving deep neural networks that use hardware accelerators to solve supervised and reinforcement-learning tasks, tested on MNIST image recognition and simulated 3D robotic training.",
    metrics: [
      { label: "training time", value: "~30% less" },
      { label: "compute", value: "~30% less" },
    ],
    tech: ["Neuroevolution", "Deep Learning", "Hardware Accelerators", "MNIST", "RL"],
  },
  {
    name: "Car Showcase",
    kind: "Web application",
    year: "2023",
    featured: true,
    blurb:
      "A responsive car-browsing app with server-side rendering and static generation. Search, filter and paginate car data from a public API.",
    tech: ["Next.js 13", "TypeScript", "React", "Tailwind CSS", "Vercel"],
    links: [{ label: "GitHub", href: "https://github.com/YoussefBushra" }],
  },
  {
    name: "Memories social app",
    kind: "Full-stack MERN",
    year: "2023",
    featured: true,
    blurb:
      "A full-stack social app for sharing memories, with CRUD, email and Google auth, search, filtering, pagination, comments and keyword-based recommendations.",
    tech: ["MongoDB", "Express.js", "React", "Node.js", "Redux"],
    links: [{ label: "GitHub", href: "https://github.com/YoussefBushra" }],
  },
  {
    name: "Data dashboard Outlook add-on",
    kind: "Cross-platform add-on",
    year: "2023",
    featured: true,
    blurb:
      "An Outlook add-on for web and desktop that surfaces contextual data cards in the task pane based on the selected mail content.",
    tech: ["JavaScript", "Node.js", "Express.js", "MongoDB", "Office.js"],
  },

  /* Earlier work, revealed from the archive disclosure. */
  {
    name: "Pocket Dashboard browser extension",
    kind: "Browser extension, MV3",
    year: "2023",
    featured: false,
    blurb:
      "A Manifest V3 extension that surfaces informative cards on hover over detected keywords on any page, using a keyword-detection algorithm and Firebase data.",
    tech: ["Plasmo", "React", "TypeScript", "Node.js", "Firebase"],
  },
  {
    name: "Students management system",
    kind: "Full-stack CRUD",
    year: "2023",
    featured: false,
    blurb:
      "A CRUD application to manage student data, with API testing and validation to ensure data integrity.",
    tech: ["Django", "Django REST", "React", "Postman"],
  },
  {
    name: "Vehicle rental system",
    kind: "Distributed desktop app",
    year: "2022",
    featured: false,
    blurb:
      "A team-built vehicle-rental desktop app on an MVC pattern, later redesigned as a distributed system using RMI with Remote Adapter, Remote Facade and Singleton patterns, migrating from Derby to MongoDB.",
    tech: ["Java", "RMI", "MongoDB", "Apache Derby", "UML"],
  },
  {
    name: "Amazon clone e-commerce",
    kind: "Full-stack MERN",
    year: "2021",
    featured: false,
    blurb:
      "An e-commerce site on the MERN stack with PayPal payments, a separate admin dashboard, and extensive API testing for reliability.",
    tech: ["MongoDB", "Express.js", "React", "Node.js", "PayPal API"],
  },
  {
    name: "2D self-driving car",
    kind: "Reinforcement learning",
    year: "2021",
    featured: false,
    blurb:
      "A self-driving-car model trained to avoid obstacles and reach its destination via Q-learning, with a Kivy GUI and a PyTorch neural network.",
    tech: ["PyTorch", "Q-Learning", "Kivy", "Python"],
  },
];
