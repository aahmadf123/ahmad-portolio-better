$files = Get-ChildItem "c:\Users\firas\ahmad-portolio-better\src\app\case-study" -Filter "page.tsx" -Recurse

foreach ($f in $files) {
    Write-Host "Processing: $($f.FullName)"
    $c = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    
    # Add Link import after React import line if not already present
    if ($c -notmatch "import Link from 'next/link'") {
        $c = $c -replace "(import React, \{[^}]+\} from 'react';)", "`$1`nimport Link from 'next/link';"
    }
    
    # Replace <a href="/#projects" with <Link href="/#projects" transitionTypes={['nav-back']}
    $c = $c.Replace('<a href="/#projects"', '<Link href="/#projects" transitionTypes={[''nav-back'']}')
    
    # Replace closing </a> for each such Link
    $pattern = '(?s)(<Link href="/#projects" transitionTypes=\{\[''nav-back''\]\}[^>]*>)(.*?)(</a>)'
    if ($c -match $pattern) {
        $c = [regex]::Replace($c, $pattern, '$1$2</Link>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    }
    
    [System.IO.File]::WriteAllText($f.FullName, $c, [System.Text.Encoding]::UTF8)
    Write-Host "Done: $($f.Name)"
}
Write-Host "All case study pages updated."
