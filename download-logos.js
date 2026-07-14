const https = require('https');
const fs = require('fs');
const path = require('path');

const logos = [
    { name: 'iit_bombay.svg', url: 'https://upload.wikimedia.org/wikipedia/en/f/fd/Indian_Institute_of_Technology_Bombay_Logo.svg' },
    { name: 'iit_delhi.svg', url: 'https://upload.wikimedia.org/wikipedia/en/f/fd/Indian_Institute_of_Technology_Delhi_Logo.svg' },
    { name: 'iit_kanpur.svg', url: 'https://upload.wikimedia.org/wikipedia/en/a/a3/IIT_Kanpur_Logo.svg' },
    { name: 'iit_madras.svg', url: 'https://upload.wikimedia.org/wikipedia/en/6/69/IIT_Madras_Logo.svg' },
    { name: 'iit_kharagpur.svg', url: 'https://upload.wikimedia.org/wikipedia/en/1/1c/IIT_Kharagpur_Logo.svg' },
    { name: 'iit_roorkee.png', url: 'https://upload.wikimedia.org/wikipedia/en/6/6f/Indian_Institute_of_Technology_Roorkee_logo.png' },
    { name: 'bits_pilani.svg', url: 'https://upload.wikimedia.org/wikipedia/en/d/d3/BITS_Pilani-Logo.svg' },
    { name: 'nit_trichy.svg', url: 'https://upload.wikimedia.org/wikipedia/en/f/f8/NIT_Trichy_logo.svg' },
    { name: 'iit_guwahati.svg', url: 'https://upload.wikimedia.org/wikipedia/en/1/12/IIT_Guwahati_Logo.svg' },
    { name: 'nit_warangal.png', url: 'https://upload.wikimedia.org/wikipedia/en/c/cd/NIT_Warangal_logo.png' },
    { name: 'nit_kurukshetra.png', url: 'https://upload.wikimedia.org/wikipedia/en/a/a1/National_Institute_of_Technology%2C_Kurukshetra_Logo.png' },
    { name: 'iiit_hyderabad.png', url: 'https://upload.wikimedia.org/wikipedia/en/0/0c/IIIT_Hyderabad_logo.png' }
];

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => { file.close(); resolve(); });
            } else if (response.statusCode === 301 || response.statusCode === 302) {
                // handle redirect
                download(response.headers.location, dest).then(resolve).catch(reject);
            } else {
                reject(`Failed downloading ${url}: ${response.statusCode}`);
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err.message));
        });
    });
};

async function main() {
    const dir = path.join(__dirname, 'assets', 'logos');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    for (const logo of logos) {
        try {
            console.log(`Downloading ${logo.name}...`);
            await download(logo.url, path.join(dir, logo.name));
            console.log(`Done -> ${logo.name}`);
        } catch (e) {
            console.log(`Error on ${logo.name}:`, e);
        }
    }
}

main();
