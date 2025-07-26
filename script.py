import os
import zipfile
from pathlib import Path
import json

# Create the main project structure for AI Doctor Helper
project_name = "AI-Doctor-Helper-Complete"
base_dir = Path(project_name)

# Create all necessary directories
directories = [
    "src/main",
    "src/renderer",
    "src/preload", 
    "src/services",
    "src/utils",
    "src/models",
    "bundles/vista3d/configs",
    "bundles/swin_unetr/configs", 
    "bundles/medsam/configs",
    "data/radiology",
    "data/pathology",
    "data/cardiology",
    "data/ophthalmology",
    "finetune_cfg",
    "qabot",
    "flare_app/config",
    "flare_app/app",
    "deployment",
    "scripts",
    "docs",
    "tests",
    "models/hubert-ecg",
    "models/ecg-fm",
    "models/echoflow",
    "dist",
    "out"
]

for directory in directories:
    (base_dir / directory).mkdir(parents=True, exist_ok=True)

print(f"Created directory structure for {project_name}")
print("Main directories:")
for d in sorted(directories):
    print(f"  {d}")