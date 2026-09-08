import { execFile } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlFile = path.resolve(__dirname, '..', 'README.html');
const pdfFile = path.resolve(__dirname, '..', 'README.pdf');

console.log('Generating PDF from:', htmlFile);
console.log('Target PDF:', pdfFile);

const args = [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  `--print-to-pdf=${pdfFile}`,
  `file:///${htmlFile.replace(/\\/g, '/')}`
];

execFile(chromePath, args, (err, stdout, stderr) => {
  if (err) {
    console.error('Error generating PDF:', err);
    return;
  }
  if (fs.existsSync(pdfFile)) {
    const stats = fs.statSync(pdfFile);
    console.log(`✅ Successfully generated README.pdf! Size: ${(stats.size / 1024).toFixed(1)} KB`);
  } else {
    console.error('PDF not found after execution.');
  }
});
