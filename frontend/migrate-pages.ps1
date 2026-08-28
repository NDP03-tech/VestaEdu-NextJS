$src = "c:\Users\phucnd\Desktop\vestaedu\VestaEdu-NextJS\frontend\src"
$pagesPath = Join-Path $src "pages"
$componentsPath = Join-Path $src "components"

Write-Host "Moving files from src/pages/ to src/components/..."

# Get all files in src/pages/ recursively
Get-ChildItem -Path $pagesPath -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Replace($pagesPath + "\", "")
    $targetPath = Join-Path $componentsPath $relativePath
    $targetDir = Split-Path $targetPath -Parent

    if (!(Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }

    Move-Item $_.FullName $targetPath -Force

    # Fix relative imports
    $content = Get-Content $targetPath -Raw
    $depth = ($relativePath.Split("\").Count - 1)

    if ($depth -eq 0) {
        # File was directly in src/pages/ (now in src/components/)
        # ../components/ -> ./
        $content = $content -replace "\.\./components/", "./"
    } else {
        # File was in a subdirectory of src/pages/ (now in src/components/<subdir>/)
        # ../../components/ -> ../
        $content = $content -replace "\.\./\.\./components/", "../"
    }

    Set-Content $targetPath $content
    Write-Host "Moved: $relativePath"
}

# Remove empty pages directory
Remove-Item $pagesPath -Recurse -Force
Write-Host "Removed old src/pages/ directory"

# Remove old CRA entry points
Remove-Item (Join-Path $src "app") -Recurse -Force
Write-Host "Removed src/app/"
Remove-Item (Join-Path $src "index.js") -Force
Write-Host "Removed src/index.js"
Remove-Item (Join-Path $src "reportWebVitals.js") -Force
Write-Host "Removed src/reportWebVitals.js"
Remove-Item (Join-Path $src "setupTests.js") -Force
Write-Host "Removed src/setupTests.js"

Write-Host "Migration: Files moved and imports fixed successfully!"
