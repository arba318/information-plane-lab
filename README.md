# Information Plane Lab

Interactive companion for the reproduction of *Opening the Black Box of Deep Neural Networks via Information*.

The site is buildless. Serve `dist/` with any static web server. The interface reads only saved reproduction measurements from `data.js`; it does not retrain the network in the browser.

## Controls

- Choose the 5%, 45%, or 85% training-set experiment.
- Move the epoch slider or press Play.
- Toggle path history and uncertainty bands.
- Inspect accuracy, loss, gradient SNR, and layer coordinates.

## Data provenance

`dist/data.js` is generated from `paper-reproduction/results/metrics_aggregated.csv`.
