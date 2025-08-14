$files = @("skills.html", "projects.html", "contact.html", "education.html")

foreach ($file in $files) {
    $filePath = "c:\Users\HP ZBOOK 15 G5\Documents\GitHub\MadScie254\$file"
    if (Test-Path $filePath) {
        Write-Host "Updating $file..."
        
        # Read file content
        $content = Get-Content $filePath -Raw
        
        # Remove theme toggle
        $content = $content -replace '(?s)<!-- Theme Toggle -->.*?</button>\s*\n\s*<!-- Mobile Menu Button -->', '<!-- Mobile Menu Button -->'
        
        # Replace profile images
        $content = $content -replace 'assets/images/profile\.jpg', 'assets/images/My_Profile_Photo.jpg'
        
        # Add floating class to profile images
        $content = $content -replace 'class="about__image"', 'class="about__image floating"'
        
        # Write back to file
        $content | Set-Content $filePath -NoNewline
        
        Write-Host "Updated $file successfully"
    }
}

Write-Host "All files updated!"
