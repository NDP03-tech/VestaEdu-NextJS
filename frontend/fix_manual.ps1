$base = "C:\Users\phucnd\Desktop\vestaedu\VestaEdu-NextJS\frontend\src"
$components = Join-Path $base "components"

# 1. Fix 3 files with missed import patterns
$singleEvent = Join-Path $components "Event\SingleEvent.js"
((Get-Content $singleEvent -Raw) -replace "import \{ Link \} from 'react-router-dom'", 'import Link from "next/link";') | Set-Content $singleEvent

$singleEvent2 = Join-Path $components "Event\SingleEventTwo.js"
((Get-Content $singleEvent2 -Raw) -replace "import \{ Link \} from 'react-router-dom'", 'import Link from "next/link";') | Set-Content $singleEvent2

$userHeader = Join-Path $components "User\userHeader.jsx"
$uh = Get-Content $userHeader -Raw
$uh = $uh -replace 'import \{ Link, useLocation, useNavigate \} from "react-router-dom";', 'import Link from "next/link";`nimport { useRouter } from "next/router";'
$uh = $uh -replace "const navigate = useNavigate\(\);", "const router = useRouter();"
$uh = $uh -replace "navigate\(", "router.push("
$uh = $uh -replace "const location = useLocation\(\);", ""
$uh = $uh -replace "location\.pathname", "router.pathname"
# Remove duplicate router declarations
$uh = [regex]::Replace($uh, '(const router = useRouter\(\);[\s\S]*?)(\s*const router = useRouter\(\);)', '$1', 1)
Set-Content $userHeader $uh
Write-Host "Fixed: Event/SingleEvent.js, Event/SingleEventTwo.js, User/userHeader.jsx"

# 2. Fix AdminLayout.js
$al = Join-Path $components "admin\AdminLayout.js"
$alContent = Get-Content $al -Raw
$alContent = $alContent -replace 'const AdminLayout = \(\) => \{', 'const AdminLayout = ({ children, onLogout }) => {'
$alContent = $alContent -replace '<Outlet />', '{children}'
$alContent = $alContent -replace 'localStorage\.removeItem\("token"\);\s*\n\s*router\.push\("/login"\);', 'onLogout();'
# Remove duplicate router
$alContent = [regex]::Replace($alContent, '(const router = useRouter\(\);`n)(.*?\1)', '$1', 1)
Set-Content $al $alContent
Write-Host "Fixed: admin/AdminLayout.js"

# 3. Fix UserLayout.jsx
$ul = Join-Path $components "User\UserLayout.jsx"
$ulContent = Get-Content $ul -Raw
$ulContent = $ulContent -replace 'const UserLayout = \(\) => \{', 'const UserLayout = ({ children }) => {'
$ulContent = $ulContent -replace '<Outlet />', '{children}'
Set-Content $ul $ulContent
Write-Host "Fixed: User/UserLayout.jsx"

# 4. Fix LoginMain.js
$lm = Join-Path $components "authentication\LoginMain.js"
$lmContent = Get-Content $lm -Raw
$lmContent = $lmContent -replace 'import React, \{ useState \} from "react";', 'import React, { useState, useEffect } from "react";`nimport { useRouter } from "next/router";'
$lmContent = $lmContent -replace 'if \(redirectToDashboard\) \{\s*const role = JSON\.parse\(localStorage\.getItem\("user"\) \|\| "\{\}"\)\.role;\s*return <Navigate to=\{role === "admin" \? "/admin" : "/user"\} />;\s*\}', 'const router = useRouter();`n  useEffect(() => {' + "`n" + '    if (redirectToDashboard) {' + "`n" + '      const role = JSON.parse(localStorage.getItem("user") || "{}").role;' + "`n" + '      router.replace(role === "admin" ? "/admin" : "/user");' + "`n" + '    }' + "`n" + '  }, [redirectToDashboard, router]);'
Set-Content $lm $lmContent
Write-Host "Fixed: authentication/LoginMain.js"

# 5. Delete old ProtectedRoute files
Remove-Item (Join-Path $components "ProtectedRoute\ProtectedRoute.js") -ErrorAction SilentlyContinue
Remove-Item (Join-Path $components "ProtectedRoute\AdminRoute.jsx") -ErrorAction SilentlyContinue
Remove-Item (Join-Path $components "ProtectedRoute\UserRoute.jsx") -ErrorAction SilentlyContinue
Write-Host "Deleted old ProtectedRoute files"

# 6. Fix duplicate router in all files that might have it
$allFiles = Get-ChildItem $components -Recurse -File | Where-Object { $_.Extension -in ".js", ".jsx" }
foreach ($file in $allFiles) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match 'const router = useRouter\(\);(?:[^}]*?const router = useRouter\(\);)') {
        # Remove duplicate router declarations
        $content = [regex]::Replace($content, '(const router = useRouter\(\);[\s\S]*?)(\s*const router = useRouter\(\);)', '$1', 1)
        Set-Content $file.FullName $content
        Write-Host "Fixed duplicates in: $($file.Name)"
    }
}

Write-Host "`nAll manual fixes complete!"
