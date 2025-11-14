<?php

return [
    'app_name' => 'SuiteCRM Customer Portal',
    // Base configuration for SuiteCRM OAuth2 credentials.
    'suitecrm' => [
        'base_url' => getenv('SUITECRM_BASE_URL') ?: 'https://your-suitecrm-instance.com',
        'client_id' => getenv('SUITECRM_CLIENT_ID') ?: 'portal-client-id',
        'client_secret' => getenv('SUITECRM_CLIENT_SECRET') ?: 'portal-client-secret',
        'api_username' => getenv('SUITECRM_API_USERNAME') ?: 'api-user',
        'api_password' => getenv('SUITECRM_API_PASSWORD') ?: 'api-password',
    ],
];
