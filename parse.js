const fs = require('fs');
const content = fs.readFileSync('src/app/dashboard/page.js', 'utf8');

let divOpened = 0;
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
   const line = lines[i];
   // skip comments
   if (line.includes('//') && (!line.includes('<div') || !line.includes('</div'))) continue;

   const opens = (line.match(/<div(?![a-zA-Z])/g) || []).length;
   const closes = (line.match(/<\/div>/g) || []).length;
   
   divOpened += opens;
   divOpened -= closes;
   
   if (divOpened < 0) {
      console.log(`Mismatch at line ${i+1}: div count corresponds to negative! (Closes: ${closes}, Opens: ${opens}) ` + line.trim());
      divOpened = 0;
   }
}
console.log("Final balance: ", divOpened);
