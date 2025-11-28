# Castello Coffee Platform - Environment Setup Script

Write-Host "🎨 Castello Coffee Platform - Environment Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (Test-Path .env) {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
} else {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    
    $envContent = @"
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="castello-coffee-secure-secret-key-$(Get-Random)-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
"@
    
    $envContent | Out-File -FilePath .env -Encoding UTF8
    Write-Host "✅ .env file created successfully" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔐 Login Credentials:" -ForegroundColor Cyan
Write-Host "   CEO: ceo@castello.com / castello123" -ForegroundColor White
Write-Host "   HR:  hr@castello.com / castello123" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Run: npm run dev" -ForegroundColor White
Write-Host "   2. Open: http://localhost:3000" -ForegroundColor White
Write-Host "   3. Login with credentials above" -ForegroundColor White
Write-Host ""


