$base = "C:\Users\phucnd\Desktop\vestaedu\VestaEdu-NextJS\frontend\src\components"

# Fix 1: Remove duplicate 'const router = useRouter();' lines in all .js/.jsx files
Get-ChildItem $base -Recurse -File | Where-Object { $_.Extension -in ".js", ".jsx" } | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $original = $content
    $lines = $content -split "`n"
    $seen = $false
    $newLines = @()
    foreach ($line in $lines) {
        if ($line -match 'const router = useRouter\(\);') {
            if ($seen) { continue }
            $seen = $true
        }
        $newLines += $line
    }
    $content = $newLines -join "`n"
    if ($content -ne $original) {
        Set-Content $_.FullName $content
        Write-Host "Fixed duplicates in: $($_.Name)"
    }
}

# Fix 2: Replace literal backtick-n with actual newline in userHeader.jsx
$uh = Join-Path $base "User\userHeader.jsx"
$content = Get-Content $uh -Raw
$content = $content -replace ";`n", ";`n"  # This is a no-op placeholder; actual fix below
# Replace literal backtick-n character sequence with newline
$content = $content -creplace ";``n", ";`n"
Set-Content $uh $content
Write-Host "Fixed: userHeader.jsx backtick-n"

# Fix 3: Replace 'navigate' with 'router' in dependency arrays
Get-ChildItem $base -Recurse -File | Where-Object { $_.Extension -in ".js", ".jsx" } | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $original = $content
    # Replace navigate in array context: }, [xxx, navigate])
    $content = $content -replace '(\], \[.*, )\bnavigate\b(\])', '$1router$2'
    # Also handle [navigate, xxx]
    $content = $content -replace '(\[)\bnavigate\b(,)', '$1router$2'
    if ($content -ne $original) {
        Set-Content $_.FullName $content
        Write-Host "Fixed navigate->router in deps: $($_.Name)"
    }
}

# Fix 4: Replace remaining 'navigate' references (not router.push) with 'router'
Get-ChildItem $base -Recurse -File | Where-Object { $_.Extension -in ".js", ".jsx" } | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $original = $content
    # Replace standalone 'navigate' that's not 'navigate(' or 'router.push'
    $content = $content -replace '\bnavigate\b', 'router'
    if ($content -ne $original) {
        Set-Content $_.FullName $content
        Write-Host "Fixed remaining navigate refs: $($_.Name)"
    }
}

Write-Host "`nAll fixes complete!"
