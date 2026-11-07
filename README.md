# ITCT Information-Plane Reproduction

Static research companion for the reproduction and critical evaluation of Shwartz-Ziv and Tishby (2017), *Opening the Black Box of Deep Neural Networks via Information*.

Contributors, in the website's required order:

1. Apple Rose Buhisan Alce (D14949006)
2. Naveed Ullah (D14949002)

## Evidence source

The published interface reads saved outputs from the submitted NumPy notebook. The main trajectory contains 119 recorded checkpoints from the declared long preset: 20 networks, 10,000 epochs, learning rate 0.05, batch size 1,024, and a 30-bin whole-layer activation estimator. The browser does not retrain the model and does not synthesize intermediate measurements.

The site distinguishes binned mutual-information estimates from information in the underlying continuous activations. Scientific claims are labeled by their evidence boundary.

## Local preview

From VS Code's terminal:

```bash
node build-site.mjs
cd dist
python3 -m http.server 8000
```

Open `http://127.0.0.1:8000`.

## Main controls

- Epoch slider over exact saved checkpoints.
- Play/pause and playback-speed control.
- Clickable layer legend for layer highlighting.
- Ensemble observations and layer means.
- Information-plane, input-information, and gradient-SNR views.
- Experiment selector for Figures 2–8, ReLU, and bin-count sensitivity.
- Explicit interpretation boundaries and a claim scorecard.

## Repository layout

- `source/`: readable website source and the exact saved-data JSON used by the interface.
- `dist/`: GitHub Pages-ready static website.
- `dist/artifacts/`: corrected notebook copy and final research artifacts linked from the site.
- `.openai/hosting.json`: existing hosting-project metadata.

The notebook copy changes contributor attribution only. Experimental code, settings, numerical outputs, and saved figures are unchanged.

## Deployment status

The repository is locally prepared for GitHub Pages. Publication requires a valid GitHub login and explicit authorization of the intended repository. A public URL must not be claimed until it is opened and verified after deployment.
