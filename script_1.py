# Create package.json for the Electron app
package_json = {
    "name": "ai-doctor-helper-windows",
    "version": "1.0.0",
    "description": "AI-powered healthcare assistant with MONAI integration for Windows",
    "main": "src/main/index.js",
    "scripts": {
        "start": "electron .",
        "dev": "electron . --dev",
        "build": "electron-builder",
        "make": "electron-forge make",
        "package": "electron-forge package",
        "lint": "eslint src/",
        "test": "jest",
        "deploy": "powershell -ExecutionPolicy Bypass -File deployment/deploy.ps1",
        "setup-env": "powershell -ExecutionPolicy Bypass -File scripts/setup-environment.ps1",
        "finetune-models": "python scripts/finetune_all_models.py",
        "start-federated": "nvflare simulator flare_app -w workspace -n 2 -t fed_avg"
    },
    "keywords": ["healthcare", "ai", "medical", "monai", "electron", "windows"],
    "author": "Healthcare AI Team",
    "license": "MIT",
    "devDependencies": {
        "@electron-forge/cli": "^7.0.0",
        "@electron-forge/maker-squirrel": "^7.0.0",
        "@electron-forge/maker-zip": "^7.0.0",
        "@electron-forge/webpack": "^7.0.0",
        "electron": "^27.0.0",
        "electron-builder": "^24.6.4"
    },
    "dependencies": {
        "electron-store": "^8.1.0",
        "axios": "^1.5.0",
        "openai": "^4.0.0",
        "supabase": "^1.0.0",
        "@supabase/supabase-js": "^2.38.0",
        "crypto-js": "^4.1.1",
        "winston": "^3.10.0",
        "node-cron": "^3.0.2"
    },
    "build": {
        "appId": "com.healthcare.aidoctorhelper",
        "productName": "AI Doctor Helper",
        "directories": {
            "output": "dist"
        },
        "files": [
            "src/**/*",
            "node_modules/**/*"
        ],
        "win": {
            "target": "nsis",
            "icon": "assets/icon.ico"
        },
        "nsis": {
            "oneClick": false,
            "allowToChangeInstallationDirectory": true
        }
    }
}

# Write package.json
with open(f"{project_name}/package.json", "w") as f:
    json.dump(package_json, f, indent=2)

print("Created package.json with complete Electron configuration")