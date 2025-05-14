# 创业分析平台一键启动脚本
$script:ErrorActionPreference = "Continue"

function Start-Service {
    param($Name, $Path)
    Write-Host "正在启动$Name..." -ForegroundColor Yellow
    Push-Location $Path
    docker-compose up -d
    if ($LASTEXITCODE -eq 0) { Write-Host "$Name启动成功！" -ForegroundColor Green } 
    else { Write-Host "$Name启动失败，请检查错误信息" -ForegroundColor Red }
    Pop-Location
}

# 主程序
Write-Host "====== 创业分析平台服务启动工具 ======" -ForegroundColor Cyan
Write-Host "正在启动所有服务，请稍候..." -ForegroundColor White

# 初始化路径
$rootDir = "C:\Users\35064\Desktop\创业分析平台_精简"
Set-Location $rootDir

# 启动各个服务
Start-Service -Name "NocoBase后端" -Path "$rootDir\后端服务\nocobase"
Start-Service -Name "数据分析服务(Superset)" -Path "$rootDir\后端服务\数据分析\superset"
Start-Service -Name "爬虫系统(Spider-Flow)" -Path "$rootDir\后端服务\爬虫系统\spider-flow"

# 启动AI模型
Write-Host "正在启动AI模型..." -ForegroundColor Yellow
Set-Location "$rootDir\AI模型\simple_model"
$imageExists = docker images -q startup-analysis-model
if (-not $imageExists) {
    Write-Host "AI模型镜像不存在，正在构建..." -ForegroundColor Cyan
    docker build -t startup-analysis-model .
}
docker run -d -p 5000:5000 --name ai-model startup-analysis-model 2>$null
if ($LASTEXITCODE -ne 0) {
    docker start ai-model 2>$null
}
Write-Host "AI模型已启动" -ForegroundColor Green
Set-Location $rootDir

# 显示服务
Write-Host "`n====== 所有服务已启动 ======" -ForegroundColor Green
Write-Host "服务访问地址:" -ForegroundColor Cyan
Write-Host "* NocoBase管理界面: http://localhost:8000/"
Write-Host "* Superset数据分析平台: http://localhost:8088/"
Write-Host "* AI模型API: http://localhost:5000/"

# 询问是否启动Web端
$response = Read-Host "`n是否要启动Web端服务? (Y/N)"
if ($response -eq "Y" -or $response -eq "y") {
    Write-Host "正在启动Web端服务..." -ForegroundColor Cyan
    Set-Location "$rootDir\web端"
    & .\run_server.bat
} else {
    Write-Host "已跳过Web端服务启动。您可以稍后手动启动。" -ForegroundColor Yellow
}
