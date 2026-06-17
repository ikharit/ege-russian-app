# Автоматический бэкап перед значимыми изменениями
# Использование: .\backup.ps1 "описание изменений"

param(
    [Parameter(Mandatory=$false)]
    [string]$Message = "auto-backup"
)

$date = Get-Date -Format "yyyy-MM-dd-HHmm"
$tagName = "backup-$date-$Message"

# Создаём коммит если есть изменения
$status = git status --short
if ($status) {
    git add -A
    git commit -m "backup: $Message ($date)" --quiet
    Write-Host "✅ Коммит создан: $Message" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Нет изменений для коммита" -ForegroundColor Yellow
}

# Создаём тег
$commit = git rev-parse --short HEAD
git tag -a "$tagName" HEAD -m "Backup: $Message`nDate: $date`nCommit: $commit"
Write-Host "🏷️ Тег создан: $tagName" -ForegroundColor Cyan

# Показываем последние 5 бэкапов
Write-Host "`n📜 Последние бэкапы:" -ForegroundColor White
$backups = git tag -l "backup-*" --sort=-creatordate | Select-Object -First 5
foreach ($b in $backups) {
    $info = git log -1 --format="%h %s (%ar)" $b
    Write-Host "  • $info" -ForegroundColor Gray
}
