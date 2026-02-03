# Copilot Instructions

## General Guidelines
- Workflows should create or expect a Linux App Service configured for multi-container (Docker); if absent, the workflow should create an App Service plan and Web App using the Azure portal.
- Prefer GUI/portal instructions for Azure operations; avoid using CLI commands for these tasks. When asked, explicitly provide portal steps rather than CLI instructions.
- Avoid exposing secrets in the repository.
- Configure nginx in the `frontend-next` container to proxy `/api` to `127.0.0.1:8080` and set `VITE_API_BASE_URL` to the value from an `.env` variable at build time in GitHub Actions. Edits should only be made to the existing `frontend-next/nginx.conf` in the `frontend-next` folder; do not create `nginx.conf` elsewhere.
- Run lint checks for both backend and frontend before committing changes to ensure code quality and consistency.
- Use Husky v9+ for managing Git hooks; avoid the deprecated `npx husky install` command.

## Testing Guidelines
- Include an E2E test named `app.spec.ts` in the test files.
- Maintain a `test-results` folder in the workspace for storing test outputs.

## Code Style
- Use specific formatting rules.
- Follow naming conventions.
- When creating new components, move them to their own file.

## Project-Specific Rules
- Custom requirement A.
- Custom requirement B.
- Workspace targets .NET 10.