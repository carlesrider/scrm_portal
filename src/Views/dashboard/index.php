<?php
/** @var array $modules */
/** @var array|null $user */
/** @var string $appName */

ob_start();
?>
<div class="card">
    <div class="card-body">
        <h1 class="card-title mb-3">Welcome back, <?= htmlspecialchars($user['name'] ?? 'Guest') ?>!</h1>
        <p class="card-text">Select a module below to view your records:</p>
        <div class="list-group">
            <?php foreach ($modules as $moduleKey => $moduleConfig): ?>
                <a href="/module/<?= urlencode($moduleKey) ?>" class="list-group-item list-group-item-action">
                    <?= htmlspecialchars($moduleConfig['label'] ?? $moduleKey) ?>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</div>
<?php
$content = ob_get_clean();
$user = $user ?? null;
include __DIR__ . '/../layouts/main.php';
