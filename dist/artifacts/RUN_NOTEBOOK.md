# Run the ITCT reproduction notebook

Notebook: `ITCT_Midterm_Notebook.ipynb`

The notebook generates its synthetic data internally. It does not require a downloaded dataset, a GPU, or an absolute path from the authors' computers.

## Google Colab

Open the notebook directly:

https://colab.research.google.com/github/arba318/arba318.github.io/blob/main/itct-midterm/artifacts/ITCT_Midterm_Notebook.ipynb

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

## Verified portability test

The project was installed from `requirements.txt` in a fresh Python 3.13 virtual environment. The notebook then executed from an empty kernel with `NB_PRESET=quick` and `NB_USE_DRIVE=0`: all 23 code cells completed, zero cell errors occurred, 10 PNG figures were generated, and 17 offline explorer pages were exported.
