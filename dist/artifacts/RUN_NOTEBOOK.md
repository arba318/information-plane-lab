# Run the ITCT reproduction notebook

Notebook: `ITCT_Midterm_Notebook.ipynb`

The notebook generates its synthetic data internally. It does not require a downloaded dataset, a GPU, or an absolute path from the authors' computers.

## Why this Markdown file and `requirements.txt` are both included

- `requirements.txt` is for Python and package managers. It lists the packages needed to create a runnable environment.
- `RUN_NOTEBOOK.md` is for the reader. It explains where to begin, which sections produce each result, how long the profiles take, and where outputs are saved.

Keep both files beside the notebook. They solve different reproducibility problems.

## Recommended way to navigate the notebook

For a first reading, follow this order:

1. Read the title cell and the experiment map.
2. Run the setup cell and confirm that it prints the intended profile, network count, epoch count, learning rate, batch size, and bin count.
3. Read Sections 1–4 before interpreting any graph. They define the task, neural network, mutual-information estimator, and training procedure.
4. Run Sections 5–12 sequentially. Later experiments reuse functions and variables defined earlier.
5. Use Section 13 after the numerical experiments finish. It builds the interactive information-plane explorer from the saved measurements.
6. Read Sections 14–15 for the claim-level scorecard and limitations before reporting conclusions.
7. Run Section 16 last to package figures and explorer pages.

Do not begin execution in the middle of a fresh kernel. Choose **Run All** or execute the cells from top to bottom because later sections depend on earlier definitions.

## Notebook map

| Section | Purpose | Principal output |
|---|---|---|
| Setup | Installs missing packages, selects a profile, and creates portable cache/output directories | Printed configuration |
| 1 | Constructs all 4,096 binary inputs and the icosahedral soft-label rule | `X_ALL`, `PY1`, and task-information checks |
| 2 | Defines the batched NumPy neural-network ensemble and manual backpropagation | `Ensemble` class |
| 3 | Quantizes whole-layer activation vectors and estimates `I(X;T)` and `I(T;Y)` | Information-estimator functions |
| 4 | Defines snapshot scheduling, SGD training, caching, gradient statistics, and information recording | `train_ensemble` |
| 5 | Trains the main sample-size sweep and selects the 85% run | `SWEEP`, `MAIN`, and Figure 2 |
| 6 | Measures the gradient-SNR transition and plots trajectories for selected training fractions | Figures 3 and 4 |
| 7 | Relates final representations to training-set size | Figure 7 |
| 8 | Computes an Information Bottleneck frontier and compares converged layers with it | Figure 6 |
| 9 | Trains one- through six-hidden-layer networks and measures time to target information | Figure 5 and timing table |
| 10 | Repeats the analysis on the committee-machine task | Figure 8 |
| 11 | Compares tanh with ReLU using the submitted estimator | ReLU control figure and compression table |
| 12 | Repeats the estimator with 10, 30, and 100 bins | Bin-sensitivity figure and table |
| 13 | Builds the epoch slider, play control, experiment selector, and offline HTML exports | 17 interactive explorers |
| 14 | Evaluates the paper's claims against measured notebook evidence | Claim scorecard |
| 15 | Separates reproduced observations from estimator-dependent or causal interpretations | Limitations and discussion |
| 16 | Creates the final ZIP package | `figures_<profile>.zip` |

## Paper figure correspondence

| Paper result | Notebook location |
|---|---|
| Figure 2: layer snapshots | Section 5a |
| Figure 3: training-fraction trajectories | Section 6 |
| Figure 4: drift and diffusion diagnostic | Section 6 |
| Figure 5: network depth | Section 9 |
| Figure 6: Information Bottleneck comparison | Section 8 |
| Figure 7: training-set size | Section 7 |
| Figure 8: alternative rule | Section 10 |

The ReLU and bin-count studies in Sections 11–12 are additional controls rather than original paper figures.

## Which profile should be used?

- Use `quick` when checking installation, code order, figures, widgets, and export behavior on a new computer.
- Use `long` when reproducing the numerical values cited in the submitted report, presentation, and website.
- Use `paper` only when the larger 50-network ensemble is necessary and several hours of CPU time are available.

The quick profile exercises every notebook section but is not expected to reproduce the final long-profile numbers exactly.

## Google Colab

Open the notebook directly:

https://colab.research.google.com/github/arba318/information-plane-lab/blob/main/dist/artifacts/ITCT_Midterm_Notebook.ipynb

Choose **Runtime → Run all**. The setup cell installs only packages that are missing from the Colab runtime.

The default `long` profile reproduces the submitted 20-network, 10,000-epoch results. For a faster end-to-end check, insert this cell before the setup cell and run it first:

```python
import os
os.environ["NB_PRESET"] = "quick"
```

Google Drive is optional. To store caches there, also set `os.environ["NB_USE_DRIVE"] = "1"`. Without that setting, no authorization prompt appears and files remain in the Colab runtime.

## Laptop: macOS or Linux

Python 3.10 or newer is recommended.

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
NB_PRESET=quick jupyter lab
```

Open the notebook and choose **Run → Run All Cells**. Replace `quick` with `long` for the submitted experiment settings.

## Laptop: Windows PowerShell

```powershell
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
$env:NB_PRESET = "quick"
jupyter lab
```

## Profiles

- `quick`: complete smoke test of every section with 5 networks and 1,500 epochs.
- `standard`: 20 networks and 5,000 epochs.
- `long`: submitted reproduction, 20 networks and 10,000 epochs.
- `paper`: 50 networks and 10,000 epochs; highest compute cost.

Results are cached by profile, seed, learning rate, batch size, bin count, and architecture. Delete the generated `cache/` directory if a completely fresh run is required.

## Outputs

- `cache/`: reusable numerical results.
- `figures/`: static PNG figures.
- `figures/explorer/`: 17 self-contained interactive HTML files plus an index.
- `figures_<profile>.zip`: final packaged outputs.

## Common issues

- **A later cell reports an undefined variable:** restart the kernel and run from the beginning.
- **The results appear to come from an older configuration:** delete the corresponding file from `cache/`, or delete the complete cache directory for a fresh run.
- **Google Drive asks for authorization:** Drive is not required. Remove or unset `NB_USE_DRIVE`, restart the runtime, and run again.
- **The interactive widget is not visible in a static notebook preview:** run the direct-view fallback immediately after Section 13, or open `figures/explorer/index.html`.
- **A long run is interrupted:** rerun the notebook. Completed experiment groups are cached and are loaded instead of retrained.
- **The browser has no internet connection:** use the exported explorer pages; Plotly is embedded in each HTML file.

## Verified portability test

The project was installed from `requirements.txt` in a fresh Python 3.13 virtual environment. The notebook then executed from an empty kernel with `NB_PRESET=quick` and `NB_USE_DRIVE=0`: all 23 code cells completed, zero cell errors occurred, 10 PNG figures were generated, and 17 offline explorer pages were exported.
