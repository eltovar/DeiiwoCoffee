# Deploy Deiiwo Coffee -> Railway via GitHub
# Ejecutar desde: C:\Users\Salo\Desktop\DeiiwoCoffee
# Uso: .\deploy.ps1

Write-Host "🚀 Iniciando deploy de Deiiwo Coffee..." -ForegroundColor Green

Set-Location $PSScriptRoot

# Limpiar lock si existe (puede quedar de VS Code)
if (Test-Path ".git/index.lock") {
    Remove-Item ".git/index.lock" -Force
    Write-Host "🔓 Lock de git eliminado" -ForegroundColor Yellow
}

# Agregar todos los cambios
git add -A
if ($LASTEXITCODE -ne 0) { Write-Host "❌ Error en git add" -ForegroundColor Red; exit 1 }
Write-Host "✅ Archivos preparados para commit" -ForegroundColor Green

# Commit
$mensaje = "feat: nuevos productos Edicion Quindio y Drip Bags; limpieza productos descontinuados`n`n- Elimina Alfajor, Dulce de Cafe, Coffee Cherries y Panchitos`n- Agrega Edicion Quindio (250g/500g) y Drip Bags (22.000 COP)`n- Corrige IDs duplicados y claves data-i18n en los 3 cards`n- Agrega listeners de carrito para Quindio y Drip Bags`n- Imagen cafe principal: CafeFondoNegro.png`n- Elimina opcion 340g del cafe y 2.5kg de Quindio`n- Fix cache no-store en desarrollo"

git commit -m $mensaje
if ($LASTEXITCODE -ne 0) { Write-Host "❌ Error en git commit" -ForegroundColor Red; exit 1 }
Write-Host "✅ Commit realizado" -ForegroundColor Green

# Push a GitHub (Railway hace deploy automático)
git push origin main
if ($LASTEXITCODE -ne 0) { Write-Host "❌ Error en git push" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "✅ Deploy enviado a GitHub!" -ForegroundColor Green
Write-Host "🚂 Railway detectará el push y hará deploy automaticamente." -ForegroundColor Cyan
Write-Host "   Revisa el progreso en: https://railway.app/dashboard" -ForegroundColor Cyan
Write-Host ""
