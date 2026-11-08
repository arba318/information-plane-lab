import fs from 'node:fs';
import path from 'node:path';

const candidateProjects = [
  process.env.PAPER_REPRODUCTION_ROOT,
  path.resolve(import.meta.dirname, '../../paper-reproduction'),
  path.resolve(import.meta.dirname, '../../03_REPRODUCTION_CODE/paper-reproduction'),
].filter(Boolean);
const project = candidateProjects.find(candidate =>
  fs.existsSync(path.join(candidate, 'results/metrics_aggregated.csv'))
);
if (!project) {
  throw new Error(
    'Cannot locate paper-reproduction. Set PAPER_REPRODUCTION_ROOT or preserve the submission folder structure.'
  );
}
const results = path.join(project, 'results');
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
    const rawKey = row[keyName];
    const key = typeof rawKey === 'number' ? Number(rawKey).toFixed(keyName === 'fraction' ? 2 : 0) : String(rawKey);
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
      normalized_gradient_mean: Number(row.normalized_gradient_mean || 0),
      normalized_gradient_fluctuation: Number(row.normalized_gradient_fluctuation || 0),
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
const f6Curve = csv(path.join(results, 'figure6_sota/ib_curve.csv'));
const f6Layers = csv(path.join(results, 'figure6_sota/layer_endpoints_summary.csv'));
const f8a = csv(path.join(results, 'figure8_sota/protocol_a_author_configuration/metrics_aggregated.csv')).map(r => ({...r, protocol:'A'}));
const f8b = csv(path.join(results, 'figure8_sota/protocol_b_stochastic_gradient/metrics_aggregated.csv')).map(r => ({...r, protocol:'B'}));

const payload = {
  generated: new Date().toISOString(),
  figure2: groupSeries(main.filter(r => r.fraction === .85), 'fraction'),
  figure3: groupSeries(main.filter(r => r.fraction === .05 || r.fraction === .85), 'fraction'),
  figure4: groupSeries(f4, 'fraction'),
  figure5: groupSeries(f5, 'depth'),
  figure6: {
    curve: f6Curve,
    layers: f6Layers,
    status: 'measured-plus-surrogate',
    reason: 'The red endpoints come from retrained networks. The blue frontier is a declared deterministic-IB approximation based on a calibrated nonparametric soft-label surrogate because the paper\'s original soft P(Y|X) and complete solver output were not released.'
  },
  figure7: groupSeries(f7, 'fraction'),
  figure8: {
    A: groupSeries(f8a, 'protocol').A,
    B: groupSeries(f8b, 'protocol').B,
  },
};

fs.writeFileSync(output, `window.REPRO_DATA = ${JSON.stringify(payload)};\n`);
console.log(`Wrote ${output}`);
