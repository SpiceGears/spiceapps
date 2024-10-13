This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Jump to

- [Getting Started](#getting-started)
- [Learn More](#learn-more)
- [Deploy on Vercel](#deploy-on-vercel)
- [TODO](#todo)
  - [Frontend (Next.js)](#frontend-nextjs)
  - [Backend (ASP.NET Core)](#backend-aspnet-core)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## TODO

## Frontend (Next.js)

### 1. Task and Project Management
- Implement task creation UI with fields like title, description, due date, and assignees.
- Build a task list view with filtering options (e.g., priority, due date, assignee).
- Add UI for subtasks management within each task.
- Display task dependencies and enforce ordering visually (e.g., disable dependent tasks until prerequisites are complete).
- Implement recurring task feature with user-selectable intervals.
- Use color-coded tags to indicate task priority levels.
- Develop a dropdown for quick task creation using predefined templates.
- Implement comment sections in tasks for team discussions.
- Add file upload functionality for attachments using third-party or internal storage.
- Add task follower functionality to keep users updated without assigning responsibility.
- Include reaction buttons (like, emojis) on tasks for quick feedback.

### 2. Project Views
- Build a list view component with inline actions (edit, delete, etc.) for task management.
- Implement a Kanban-style board with drag-and-drop functionality for task stages.
- Integrate a Gantt chart to visualize task timelines and dependencies.
- Create a calendar view showing tasks with their due dates.
- Implement a workload view to show task distribution across team members.
- Build a portfolio view summarizing all internal project statuses.
- Create a goals view showing team progress and alignment with objectives.

### 3. Team Collaboration
- Build shared workspace UI for grouping tasks by internal teams or departments.
- Add a conversation panel for discussions within projects.
- Implement real-time updates using websockets or similar technologies.
- Build an approval workflow for tasks requiring admin sign-off.
- Create forms for users to submit data that gets converted into tasks.
- Develop a direct messaging feature for internal communication.

### 4. Automation
- Build an interface to define automation rules (e.g., triggers that move tasks upon completion).
- Develop a custom workflow builder with drag-and-drop components for internal processes.

### 5. Reporting and Analytics
- Create a dashboard with visual reports (task completion, project status, overdue tasks).
- Implement dynamic reports with filters and sorting options.
- Integrate burnup/burndown charts to visualize project progress over time.

### 6. Mobile and Notifications
- Ensure mobile responsiveness across all views (task creation, project overviews, etc.).
- Integrate push notifications for task updates via a notification service.
- Implement email notifications for important updates.
- Build an internal notification system to alert users of changes directly in the app.

### 7. User Permissions and Roles
- Build a UI for managing roles (admin, member, guest) and permissions.
- Add private project toggles to restrict visibility to selected team members.
- Implement permission controls for tasks (view-only, edit, delete).

### 8. Customization
- Allow users to personalize dashboards with selectable widgets.
- Implement task view customization, allowing sorting and filtering options.
- Add color-coding features for tasks and projects based on internal criteria.

### 9. Security and Compliance
- Integrate Single Sign-On (SSO) for internal authentication.
- Implement a user interface for enabling two-factor authentication (2FA).
- Create an admin panel for reviewing audit logs of user activity.

### 14. Admin Panel
- Build a registration approval page for new users to be reviewed by admins.
- Implement user role assignment and management UI.
- Display user activity logs for admins to monitor internal usage.
- Implement user segmentation (filter by department, role, or activity).
- Build a UI for security settings, allowing admins to manage policies like password requirements and session timeouts.

---

## Backend (ASP.NET Core)

### 1. Task and Project Management
- Create endpoints for creating, updating, deleting, and retrieving tasks.
- Implement subtask management with relational associations to parent tasks.
- Add backend logic to enforce task dependencies and sequencing.
- Develop recurring task logic, including scheduling for future occurrences.
- Build APIs for managing task templates.
- Implement services for handling task comments.
- Develop a file upload service for task attachments (e.g., using AWS S3 or Azure Blob Storage).
- Implement follower functionality, allowing notifications to be sent to users monitoring tasks.

### 2. Project Views
- Optimize API for task retrieval based on different views (list, board, timeline).
- Build an API to provide timeline data for the Gantt chart feature.
- Develop endpoints to calculate and provide team workload data.
- Build an API to retrieve high-level summaries of all ongoing projects.

### 3. Team Collaboration
- Build APIs to manage shared workspaces, including project-specific data.
- Implement a messaging service for internal team conversations.
- Set up websockets or SignalR for real-time updates.
- Develop an approval workflow service, allowing certain tasks to require admin approval.

### 4. Automation
- Build a rules engine to trigger actions (e.g., move tasks, reassign tasks) based on task events.
- Develop a custom workflow engine to handle complex, user-defined workflows.

### 5. Reporting and Analytics
- Build services to aggregate project and task data for internal dashboards.
- Develop dynamic reporting endpoints to generate custom reports.
- Implement services to track project progress and generate burnup/burndown charts.

### 6. Mobile and Notifications
- Set up a push notification service using a third-party like Firebase for mobile updates.
- Implement an email notification service (e.g., SendGrid) for sending task-related updates.
- Create APIs to store and retrieve in-app notifications.

### 7. User Permissions and Roles
- Implement role-based access control (RBAC) for tasks, projects, and admin features.
- Enforce private project access rules based on user roles and permissions.
- Set up task-level permission controls (view-only, edit, delete) in the backend.

### 8. Customization
- Develop services to store and retrieve user-customized dashboard settings.
- Implement APIs to save and manage user-specific task view preferences.

### 9. Security and Compliance
- Ensure all data is encrypted at rest and in transit.
- Develop an audit logging service to track key user actions (login, task updates, etc.).
- Implement GDPR-compliant data handling for internal user management.

### 14. Admin Panel
- Build APIs for user registration approval, allowing admins to accept or deny new users.
- Implement services for managing user roles and permissions.
- Develop APIs to log and retrieve user activity for audit purposes.
- Create services to handle security policy settings (password strength, session timeouts, etc.).
