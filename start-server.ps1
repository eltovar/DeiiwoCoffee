# Servidor HTTP simple con PowerShell
# Uso: .\start-server.ps1

$port = 8080
$url = "http://localhost:$port"

Write-Host "🚀 Iniciando servidor en $url" -ForegroundColor Green
Write-Host "📁 Sirviendo archivos desde: $PWD" -ForegroundColor Cyan
Write-Host "⏹️  Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

# Crear listener HTTP
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("$url/")
$listener.Start()

# Abrir navegador automáticamente
Start-Process $url

Write-Host "✅ Servidor iniciado correctamente en $url" -ForegroundColor Green
Write-Host ""

# Manejar solicitudes
try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Obtener ruta del archivo solicitado
        $path = $request.Url.LocalPath
        if ($path -eq "/") {
            $path = "/index.html"
        }

        $filePath = Join-Path $PWD $path.TrimStart('/')

        Write-Host "📥 $(Get-Date -Format 'HH:mm:ss') - $($request.HttpMethod) $path" -ForegroundColor Gray

        # Verificar si el archivo existe
        if (Test-Path $filePath -PathType Leaf) {
            # Determinar Content-Type
            $extension = [System.IO.Path]::GetExtension($filePath)
            $contentType = switch ($extension) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".gif"  { "image/gif" }
                ".svg"  { "image/svg+xml" }
                ".ico"  { "image/x-icon" }
                ".woff" { "font/woff" }
                ".woff2" { "font/woff2" }
                ".ttf"  { "font/ttf" }
                default { "application/octet-stream" }
            }

            $response.ContentType = $contentType
            $response.StatusCode = 200

            # Leer y enviar archivo
            $buffer = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        else {
            # Archivo no encontrado
            $response.StatusCode = 404
            $html = "<html><body><h1>404 - Archivo no encontrado</h1><p>$path</p></body></html>"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($html)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)

            Write-Host "❌ 404 - Archivo no encontrado: $path" -ForegroundColor Red
        }

        $response.OutputStream.Close()
    }
}
finally {
    $listener.Stop()
    Write-Host ""
    Write-Host "⏹️  Servidor detenido" -ForegroundColor Yellow
}