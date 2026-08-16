# Youssef Bushra Fouad

**Backend-Focused Full Stack Software Engineer**

Cairo, Egypt | (+20) 1201493395 | Youssefbushra16.4@gmail.com | linkedin.com/in/youssefbushra | github.com/YoussefBushra

---

## Summary

Backend-focused full-stack software engineer with 2.5+ years of professional experience building microservices for a production multi-tenant SaaS platform. Works across service decomposition, message-driven service-to-service communication with RabbitMQ, tenant-isolated data modelling in PostgreSQL and MongoDB, Redis caching, and Elasticsearch search over 10M+ records at ~600 ms average query response. Has delivered enterprise integrations with Microsoft Dynamics 365 Finance and Odoo across logistics and financial-operations domains, and builds the Next.js frontends that consume the services shipped.

## Skills

**Backend:** Node.js, NestJS, Express.js, TypeScript, TypeORM, Mongoose
**Architecture:** Microservices, multi-tenant SaaS, event-driven architecture, service decomposition, API gateway pattern, micro-frontends
**Databases:** PostgreSQL, MongoDB, MS SQL Server, PL/SQL
**Messaging & Caching:** RabbitMQ, Redis, idempotent message consumers, query optimization
**Search & Observability:** Elasticsearch, Kibana, Filebeat, Logstash, Grafana, OpenTelemetry
**API Development:** REST, GraphQL, Swagger/OpenAPI, JWT, role-based access control
**Frontend:** React, Next.js, TypeScript, Tailwind CSS, Redux
**Testing & DevOps:** Jest, Docker, GitHub Actions, Git, Postman
**Languages:** Arabic (native), English (C1), German (A1)

## Work Experience

### Web Full Stack Developer | Skil-Dev, Cairo, Egypt

**Aug 2024 - Present**

- Build backend services for a production multi-tenant SaaS platform spanning roughly 40 service and frontend applications, where domain services communicate over RabbitMQ message patterns behind a single API gateway rather than direct HTTP calls.
- Contributed to the design and implementation of domain microservices in TypeScript, NestJS and Node.js, taking part in service decomposition, message contracts and inter-service communication patterns across logistics and financial-operations domains.
- Implemented event-driven asynchronous communication with RabbitMQ, using idempotent consumers so redelivered or retried messages cannot apply the same operation twice.
- Built tenant-scoped services in a multi-tenant architecture where per-tenant data isolation is enforced at the data-access layer and authorization is resolved centrally at the gateway against role-based policies.
- Designed and built integrations between Microsoft Dynamics 365 Finance, Odoo and custom third-party financial systems, synchronizing financial documents and postings across platforms through asynchronous, message-based flows.
- Modelled and evolved relational and document schemas across PostgreSQL and MongoDB, managing migrations with TypeORM to keep data consistent across independently deployed services.
- Used Redis caching and query optimization on read-heavy paths to reduce response times under load, and instrumented services with OpenTelemetry tracing and Grafana dashboards to shorten diagnosis of production issues.
- Built features in independently deployed Next.js micro-frontends composed behind a shared shell application, shipped services as Docker images through GitHub Actions CI, and increased Jest coverage on backend logic to reduce production defects.

### Full Stack Software Engineer | Block Gemini, Dubai, UAE

**Jan 2024 - Aug 2024**

- Led the optimization of geo-location search over a 10-million-record dataset using Elasticsearch, achieving a 600 ms average query response time against a sub-1-second target.
- Designed RESTful APIs with NestJS, TypeORM and PostgreSQL, improving performance of complex data-retrieval operations, and used GraphQL with a Redis caching layer to streamline client-side querying.
- Implemented JWT authentication and role-based authorization across microservices, keeping access control consistent between services without sacrificing scalability.
- Built and maintained a centralized logging pipeline with Filebeat, Elasticsearch and Kibana for real-time log collection, monitoring and visualization, working with DevOps to integrate it into backend services.
- Documented APIs with Swagger, improving developer experience and reducing integration time for consuming teams.
- Contributed frontend features with Next.js 14 and Tailwind CSS and integrated them with the NestJS APIs, collaborating with a multi-national team across Dubai, India, Romania and Egypt.

## Projects

### Data Dashboard Outlook Add-on

**Jul 2023 - Aug 2023**

- Built a cross-platform MS Outlook add-on (web and desktop) with JavaScript, Node.js, Express.js and MongoDB, following current Microsoft guidance for centralized deployment and distribution.
- Surfaced contextual data cards in the task pane, pulling records related to the selected mail content from the organization's database and presenting them in a structured, actionable view.

### Memories, Social Media Web Application

**Aug 2023**

- Developed a responsive full-stack application on the MERN stack with Redux for state management, exposing a RESTful API consumed by the React client.
- Implemented CRUD, email and Google authentication, search and filtering, pagination, comments, and keyword-based recommendations.

## Education

### The British University in Egypt (BUE), with London South Bank University (LSBU)

**Oct 2018 - Jul 2022**

BSc Computer Science, Software Engineering major. Cumulative GPA 4.00 (Distinction with Honors).

Graduation project, Accelerated Deep Neuroevolution: designed evolving deep neural networks using hardware accelerators for supervised and reinforcement-learning tasks, averaging ~30% less training time and compute than conventional DNNs at comparable accuracy.

## Earlier Experience

- **API Developer, Advanced Computer Technology (ACT)**, Mar 2021. Built API endpoints in Python, Flask and MS SQL Server to move data between two large data-intensive applications from flat files and external databases.
- **Dell Technologies Summer Academy**, Aug 2021. Hands-on program covering information and storage management, AI, IoT and virtualization.
- **Head of Technical Committee, ACM BUE Chapter**, Oct 2019 - Oct 2020. Led a team running technical sessions on competitive programming, data structures, algorithms and complexity reduction in C++.

## Certifications & Awards

- **Huawei ICT Competition, Gold Medal**, Cloud Computing National Finals, Feb 2021
- **Huawei Certified ICT Associate, Artificial Intelligence (HCIA-AI)**, Jun 2020 - Jul 2023
