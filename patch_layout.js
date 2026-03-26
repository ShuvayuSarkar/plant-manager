const fs = require('fs');

let content = fs.readFileSync('src/app/dashboard/page.js', 'utf8');

const maintenanceStart = "\n          {/* ══ 3. MAINTENANCE PIPELINE ══ */}\n          <div>\n            <div className=\"sec-label\">Maintenance Pipeline</div>";
const maintenanceEnd = "            </div>\n          </div>\n\n          {/* ══ 4 & 5. COMPACTED HORIZONTAL SECTIONS ══ */}";

// Let's get the exact blocks using slice if needed, or regex.
// Since Maintenance Pipeline has a known structure and we can locate "Asset Live Readings", let's extract the whole div for Asset Live Readings.
const assetStartFlag = "          {/* ══ 6. ASSET FEEDING ══ */}\n          <div>\n            <div className=\"sec-label\">Asset Live Readings</div>";
const assetEndFlag = "          </div>\n\n          {/* ══ 7 & 8. COMPACTED HORIZONTAL SECTIONS ══ */}";

let iAssetStart = content.indexOf(assetStartFlag);
let iAssetEnd = content.indexOf(assetEndFlag, iAssetStart);
if (iAssetStart === -1 || iAssetEnd === -1) {
    console.error("Could not find Asset block");
    process.exit(1);
}

const assetBlock = content.substring(iAssetStart + 31, iAssetEnd); // skip the comment to start at <div>
// remove the original asset block
content = content.substring(0, iAssetStart) + content.substring(iAssetEnd + 11);

// Now find maintenance block
let iMaintStart = content.indexOf(maintenanceStart);
let iMaintEnd = content.indexOf(maintenanceEnd, iMaintStart);
if (iMaintStart === -1 || iMaintEnd === -1) {
    console.error("Could not find Maintenance block");
    process.exit(1);
}

const mainBlock = content.substring(iMaintStart + 43, iMaintEnd);

const newBlock = `
          {/* ══ 3. & 6. MAINTENANCE & ASSET READINGS ══ */}
          <div className="grid-2-col">
            ${mainBlock}

            ${assetBlock.trimEnd()}
            </div>
          </div>

          {/* ══ 4 & 5. COMPACTED HORIZONTAL SECTIONS ══ */}`;

content = content.substring(0, iMaintStart) + newBlock + content.substring(iMaintEnd + 66);

fs.writeFileSync('src/app/dashboard/page.js', content, 'utf8');
console.log("Replacement done");

