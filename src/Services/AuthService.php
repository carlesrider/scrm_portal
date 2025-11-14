<?php

namespace App\Services;

class AuthService
{
    private SuiteCRMClient $client;

    public function __construct(SuiteCRMClient $client)
    {
        $this->client = $client;
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    /**
     * Attempt to authenticate a portal user using SuiteCRM contact fields.
     *
     * This demo expects the custom fields stic_pa_username_c and stic_pa_password_c to store
     * plain-text values for the sake of simplicity. In a production portal you should hash and
     * salt passwords and apply the necessary security controls.
     */
    public function login(string $username, string $password): bool
    {
        // Authenticate as the technical user (handled in SuiteCRMClient).
        $this->client->authenticate();

        $filters = [
            [
                'stic_pa_username_c' => [
                    '$equals' => $username,
                ],
            ],
            [
                'stic_pa_password_c' => [
                    '$equals' => $password,
                ],
            ],
        ];

        $response = $this->client->searchModuleRecords('Contacts', $filters, [
            'first_name',
            'last_name',
            'email1',
            'account_id',
        ]);

        $records = $response['data'] ?? [];
        if (empty($records)) {
            return false;
        }

        $contact = $records[0];
        $_SESSION['contact_id'] = $contact['id'];
        $_SESSION['contact_name'] = trim(($contact['attributes']['first_name'] ?? '') . ' ' . ($contact['attributes']['last_name'] ?? ''));
        $_SESSION['contact_email'] = $contact['attributes']['email1'] ?? '';
        $_SESSION['contact_account_id'] = $contact['attributes']['account_id'] ?? '';

        return true;
    }

    public function logout(): void
    {
        $_SESSION = [];
        session_destroy();
    }

    public function check(): bool
    {
        return !empty($_SESSION['contact_id']);
    }

    public function user(): ?array
    {
        if (!$this->check()) {
            return null;
        }

        return [
            'id' => $_SESSION['contact_id'],
            'name' => $_SESSION['contact_name'],
            'email' => $_SESSION['contact_email'],
            'account_id' => $_SESSION['contact_account_id'],
        ];
    }
}
