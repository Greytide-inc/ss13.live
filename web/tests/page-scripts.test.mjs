// Page guard: inline <script type="module"> blocks in worker/*.html must be plain JS.
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os'; import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'worker');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pagechk-'));
let bad = 0, n = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(dir, f), 'utf8');
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/g; let m, i = 0;
  while ((m = re.exec(html))) {
    if (!/type\s*=\s*["']module["']/.test(m[1]) || /\bsrc\s*=/.test(m[1])) continue;
    const src = m[2].replace(/^\s*import\s[^;]*;?\s*$/gm, '');
    const p = path.join(tmp, `${f}-${i++}.mjs`); fs.writeFileSync(p, src); n++;
    try { execFileSync(process.execPath, ['--check', p], { stdio: 'pipe' }); }
    catch (e) { bad++; console.error(`FAIL ${f} module script #${i}:\n${String(e.stderr).split('\n').slice(0, 6).join('\n')}`); }
  }
}
fs.rmSync(tmp, { recursive: true });
if (bad) process.exit(1);
console.log(`page-scripts ok (${n} inline module scripts)`);
