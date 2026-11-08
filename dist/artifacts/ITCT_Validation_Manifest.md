# ITCT Validation Manifest

Validation date: 2026-11-08 (Asia/Taipei)

## Project identity and attribution

- Assigned paper: Ravid Shwartz-Ziv and Naftali Tishby, *Opening the Black Box of Deep Neural Networks via Information*, arXiv:1703.00810v3 (2017).
- Website contributor order, verified in metadata, hero, contributors block, and footer:
  1. Apple Rose Buhisan Alce (D14949006)
  2. Naveed Ullah (D14949002)
- Other deliverables preserve the existing order: Naveed Ullah (D14949002), then Apple Rose Buhisan Alce (D14949006).
- The repository notebook copy lists Naveed Ullah first with his CSIE, National Taiwan University affiliation, followed by Apple Rose B. Alce with her RCITI, Academia Sinica affiliation. Experimental code, settings, outputs, and figures were not changed for attribution.

## Repository and deployment

- Local repository: `/Users/applerose.alce/Documents/New project/sites/information-plane-lab`
- Prepared local commit: `f9a6e7e` (`Finalize notebook-grounded ITCT research site`)
- Repository URL: https://github.com/arba318/information-plane-lab
- Published project directory: https://github.com/arba318/information-plane-lab/tree/main
- Live GitHub Pages URL: https://arba318.github.io/information-plane-lab/
- First verified deployed commit: `1f89125` (`Publish ITCT information-plane reproduction`)
- Verified final artifact-bearing commit: `da46ab0` (`Refresh verified final ITCT artifacts`)
- Verified notebook-portability commit: `2113053` (`Make notebook portable across laptops and Colab`)
- GitHub Pages workflow run `42411324523` completed successfully. The public project URL returned HTTP 200 and exposed the required authorship, explorer, results, and all eight downloadable artifacts.
- The local commit deliberately excludes three pre-existing dirty files that were already modified before this finalization: `dist/videos/05_figure6_ib_frontier_evidence_boundary.mp4`, `dist/videos/07_figure8_alternative_rule_trajectory.mp4`, and `generate-data.mjs`.

## Verified experimental configuration

The supplied notebook and saved long-preset outputs support the following configuration:

- 12 binary inputs and all 2^12 = 4,096 patterns.
- Icosahedron-based rotation-invariant soft-label task.
- P(Y=1) = 0.497 and I(X;Y) = 0.990 bits.
- Main architecture 12-10-7-5-4-3-2 with tanh hidden units and a two-unit softmax output.
- Manual NumPy backpropagation, cross-entropy, plain SGD, learning rate 0.05, and batch size 1,024.
- 20 networks, 10,000 epochs, seed 0, and evaluation on all 4,096 patterns.
- Whole-layer activation-vector quantization with a baseline of 30 bins.
- 119 recorded trajectory checkpoints.
- Operational geometric-mean gradient-SNR crossing at epoch 84.

## Claim-to-artifact traceability

| Experiment or claim | Notebook evidence | Website | Silent video | PowerPoint | Report |
|---|---|---|---|---|---|
| Main fitting/compression trajectory | Sections 4-5; Figures 2-3; saved 119-frame long run | Interactive explorer; Figures 2-3 tabs | 01:30.000-03:09.167 | Slides 19-21 | Sections 4-5 |
| Gradient drift/fluctuation diagnostic | Section 6; Figure 4; saved layerwise SNR arrays | Live SNR chart; Figure 4 tab | 03:09.167-04:04.167 | Slides 18 and 22 | Section 5 |
| Information Bottleneck comparison | Section 8; Figure 6; computed frontier and layer endpoints | Figure 6 tab | 04:04.167-04:59.167 | Slides 7 and 23 | Section 6 |
| Network depth | Section 9; Figure 5; threshold-crossing table | Figure 5 tab | 04:59.167-05:54.167 | Slide 24 | Section 7 |
| Training-set size | Sections 6-7; Figures 3 and 7 | Figures 3 and 7 tabs | 05:54.167-06:49.167 | Slides 20 and 29 | Section 8 |
| Committee-machine task | Section 10; Figure 8 | Figure 8 tab | 06:49.167-07:44.167 | Slide 25 | Section 8, committee subsection |
| Tanh versus ReLU | Section 11; ReLU control output | ReLU control tab | 07:44.167-08:34.167 | Slide 26 | Section 9 |
| Bin-count sensitivity | Section 12; 10/30/100-bin output | Bin sensitivity tab | 08:34.167-09:24.167 | Slide 27 | Section 9 |
| Evidence scorecard and limitations | Notebook claim audit and limitations sections | Scorecard and limitations sections | 09:24.167-10:14.167 | Slides 30-33 | Sections 10-12 |

## Main verified numerical findings

- Initial gradient SNR: 3.97; operational crossing: epoch 84; approximately 99% of epochs occur after the crossing.
- Final output representation: I(X;T) = 1.15 bits and I(T;Y) = 0.943 bits.
- Peak-to-final binned input-information losses for layers 3-6: 0.80, 2.83, 4.95, and 3.13 bits; four of six layers meet the practical compression rule.
- IB comparison: mean vertical gap 0.010 bit, maximum vertical gap 0.044 bit, output horizontal excess 0.20 bit; wide layers retain roughly 9.66-10.55 excess bits.
- Epochs to 80% of available label information for one to six hidden layers: 1,548, 612, 542, 609, 609, and 685; best speed-up is approximately 2.9x and is non-monotone after three layers.
- Final output I(T;Y) for training fractions 3%, 5%, 10%, 20%, 30%, 45%, 60%, and 85%: 0.234, 0.277, 0.401, 0.581, 0.685, 0.811, 0.876, and 0.943 bits.
- Committee-machine SNR transition: epoch 75; student architecture 12-8-5-3-2.
- Practical compression counts: tanh 4/6 layers; ReLU 5/6 layers with a moving activation-range caveat; 10, 30, and 100 bins yield 5/6, 4/6, and 3/6 layers.

## Files modified or added in the website repository

- `README.md`
- `build-site.mjs`
- `source/index.html`, `source/styles.css`, `source/app.js`, `source/naveed_main.json`
- `source/assets/naveed/*`
- `dist/index.html`, `dist/styles.css`, `dist/app.js`, `dist/data.js`
- `dist/assets/naveed/*`
- `dist/artifacts/ITCT_Midterm_Notebook.ipynb`
- `dist/artifacts/requirements.txt`
- `dist/artifacts/RUN_NOTEBOOK.md`
- `dist/artifacts/ITCT_Reproduction_Demonstration.mp4`
- `dist/artifacts/ITCT_Video_Timestamped_Presenter_Script.pdf`
- `dist/artifacts/ITCT_Final_Presentation.pptx`
- `dist/artifacts/ITCT_Final_Report.pdf`
- `dist/artifacts/ITCT_Validation_Manifest.md`

## Validation performed

### Automated project tests

- Command: `MIDTERM_NEW_FILES/.venv/bin/python -m pytest MIDTERM_NEW_FILES/tests -q`
- Result: **82 passed**, 1 third-party deprecation warning, 0 failures.

### Website

- Static build executed successfully with `node build-site.mjs`.
- `app.js` passed Node syntax validation.
- Headless Chrome desktop and mobile checks completed.
- Play/pause, epoch slider, result tabs, and layer highlighting responded correctly.
- All eight local artifact links returned HTTP 200.
- Browser console errors: 0.
- Mobile viewport: document scroll width 390 px equals client width 390 px; no horizontal overflow.
- Contributor order and IDs matched the mandatory website order.

### Silent MP4

- Decoded end-to-end with FFmpeg without error.
- Actual duration: **614.17 seconds (10:14.17)**.
- Resolution and frame rate: **1920x1080 at 30 fps**.
- Streams: one H.264 video stream; **no audio stream**.
- Scene boundaries in `video_timing.json` cover 00:00.000 through 10:14.167 without gaps.

### Timestamped script PDF

- 11 pages rendered to PNG and visually inspected.
- Contains exact start/end timestamps for all 11 scenes, visible-element descriptions, word-for-word narration, mathematical interpretation, limitations, visual cues, and transitions.
- Script duration matches the rendered MP4 duration.

### Notebook portability

- Every code cell passed Python syntax parsing, and the notebook contains no author-machine `/Users/`, `/home/`, or Windows user-directory path.
- A fresh Python 3.13 virtual environment was created and populated only from the packaged `requirements.txt`; dependency installation completed successfully.
- The notebook was then executed from an empty kernel with `NB_PRESET=quick`, `NB_USE_DRIVE=0`, and a noninteractive Matplotlib backend.
- Result: **23 of 23 code cells completed**, 0 cell errors, 10 PNG figures, and 17 interactive explorer pages.
- Elapsed clean execution time on the validation machine: 185.3 seconds.
- The explorer exports embed Plotly directly and contain no external `<script src>` dependency, so the generated HTML pages can be opened offline.
- `RUN_NOTEBOOK.md` includes direct Colab, macOS/Linux, and Windows PowerShell instructions; a section-by-section notebook map; paper-figure correspondence; profile guidance; output locations; and troubleshooting.

### PowerPoint

- Finalizer and package-integrity validation passed.
- 34 slides; no blank slide in the retained sequence.
- 34 notes slides; every slide contains embedded presenter notes.
- Slide 4 restores the original four-card claim map (two SGD phases, compression dominance, proximity to the IB bound, and depth-related acceleration) in place of the later screenshot-and-list treatment.
- Speaker notes were rewritten as technical teaching narration rather than slide captions: 6,335 words total, with 147-289 words per slide and a mean of 186.3 words.
- The notes explain definitions, derivations, experimental controls, numerical evidence, interpretation limits, and the logical relationship between the four claims.
- Slide 1 now explicitly identifies the assignment as **REPRODUCING EXPERIMENTAL RESULTS**.
- Eleven technical slides received native explanatory visuals: entropy overlap, the IB trade-off, fixed-versus-varied controls, both mutual-information derivations, the SNR regimes, layer-wise compression bars, claim-level evidence grades, an evidence-boundary ladder, a control framework, and a three-level final conclusion.
- Presentation was rendered and visually inspected as a full-slide montage.
- Slide 28 contains the verified public URL and a scannable QR code linked to the live explorer.

### Academic report

- 16 pages rendered to PNG and visually inspected.
- Contains equations, defined variables, verified experimental settings, notebook figures, numerical results, comparison table, limitations, conclusions, and references.
- It records the verified public explorer, published source directory, and first successful deployment commit.

## Scientific limitations and unresolved discrepancies

1. The reported I(X;T) values are discrete, quantizer-dependent estimates of whole-layer activation codes. They are not asserted to equal continuous-representation mutual information.
2. The SNR crossing is an operational diagnostic and does not establish Brownian diffusion as a causal mechanism.
3. Small vertical distance to the IB curve does not imply minimal horizontal input information or global IB optimality.
4. The depth advantage is not monotone after three hidden layers.
5. The main long run uses 20 networks rather than the paper's 50 and one declared seed.
6. The ReLU estimator rescales its range with current activation maxima; growing outliers can change effective resolution.
7. Critical slowing down was not tested.
8. Evidence comes from small synthetic tasks and does not establish universality for large real-world neural networks.

## Final artifact checksums (SHA-256)

| File | SHA-256 |
|---|---|
| `ITCT_Reproduction_Demonstration.mp4` | `c3d61a907f0869b5cd7db676c2f261558db51c4203a3e175613df2480a1accfe` |
| `ITCT_Video_Timestamped_Presenter_Script.pdf` | `a2762cfe6f4645097ff15a97b2b8b14aaf68a5e1de0a8ee0fa5fc3815adaa3c3` |
| `ITCT_Final_Presentation.pptx` | `bbf19f16ce2ca0f23602e0a3ebd77686a5e5a2c4918b55a477af0cf7b010e383` |
| `ITCT_Final_Report.pdf` | `92d09c8de9f84933c5d15623146a320e7efa935b37087e4813d63dd8dcf88a08` |
| `ITCT_Midterm_Notebook.ipynb` | `71672c3422da1092cfd34e3f2373ed405d677e4a6bac507cc6620c0e6f14d7b0` |
| `requirements.txt` | `fa1f9405b403fa01b8c23bb23093195ed0ec2feaf2520a7e056cd4adf960202f` |
| `RUN_NOTEBOOK.md` | `cab11c30d537e4c5c096b67215c0d1adba71ad37b6f6e590e1b135b7f63e0150` |
