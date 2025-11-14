<?php

namespace App\Services;

class ModuleConfigService
{
    private array $modules;

    public function __construct(array $modules)
    {
        $this->modules = $modules['modules'] ?? [];
    }

    public function all(): array
    {
        return $this->modules;
    }

    public function get(string $module): ?array
    {
        return $this->modules[$module] ?? null;
    }
}
