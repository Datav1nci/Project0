Key Design Decisions
Modular Architecture: Separated concerns into components, services, and utilities for maintainability.
Type Safety: Used TypeScript for strict typing across frontend and backend.
Reusability: Created reusable components (e.g., SearchInput, AlertForm) to minimize repetition.
Scalability: Implemented connection pooling for Oracle 19c and background jobs with node-cron for alerts.
Security: JWT authentication, encrypted OAuth tokens, and input sanitization.
Performance: Leveraged Next.js SSR for dynamic pages and code splitting for faster load times.
Accessibility: Added ARIA labels and keyboard navigation support in UI components.








Folder structure
/client-management-saas
├── /components
│   ├── ClientCard.tsx
│   ├── AlertForm.tsx
│   ├── SearchInput.tsx
│   └── NotificationLog.tsx
├── /pages
│   ├── /api
│   │   ├── clients.ts
│   │   ├── alerts.ts
│   │   └── notifications.ts
│   ├── index.tsx
│   ├── clients.tsx
│   ├── alerts.tsx
│   └── notifications.tsx
├── /lib
│   ├── gmailClient.ts
│   ├── voipmsClient.ts
│   └── database.ts
├── /services
│   ├── ClientService.ts
│   ├── AlertService.ts
│   └── NotificationService.ts
├── /types
│   ├── index.ts
├── /constants
│   ├── index.ts
├── /public
│   └── favicon.ico
├── /styles
│   └── globals.css
├── .env.example
├── README.md
├── schema.sql
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
├── package.json
├── .eslintrc.json
├── .prettierrc
└── cron.ts