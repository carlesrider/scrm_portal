<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

/**
 * Minimal SuiteCRM v8 API client.
 * Handles OAuth2 authentication and helper methods for JSON:API calls.
 */
class SuiteCRMClient
{
    private Client $httpClient;
    private array $config;

    public function __construct(array $config)
    {
        $this->config = $config;
        $this->httpClient = new Client([
            'base_uri' => rtrim($config['base_url'], '/') . '/',
        ]);
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    /**
     * Authenticate against SuiteCRM OAuth2 endpoint and store token in session.
     */
    public function authenticate(): string
    {
        if (!empty($_SESSION['suitecrm_token']) && $_SESSION['suitecrm_token_expires'] > time()) {
            return $_SESSION['suitecrm_token'];
        }

        try {
            $response = $this->httpClient->post('Api/access_token', [
                'form_params' => [
                    'grant_type' => 'password',
                    'client_id' => $this->config['client_id'],
                    'client_secret' => $this->config['client_secret'],
                    'username' => $this->config['api_username'],
                    'password' => $this->config['api_password'],
                ],
            ]);
        } catch (GuzzleException $e) {
            throw new \RuntimeException('Unable to authenticate with SuiteCRM: ' . $e->getMessage());
        }

        $data = json_decode((string) $response->getBody(), true);
        if (!isset($data['access_token'])) {
            throw new \RuntimeException('SuiteCRM authentication failed, missing access token.');
        }

        $_SESSION['suitecrm_token'] = $data['access_token'];
        $_SESSION['suitecrm_token_expires'] = time() + ($data['expires_in'] ?? 3500);

        return $_SESSION['suitecrm_token'];
    }

    private function request(string $method, string $endpoint, array $options = [])
    {
        $token = $this->authenticate();
        $options['headers']['Authorization'] = 'Bearer ' . $token;
        $options['headers']['Accept'] = 'application/json';
        $options['headers']['Content-Type'] = 'application/json';

        try {
            $response = $this->httpClient->request($method, ltrim($endpoint, '/'), $options);
        } catch (GuzzleException $e) {
            throw new \RuntimeException('SuiteCRM API request failed: ' . $e->getMessage());
        }

        return json_decode((string) $response->getBody(), true);
    }

    public function get(string $endpoint, array $params = [])
    {
        if (!empty($params)) {
            $endpoint .= '?' . http_build_query($params);
        }

        return $this->request('GET', $endpoint);
    }

    public function post(string $endpoint, array $data = [])
    {
        return $this->request('POST', $endpoint, ['json' => $data]);
    }

    public function patch(string $endpoint, array $data = [])
    {
        return $this->request('PATCH', $endpoint, ['json' => $data]);
    }

    public function searchModuleRecords(string $module, array $filters, array $fields = [])
    {
        $payload = [
            'filter' => $filters,
        ];
        if (!empty($fields)) {
            $payload['fields'] = $fields;
        }

        return $this->post("Api/V8/module/{$module}/filter", $payload);
    }

    public function getModuleRecord(string $module, string $id, array $fields = [])
    {
        $params = [];
        if (!empty($fields)) {
            $params['fields'] = implode(',', $fields);
        }

        return $this->get("Api/V8/module/{$module}/{$id}", $params);
    }

    public function updateModuleRecord(string $module, string $id, array $data = [])
    {
        $payload = [
            'data' => [
                'type' => $module,
                'id' => $id,
                'attributes' => $data,
            ],
        ];

        return $this->patch("Api/V8/module/{$module}/{$id}", $payload);
    }
}
