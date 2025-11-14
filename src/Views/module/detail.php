<?php
/** @var array $record */
/** @var array $module */
/** @var string $moduleName */
/** @var string $appName */
/** @var array|null $user */
/** @var string|null $success */
/** @var string|null $error */

$detailFields = $module['detail_fields'] ?? [];
$editableFields = $module['editable_fields'] ?? [];
$moduleLabel = $module['label'] ?? $moduleName;
$isReadOnly = $module['read_only'] ?? true;

ob_start();
?>
<div class="card">
    <div class="card-body">
        <h2 class="card-title mb-3"><?= htmlspecialchars($moduleLabel) ?> Details</h2>
        <?php if ($success): ?>
            <div class="alert alert-success">Record updated successfully.</div>
        <?php endif; ?>
        <?php if ($error): ?>
            <div class="alert alert-danger"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>
        <form method="POST" action="/module/<?= urlencode($moduleName) ?>/<?= urlencode($record['id']) ?>">
            <?php foreach ($detailFields as $field): ?>
                <?php $value = $record['attributes'][$field] ?? ''; ?>
                <div class="mb-3">
                    <label class="form-label"><?= htmlspecialchars(ucwords(str_replace('_', ' ', $field))) ?></label>
                    <?php if (!$isReadOnly && in_array($field, $editableFields, true)): ?>
                        <?php if (strlen($value) > 100): ?>
                            <textarea class="form-control" name="<?= htmlspecialchars($field) ?>" rows="4"><?= htmlspecialchars($value) ?></textarea>
                        <?php else: ?>
                            <input type="text" class="form-control" name="<?= htmlspecialchars($field) ?>" value="<?= htmlspecialchars($value) ?>">
                        <?php endif; ?>
                    <?php else: ?>
                        <p class="form-control-plaintext"><?= nl2br(htmlspecialchars($value)) ?></p>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
            <?php if (!$isReadOnly && !empty($editableFields)): ?>
                <button type="submit" class="btn btn-primary">Save Changes</button>
            <?php endif; ?>
            <a href="/module/<?= urlencode($moduleName) ?>" class="btn btn-secondary">Back to list</a>
        </form>
    </div>
</div>
<?php
$content = ob_get_clean();
include __DIR__ . '/../layouts/main.php';
