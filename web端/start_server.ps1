# 创业分析平台 - Web前端服务器启动脚本
Write-Host "正在启动Web前端服务器，请访问 http://localhost:3000"
Write-Host "按下 Ctrl+C 可停止服务器"
Set-Location -Path $PSScriptRoot
python -m http.server 3000
