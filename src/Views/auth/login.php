<?php
/** @var string|null $error */
/** @var string $appName */
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($appName ?? 'SuiteCRM Portal Login') ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-5">
            <div class="card shadow-sm">
                <div class="card-header text-center">
                    <h3><?= htmlspecialchars($appName ?? 'Customer Portal') ?></h3>
                </div>
                <div class="card-body">
                    <?php if (!empty($error)): ?>
                        <div class="alert alert-danger"><?= htmlspecialchars($error) ?></div>
                    <?php else: ?>
                        <p class="text-muted">Please sign in with your portal credentials.</p>
                    <?php endif; ?>
                    <form method="POST" action="/login">
                        <div class="mb-3">
                            <label for="username" class="form-label">Username</label>
                            <input type="text" class="form-control" id="username" name="username" required>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" id="password" name="password" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Login</button>
                    </form>
                </div>
                <div class="card-footer text-muted small">
                    <p class="mb-0">Demo application. In production, ensure passwords are hashed and add CSRF protection.</p>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
