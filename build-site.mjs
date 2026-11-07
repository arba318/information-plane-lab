import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const source = join(root, 'source');
const dist = join(root, 'dist');

await mkdir(dist, { recursive: true });
for (const name of ['index.html', 'styles.css', 'app.js']) {
  await cp(join(source, name), join(dist, name));
}
await cp(join(source, 'assets'), join(dist, 'assets'), { recursive: true });

const notebookOutput = JSON.parse(await readFile(join(source, 'naveed_main.json'), 'utf8'));
await writeFile(
  join(dist, 'data.js'),
  `window.ITCT_DATA = ${JSON.stringify({ naveed: notebookOutput })};\n`,
  'utf8',
);

console.log(`Built static site in ${dist}`);
