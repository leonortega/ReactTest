# Copilot Instructions

## General Guidelines
- Workflows should create or expect a Linux App Service configured for multi-container (Docker); if absent, the workflow should create an App Service plan and Web App using the Azure portal.
- Prefer GUI/portal instructions for Azure operations; avoid using CLI commands for these tasks. When asked, explicitly provide portal steps rather than CLI instructions.
- Avoid exposing secrets in the repository.
- Configure nginx in the frontend container to proxy `/api` to `127.0.0.1:8080` and set `VITE_API_BASE_URL` to `/api` at build time in GitHub Actions.

## Code Style
- Use specific formatting rules
- Follow naming conventions

## Project-Specific Rules
- Custom requirement A
- Custom requirement B
- Workspace targets .NET 10.