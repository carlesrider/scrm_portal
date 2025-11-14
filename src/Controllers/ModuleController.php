<?php

namespace App\Controllers;

use App\Http\Request;
use App\Services\AuthService;
use App\Services\ModuleConfigService;
use App\Services\SuiteCRMClient;

class ModuleController
{
    private AuthService $authService;
    private ModuleConfigService $moduleConfigService;
    private SuiteCRMClient $client;
    private string $viewsPath;
    private string $appName;

    public function __construct(AuthService $authService, ModuleConfigService $moduleConfigService, SuiteCRMClient $client, string $appName)
    {
        $this->authService = $authService;
        $this->moduleConfigService = $moduleConfigService;
        $this->client = $client;
        $this->viewsPath = __DIR__ . '/../Views';
        $this->appName = $appName;
    }

    public function list(Request $request, string $moduleName)
    {
        $moduleConfig = $this->moduleConfigService->get($moduleName);
        if (!$moduleConfig) {
            http_response_code(404);
            echo 'Module not configured';
            return;
        }

        $user = $this->authService->user();
        $filters = $this->buildFilters($moduleConfig['filters'] ?? [], $user);
        $response = $this->client->searchModuleRecords($moduleName, $filters, $moduleConfig['list_fields'] ?? []);
        $records = $response['data'] ?? [];

        $appName = $this->appName;
        $modules = $this->moduleConfigService->all();
        include $this->viewsPath . '/module/list.php';
    }

    public function detail(Request $request, string $moduleName, string $id)
    {
        $moduleConfig = $this->moduleConfigService->get($moduleName);
        if (!$moduleConfig) {
            http_response_code(404);
            echo 'Module not configured';
            return;
        }

        $response = $this->client->getModuleRecord($moduleName, $id, $moduleConfig['detail_fields'] ?? []);
        $record = $response['data'] ?? null;

        if (!$record) {
            http_response_code(404);
            echo 'Record not found';
            return;
        }

        $appName = $this->appName;
        $module = $moduleConfig;
        $modules = $this->moduleConfigService->all();
        $user = $this->authService->user();
        $success = $request->getQueryParams()['success'] ?? null;
        $error = $request->getQueryParams()['error'] ?? null;
        include $this->viewsPath . '/module/detail.php';
    }

    public function update(Request $request, string $moduleName, string $id)
    {
        $moduleConfig = $this->moduleConfigService->get($moduleName);
        if (!$moduleConfig || ($moduleConfig['read_only'] ?? true)) {
            header("Location: /module/{$moduleName}/{$id}?error=Module+is+read-only");
            return;
        }

        $payload = [];
        foreach ($moduleConfig['editable_fields'] ?? [] as $field) {
            if (isset($_POST[$field])) {
                $payload[$field] = $_POST[$field];
            }
        }

        if (!empty($payload)) {
            $this->client->updateModuleRecord($moduleName, $id, $payload);
        }

        header("Location: /module/{$moduleName}/{$id}?success=1");
    }

    private function buildFilters(array $filters, ?array $user): array
    {
        $result = [];
        foreach ($filters as $field => $value) {
            if ($value === 'contact_id_session' && $user) {
                $result[] = [
                    $field => [
                        '$equals' => $user['id'],
                    ],
                ];
            } else {
                $result[] = [
                    $field => [
                        '$equals' => $value,
                    ],
                ];
            }
        }

        return $result;
    }
}
