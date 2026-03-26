const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.js', 'utf8');
c = c.replace(/          <\/div>\n  \);\n}/, `          </div>\n        </div>\n      </div>\n    </>\n  );\n}`);
fs.writeFileSync('src/app/dashboard/page.js', c);
