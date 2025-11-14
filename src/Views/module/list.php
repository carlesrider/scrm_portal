<?php
/** @var array $records */
/** @var array $moduleConfig */
/** @var string $moduleName */
/** @var string $appName */
/** @var array|null $user */

$listFields = $moduleConfig['list_fields'] ?? [];
$moduleLabel = $moduleConfig['label'] ?? $moduleName;

ob_start();
?>
<div class="card">
    <div class="card-body">
        <h2 class="card-title"><?= htmlspecialchars($moduleLabel) ?></h2>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                <tr>
                    <?php foreach ($listFields as $field): ?>
                        <th><?= htmlspecialchars(ucwords(str_replace('_', ' ', $field))) ?></th>
                    <?php endforeach; ?>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <?php foreach ($records as $record): ?>
                    <tr>
                        <?php foreach ($listFields as $field): ?>
                            <td><?= htmlspecialchars($record['attributes'][$field] ?? '') ?></td>
                        <?php endforeach; ?>
                        <td>
                            <a class="btn btn-sm btn-primary" href="/module/<?= urlencode($moduleName) ?>/<?= urlencode($record['id']) ?>">View</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
                <?php if (empty($records)): ?>
                    <tr>
                        <td colspan="<?= count($listFields) + 1 ?>" class="text-center text-muted">No records found.</td>
                    </tr>
                <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>
<?php
$content = ob_get_clean();
include __DIR__ . '/../layouts/main.php';
