<?php
/** @var string $appName */
/** @var array|null $user */
/** @var array $modules */
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($appName) ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
    <div class="container-fluid">
        <a class="navbar-brand" href="/"><?= htmlspecialchars($appName) ?></a>
        <div class="d-flex">
            <?php if (!empty($user)): ?>
                <span class="navbar-text text-white me-3">Logged in as <?= htmlspecialchars($user['name'] ?? '') ?></span>
                <a class="btn btn-outline-light" href="/logout">Logout</a>
            <?php endif; ?>
        </div>
    </div>
</nav>
<div class="container-fluid">
    <div class="row">
        <aside class="col-md-3 col-lg-2 mb-4">
            <div class="list-group">
                <?php foreach ($modules as $moduleKey => $moduleConfig): ?>
                    <a href="/module/<?= urlencode($moduleKey) ?>" class="list-group-item list-group-item-action">
                        <?= htmlspecialchars($moduleConfig['label'] ?? $moduleKey) ?>
                    </a>
                <?php endforeach; ?>
            </div>
        </aside>
        <main class="col-md-9 col-lg-10">
            <?= $content ?? '' ?>
        </main>
    </div>
</div>
</body>
</html>
