<?php

declare(strict_types=1);

use App\Controllers\AuthController;
use App\Controllers\DashboardController;
use App\Controllers\ModuleController;
use App\Http\Request;
use App\Http\Router;
use App\Middleware\AuthMiddleware;
use App\Services\AuthService;
use App\Services\ModuleConfigService;
use App\Services\SuiteCRMClient;
use Dotenv\Dotenv;

require dirname(__DIR__) . '/vendor/autoload.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$rootDir = dirname(__DIR__);
if (file_exists($rootDir . '/.env')) {
    Dotenv::createImmutable($rootDir)->safeLoad();
}

$config = require $rootDir . '/config/config.php';
$modulesConfig = require $rootDir . '/config/modules.php';

$appName = $config['app_name'] ?? 'SuiteCRM Customer Portal';

$client = new SuiteCRMClient($config['suitecrm']);
$authService = new AuthService($client);
$moduleConfigService = new ModuleConfigService($modulesConfig);
$authMiddleware = new AuthMiddleware($authService);

$authController = new AuthController($authService, $appName);
$dashboardController = new DashboardController($authService, $moduleConfigService, $appName);
$moduleController = new ModuleController($authService, $moduleConfigService, $client, $appName);

$request = new Request();
$router = new Router();

$router->get('/login', fn(Request $req) => $authController->showLogin($req));
$router->post('/login', fn(Request $req) => $authController->login($req));
$router->get('/logout', function () use ($authController) {
    $authController->logout();
});

$router->get('/', function (Request $req) use ($authMiddleware, $dashboardController) {
    $authMiddleware->handle();
    $dashboardController->index($req);
});

$router->get('/module/:module', function (Request $req, string $moduleName) use ($authMiddleware, $moduleController) {
    $authMiddleware->handle();
    $moduleController->list($req, $moduleName);
});

$router->get('/module/:module/:id', function (Request $req, string $moduleName, string $id) use ($authMiddleware, $moduleController) {
    $authMiddleware->handle();
    $moduleController->detail($req, $moduleName, $id);
});

$router->post('/module/:module/:id', function (Request $req, string $moduleName, string $id) use ($authMiddleware, $moduleController) {
    $authMiddleware->handle();
    $moduleController->update($req, $moduleName, $id);
});

$router->dispatch($request);
