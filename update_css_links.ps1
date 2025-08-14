$files = @("about.html", "skills.html", "projects.html", "contact.html", "education.html")

foreach ($file in $files) {
    $filePath = "c:\Users\HP ZBOOK 15 G5\Documents\GitHub\MadScie254\$file"
    if (Test-Path $filePath) {
        Write-Host "Adding interactive CSS to $file..."
        
        # Read file content
        $content = Get-Content $filePath -Raw
        
        # Add interactive CSS link
        $content = $content -replace '(<link rel="stylesheet" href="assets/css/layout\.css">)', '$1`n    <link rel="stylesheet" href="assets/css/interactive-features.css">'
        
        # Write back to file
        $content | Set-Content $filePath -NoNewline
        
        Write-Host "Updated $file successfully"
    }
}

Write-Host "All HTML files updated with interactive CSS!"
