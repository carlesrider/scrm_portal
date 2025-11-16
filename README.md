# SuiteCRM Portal

A full-stack client portal for SuiteCRM built with Node.js/Express and React. The portal authenticates Contacts using custom portal credential fields and allows portal users to browse and update SuiteCRM module records through a simple UI.

## Features

- OAuth2 client credentials authentication against SuiteCRM v8 REST API with in-memory token caching.
- Portal user login using SuiteCRM Contact custom fields (`stic_pa_username_c`, `stic_pa_password_c`).
- JWT-based session handling for the portal.
- Configurable module exposure with granular control of list/detail/editable fields.
- Record list, detail and update flows for configured modules.
- React front-end with TailwindCSS styling, module selector, breadcrumbs, pagination and inline editing support.

## Repository structure

```
portal-backend/   # Express + TypeScript API server that proxies SuiteCRM
portal-frontend/  # React + Vite TypeScript single-page app
```

## SuiteCRM prerequisites

1. **Create an OAuth2 client** in SuiteCRM (Admin → OAuth2 Clients & Tokens) using the `Client Credentials` grant type.
   - Copy the client ID and secret.
2. **Create custom Contact fields** for portal credentials (Studio → Contacts → Fields):
   - `stic_pa_username_c` – Text field storing the portal username. Usernames must be unique.
   - `stic_pa_password_c` – Text field storing the portal password. (For this reference implementation, passwords are stored in plain text.)
3. Ensure the Contact records that should access the portal have both fields populated.

## Back-end configuration

1. Copy `portal-backend/.env.example` to `portal-backend/.env` and update the values:

   ```ini
   SUITECRM_BASE_URL=https://crm.example.com
   SUITECRM_CLIENT_ID=your-client-id
   SUITECRM_CLIENT_SECRET=your-client-secret
   SUITECRM_GRANT_TYPE=client_credentials
   PORTAL_JWT_SECRET=change-me
   PORT=4000
   ```

   `SUITECRM_BASE_URL` should point to the SuiteCRM root (e.g. `https://crm.example.com` or `https://crm.example.com/legacy`).

2. Install dependencies and start the API server:

   ```bash
   cd portal-backend
   npm install
   npm run dev
   ```

   The API server listens on the configured `PORT` (default `4000`).

### Back-end endpoints

- `POST /api/auth/login` – Authenticate portal users with username/password.
- `POST /api/auth/logout` – Stateless logout helper.
- `GET /api/auth/me` – Return current contact info from the JWT.
- `GET /api/modules` – List enabled modules and their field configuration.
- `GET /api/:module` – Paginated list of module records (`page`, `pageSize`, `search`).
- `GET /api/:module/:id` – Retrieve module record details.
- `PUT /api/:module/:id` – Update a module record using only configured editable fields.

All module endpoints require a valid portal JWT.

## Front-end configuration

1. Install dependencies and start the Vite dev server:

   ```bash
   cd portal-frontend
   npm install
   npm run dev
   ```

   The development server runs on port `5173` and proxies `/api` requests to the back-end (`http://localhost:4000`).

2. Log in with a Contact's portal credentials. After authentication the app loads configured modules (see `portal-backend/src/config/portalConfig.ts`) and provides:
   - A module selector and paginated list view per module.
   - Search functionality on configured fields.
   - Detail view with inline editing for whitelisted fields.

## Example API usage

```bash
# Log in (replace USERNAME/PASSWORD)
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"USERNAME","password":"PASSWORD"}'

# List modules
curl http://localhost:4000/api/modules \
  -H "Authorization: Bearer <portal-jwt>"

# List module records (Cases)
curl "http://localhost:4000/api/modules/Cases?page=1&pageSize=20" \
  -H "Authorization: Bearer <portal-jwt>"

# Get record detail
curl http://localhost:4000/api/modules/Cases/<record-id> \
  -H "Authorization: Bearer <portal-jwt>"

# Update a record
curl -X PUT http://localhost:4000/api/modules/Cases/<record-id> \
  -H "Authorization: Bearer <portal-jwt>" \
  -H "Content-Type: application/json" \
  -d '{"status":"New","description":"Updated from portal"}'
```

## Tailwind build

TailwindCSS is configured via `tailwind.config.js`. Run `npm run build` inside `portal-frontend` for a production bundle.

## License

This project is provided as a reference implementation and may be adapted to your organization's needs.
