# Script to run I-Vantage Website for Local & Phone Testing

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Starting I-Vantage Website (Server + Client)" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

# Find local IPv4 address
$ip = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias 'Wi-Fi*','Ethernet*' -ErrorAction SilentlyContinue | 
       Where-Object { $_.IPAddress -notmatch '^(127\.|169\.254\.)' } | 
       Select-Object -ExpandProperty IPAddress -First 1)

if (-not $ip) {
    $ip = "192.168.1.7"
}

Write-Host "`nAccess URLs:" -ForegroundColor Yellow
Write-Host "  💻 Local PC Testing:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "  📱 Phone Testing:     http://$($ip):3000" -ForegroundColor Green
Write-Host "  ⚙️ Backend API:       http://$($ip):5000/api/v1" -ForegroundColor Gray
Write-Host "`nInstructions for Phone Testing:" -ForegroundColor Yellow
Write-Host "  1. Connect your phone to the same Wi-Fi network ('Airtel_i-VANTAGE')."
Write-Host "  2. Open Chrome, Safari, or any browser on your phone."
Write-Host "  3. Go to: http://$($ip):3000`n" -ForegroundColor Green

npm run dev
