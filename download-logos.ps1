$logos = @(
    @("iit_bombay.svg", "https://upload.wikimedia.org/wikipedia/en/f/fd/Indian_Institute_of_Technology_Bombay_Logo.svg"),
    @("iit_delhi.svg", "https://upload.wikimedia.org/wikipedia/en/f/fd/Indian_Institute_of_Technology_Delhi_Logo.svg"),
    @("iit_kanpur.svg", "https://upload.wikimedia.org/wikipedia/en/a/a3/IIT_Kanpur_Logo.svg"),
    @("iit_madras.svg", "https://upload.wikimedia.org/wikipedia/en/6/69/IIT_Madras_Logo.svg"),
    @("iit_kharagpur.svg", "https://upload.wikimedia.org/wikipedia/en/1/1c/IIT_Kharagpur_Logo.svg"),
    @("iit_roorkee.png", "https://upload.wikimedia.org/wikipedia/en/6/6f/Indian_Institute_of_Technology_Roorkee_logo.png"),
    @("bits_pilani.svg", "https://upload.wikimedia.org/wikipedia/en/d/d3/BITS_Pilani-Logo.svg"),
    @("nit_trichy.svg", "https://upload.wikimedia.org/wikipedia/en/f/f8/NIT_Trichy_logo.svg"),
    @("iit_guwahati.svg", "https://upload.wikimedia.org/wikipedia/en/1/12/IIT_Guwahati_Logo.svg"),
    @("nit_warangal.png", "https://upload.wikimedia.org/wikipedia/en/c/cd/NIT_Warangal_logo.png"),
    @("nit_kurukshetra.png", "https://upload.wikimedia.org/wikipedia/en/a/a1/National_Institute_of_Technology%2C_Kurukshetra_Logo.png"),
    @("iiit_hyderabad.png", "https://upload.wikimedia.org/wikipedia/en/0/0c/IIIT_Hyderabad_logo.png")
)

$outDir = ".\assets\logos\"
if (!(Test-Path -Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
}

$ProgressPreference = 'SilentlyContinue'
foreach ($item in $logos) {
    $name = $item[0]
    $url = $item[1]
    $dest = Join-Path -Path $outDir -ChildPath $name
    try {
        Invoke-WebRequest -Uri $url -OutFile $dest -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        Write-Host "Downloaded $name"
    } catch {
        Write-Host "Failed to download $name : $_"
    }
}
