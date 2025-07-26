# AI Doctor Helper – Deployment Zip Guide

The `AI-Doctor-Helper-Complete.zip` archive has been generated.

**How to use**

1. Download `AI-Doctor-Helper-Complete.zip`.
2. Extract it anywhere on your Windows machine (e.g., `C:\AI-Doctor-Helper`).
3. Open **PowerShell** and execute:
   ```powershell
   # Navigate to folder
   cd C:\AI-Doctor-Helper

   # Install Node dependencies
   yarn install

   # Create Python environment (if conda)
   conda env create -f deployment/environment.yml
   conda activate medai

   # Build Electron app
   yarn make

   # Launch the application
   yarn start
   ```

The application will run from the extracted folder, with no further installation required.
