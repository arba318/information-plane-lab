import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const results = path.join(root, 'paper-reproduction/results');
const output = path.join(import.meta.dirname, 'dist/data.js');

function csv(file) {
  const lines = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/);
  const headers = lines.shift().split(',');
  return lines.map(line => Object.fromEntries(line.split(',').map((value, i) => {
    const number = Number(value);
    return [headers[i], Number.isFinite(number) ? number : value];
  })));
}

function groupSeries(rows, keyName) {
  const grouped = {};
  for (const row of rows) {
    const key = Number(row[keyName]).toFixed(keyName === 'fraction' ? 2 : 0);
    grouped[key] ??= new Map();
    if (!grouped[key].has(row.epoch)) {
      grouped[key].set(row.epoch, {
        epoch: row.epoch, fraction: row.fraction, depth: row.depth,
        train_accuracy: row.train_accuracy, test_accuracy: row.test_accuracy,
        full_loss: row.full_loss, layers: [],
      });
    }
    grouped[key].get(row.epoch).layers.push({
      layer: row.layer, width: row.width, ix: row.ix, iy: row.iy,
      ix_sd: Number(row.ix_sd || 0), iy_sd: Number(row.iy_sd || 0),
      gradient_mean: Number(row.gradient_mean || row.gradient_mean_norm || 0),
      gradient_fluctuation: Number(row.gradient_fluctuation || 0),
      gradient_snr: Number(row.gradient_snr || 0),
    });
  }
  return Object.fromEntries(Object.entries(grouped).map(([key, map]) =>
    [key, [...map.values()].sort((a, b) => a.epoch - b.epoch)]));
}

const main = csv(path.join(results, 'metrics_aggregated.csv'));
const f4 = csv(path.join(results, 'figure4/metrics_aggregated.csv'));
const f5 = csv(path.join(results, 'figure5/metrics_aggregated.csv'));
const f7 = csv(path.join(results, 'figure7/metrics_aggregated.csv'));
const f8 = csv(path.join(results, 'figure8/metrics_aggregated.csv'));

const payload = {
  generated: new Date().toISOString(),
  figure2: groupSeries(main.filter(r => r.fraction === .85), 'fraction'),
  figure3: groupSeries(main.filter(r => r.fraction === .05 || r.fraction === .85), 'fraction'),
  figure4: groupSeries(f4, 'fraction'),
  figure5: groupSeries(f5, 'depth'),
  figure6: {
    status: 'method-only',
    reason: 'The released repository does not include the original soft P(Y|X), spherical-harmonic rule parameters, or exact IB-solver output needed for an honest numerical reconstruction.'
  },
  figure7: groupSeries(f7, 'fraction'),
  figure8: { '0.80': groupSeries(f8.map(r => ({ ...r, fraction: .8 })), 'fraction')['0.80'] },
};

fs.writeFileSync(output, `window.REPRO_DATA = ${JSON.stringify(payload)};\n`);
console.log(`Wrote ${output}`);
