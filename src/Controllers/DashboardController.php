<?php

namespace App\Controllers;

use App\Http\Request;
use App\Services\AuthService;
use App\Services\ModuleConfigService;

class DashboardController
{
    private AuthService $authService;
    private ModuleConfigService $moduleConfigService;
    private string $viewsPath;
    private string $appName;

    public function __construct(AuthService $authService, ModuleConfigService $moduleConfigService, string $appName)
    {
        $this->authService = $authService;
        $this->moduleConfigService = $moduleConfigService;
        $this->viewsPath = __DIR__ . '/../Views';
        $this->appName = $appName;
    }

    public function index(Request $request)
    {
        $user = $this->authService->user();
        $modules = $this->moduleConfigService->all();
        $appName = $this->appName;
        include $this->viewsPath . '/dashboard/index.php';
    }
}
