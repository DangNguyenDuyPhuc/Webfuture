$translations = @{
    '/\* Scrollbar Styling for Webkit browsers \*/' = 'LyogVMO5eSBjaOG7iW5oIHRoYW5oIGN14buZbiBjaG8gdHLDrG5oIGR1eeG7h3QgV2Via2l0ICov'
    '/\* Width of the scrollbar \*/' = 'LyogxJDhu5kgcuG7mW5nIGPhu6dhIHRoYW5oIGN14buZbiAqLw=='
    '/\* Transparent track matching glassmorphism \*/' = 'LyogTuG7gW4gdGhhbmggY3Xhu5luIHRyb25nIHN14buRdCB0aGVvIHBob25nIGPDoWNoIGdsYXNzbW9ycGhpc20gKi8='
    '/\* Gradient thumb \*/' = 'LyogVGhhbmggdHLGsOG7o3QgbcOgdSBncmFkaWVudCAqLw=='
    '/\* Slight border for definition \*/' = 'LyogVmnhu4FuIG3hu49uZyDEkeG7gyBsw6BtIG7hu5VpIGLhuq10IHRoYW5oIHRyxrDhu6N0ICov'
    '/\* Invert gradient on hover \*/' = 'LyogxJDhuqNvIG5nxrDhu6NjIG3DoHUgZ3JhZGllbnQga2hpIGRpIGNodeG7mXQgdsOgbyAqLw=='
    '/\* "auto" or "thin" \*/' = 'LyogS8OtY2ggdGjGsOG7m2M6ICJhdXRvIiBob+G6t2MgInRoaW4iICov'
    '/\* thumb color track color \*/' = 'LyogbcOgdSB0aGFuaCB0csaw4bujdCB2w6AgbcOgdSBu4buBbiB0aGFuaCBjdeG7mW4gKi8='
    '/\* Allow main content to grow \*/' = 'LyogQ2hvIHBow6lwIG7hu5lpIGR1bmcgY2jDrW5oIHThu7EgxJHhu5luZyBnacOjbiByYSAqLw=='
}

$utf8NoBom = New-Object System.Text.UTF8Encoding $false
$files = Get-ChildItem -Path . -Include *.html -File
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, $utf8NoBom)
    $original = $content
    
    foreach ($key in $translations.Keys) {
        $decoded = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($translations[$key]))
        $content = $content -replace $key, $decoded
    }
    
    if ($content -cne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
        Write-Host "Updated $($file.Name)"
    }
}
Write-Host "Done!"
