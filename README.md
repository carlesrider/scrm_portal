# SuiteCRM Customer Portal

This repository contains a lightweight PHP 8+ web portal that connects to SuiteCRM v8 using the JSON:API interface. Contacts log in with their portal credentials and can view or update records in configured modules (such as Cases or Notes).

## Features

- Simple MVC-style structure with Composer-based autoloading.
- Guzzle HTTP client for SuiteCRM API calls.
- OAuth2 authentication against SuiteCRM v8 stored in the PHP session.
- Bootstrap 5 UI with navigation, module list, and detail views.
- Configuration-driven module/field visibility and editability.
- Minimal authentication flow for portal Contacts using custom fields `stic_pa_username_c` and `stic_pa_password_c`.

## Requirements

- PHP 8.0 or newer with the JSON extension enabled.
- Composer.
- Network access to your SuiteCRM instance (SuiteCRM v8).

## Installation

1. Clone or download this repository.
2. Install dependencies:

   ```bash
   composer install
   ```

3. Copy `.env.example` to `.env` (optional) and adjust SuiteCRM credentials, or edit `config/config.php` directly.
4. Update `config/modules.php` to adjust which modules and fields are available to portal users.
5. Start the built-in PHP server (you can change the port if `8000` is already in use):

   ```bash
   php -S localhost:8000 -t public   # Replace 8000 with any other available port, e.g. 8081
   ```

6. Visit `http://localhost:8000` (or whichever port you chose) in your browser.

## Configuration

### SuiteCRM Credentials

Provide the following values either via environment variables or in `config/config.php`:

- `SUITECRM_BASE_URL`
- `SUITECRM_CLIENT_ID`
- `SUITECRM_CLIENT_SECRET`
- `SUITECRM_API_USERNAME`
- `SUITECRM_API_PASSWORD`

These credentials correspond to a SuiteCRM OAuth2 client and a technical user that can access the API.

#### Obtain `SUITECRM_CLIENT_ID` and `SUITECRM_CLIENT_SECRET`

1. Sign in to your SuiteCRM instance with an administrator account.
2. Navigate to **Admin > API** and open the **OAuth Keys** panel.
3. Click **Create** (or **New**) to register a new OAuth2 client for the portal.
4. Fill out the form:
   - **Name**: any label that identifies the portal (e.g., "Customer Portal").
   - **Redirect URI**: not required for the password grant, but SuiteCRM expects a value—`https://localhost` works for development.
   - **Client Type / Grant Type**: choose **Password** (also called "Resource Owner Password Credentials") so the portal can exchange the SuiteCRM username/password for tokens.
   - **Secret**: SuiteCRM generates this automatically after saving.
5. Save the OAuth Key. SuiteCRM displays the **Key ID** and **Client Secret**; copy these values immediately because the secret is only shown once.
6. Assign the Key ID to `SUITECRM_CLIENT_ID` and the secret to `SUITECRM_CLIENT_SECRET` in your `.env` file or in `config/config.php`.
7. (Optional) For production, create separate OAuth keys per environment and restrict them with appropriate roles/scopes.

### Module Configuration

`config/modules.php` defines which modules the portal exposes and which fields are visible or editable. Example:

```php
return [
    'modules' => [
        'Cases' => [
            'label' => 'Support Cases',
            'read_only' => false,
            'list_fields' => ['case_number', 'name', 'status', 'priority', 'date_entered'],
            'detail_fields' => ['case_number', 'name', 'status', 'priority', 'description', 'date_entered', 'date_modified'],
            'editable_fields' => ['status', 'priority', 'description'],
            'filters' => [
                'contacts.id' => 'contact_id_session',
            ],
        ],
    ],
];
```

Use `contact_id_session` to automatically substitute the logged-in Contact ID in filters. Add or remove modules by updating this file—no PHP changes required.

## Security Notice

This portal is a simplified demonstration. For production deployments consider adding:

- Password hashing and more secure credential storage.
- HTTPS enforcement.
- CSRF protection for form submissions.
- Input validation and sanitization.
- Robust error handling and logging.

## Project Structure

```
config/             Configuration files
public/             Web root / front controller
src/                PHP source code (controllers, services, views)
vendor/             Composer dependencies
```

## SuiteCRM API Notes

- OAuth2 token endpoint: `/Api/access_token`
- JSON:API module endpoints follow `/Api/V8/module/{Module}` patterns.
- Filters use JSON:API filter syntax; see `SuiteCRMClient::searchModuleRecords` for implementation details.

Adjust endpoints if your SuiteCRM version differs.
