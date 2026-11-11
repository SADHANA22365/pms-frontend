# PMS Frontend

React + TypeScript + Tailwind CSS (v4) frontend for the Project Management System REST API
(Spring Boot, separate repository: project-management-system).

## Features
- Users: paged list, create/edit with server-side validation messages, activate/deactivate, workload report
- Projects: status filter, paging, create/edit/delete, status workflow (backend rules shown as toasts)
- Members: add, change role, remove (last-LEAD and open-task rules surfaced from the API)
- Tasks: per-project list, create/edit, status workflow, assign/unassign, global overdue view
- Labels and comments: label CRUD, attach/detach, comments with edit/delete
- Issues: filters, workflow buttons, assignment, statistics
- Reports: dashboard, project progress overview

## Tech
Vite, React 19, TypeScript, Tailwind v4, React Router, TanStack Query v5, plain `fetch`.
There is no login because the backend has no authentication. Wherever an action needs "who is doing this" (reporter, comment author), a user dropdown is used.

## Run
1. Start the backend on http://localhost:8080 (CORS allows http://localhost:5173).
2. `npm install`
3. `npm run dev` then open http://localhost:5173

Optional: copy `.env.example` to `.env` to change the API URL.

## Scripts
`npm run dev`, `npm run build`, `npm run lint`

## Screenshots
![Dashboard](docs/screenshots/dashboard.png)
![Project overview](docs/screenshots/project-overview.png)
![Tasks](docs/screenshots/tasks.png)

## Notes
- Issues use the workflow OPEN, IN_PROGRESS, RESOLVED, CLOSED, REOPENED (an enhancement over the original SRS bug workflow).