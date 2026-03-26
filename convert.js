const fs = require('fs');

let html = fs.readFileSync('raw.html', 'utf8');
html = html.replace(/class=/g, 'className=');

// Basic style converter class="something" style="color:red; margin-bottom:0;"
html = html.replace(/style="([^"]+)"/g, (match, p1) => {
    const rules = p1.split(';').filter(r => r.trim());
    let objStr = rules.map(r => {
        let [k, v] = r.split(':');
        k = k.trim().replace(/-([a-z])/g, (m, p1) => p1.toUpperCase());
        return `${k}: '${v.trim()}'`;
    }).join(', ');
    return `style={{ ${objStr} }}`;
});

fs.writeFileSync('converted.jsx', html);
