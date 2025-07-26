# Windows Deployment Command Cheat-Sheet for **AI-Doctor-Helper**

Below are copy-paste-ready PowerShell / CMD commands that take the current Expo + React-Native all the way to a signed, installable Windows package.  
Two alternative paths are shown:

* **A. React Native Windows (native UWP / WinAppSDK build)** – best runtime performance.  
* **B. Electron Forge (web bundle in desktop shell)** – fastest migration if you want to reuse the Expo build “as-is”.

## A. Native React Native Windows Build (MSIX)

### 1 – Prerequisites (one-time)

```powershell
# Install Node LTS & Chocolatey if missing, then:
choco install --yes visualstudio2022buildtools visualstudio2022-workload-vctools windows-sdk-10-dotnet

# Global CLI helpers
npm install -g yarn @react-native-community/cli
```

### 2 – Clone and install JS dependencies

```powershell
git clone https://github.com/Ftyigffifygf/AI-doctor-helper.git
cd AI-doctor-helper
yarn install
```

### 3 – Add Windows platform

```powershell
yarn add react-native-windows@latest
npx react-native-windows-init --overwrite --language cpp   # creates windows\*.sln [32][39]
```

### 4 – Debug run

```powershell
npx react-native run-windows    # launches Metro + UWP window [36]
```

### 5 – Release build & package

```powershell
# One-liner MSBuild – produces MSIX under AppPackages\*
msbuild windows\AI-doctor-helper.sln `
  /p:Configuration=Release `
  /p:Platform=x64 `
  /p:GenerateAppxPackageOnBuild=true `
  /p:AppxBundle=Never `
  /p:AppxPackageDir="$(pwd)\AppPackages\\"   # [40][43]
```

### 6 – Code-sign the package

```powershell
# Self-signed cert for dev / replace with CA-issued for prod
$cert = New-SelfSignedCertificate -Type CodeSigningCert `
        -Subject "CN=AI Doctor Helper" `
        -CertStoreLocation Cert:\CurrentUser\My

# Export PFX
$password = ConvertTo-SecureString "P@ssw0rd!" -AsPlainText -Force
Export-PfxCertificate -Cert $cert `
  -FilePath ".\aidochelper.pfx" `
  -Password $password

# Sign the MSIX
& "C:\Program Files (x86)\Windows Kits\10\bin\**\x64\signtool.exe" sign `
  /fd SHA256 /f aidochelper.pfx /p P@ssw0rd! `
  ".\AppPackages\AI-doctor-helper_1.0.0.0_x64.msix"        # [34][38][50]
```

### 7 – Install / sideload

```powershell
Add-AppxPackage ".\AppPackages\AI-doctor-helper_1.0.0.0_x64.msix"
```

You now have a fully native Windows build that can also be uploaded to the Microsoft Store after passing Store validation.

## B. Electron Forge Portable Folder (ZIP + EXE)

> Choose this when you want a quick desktop wrapper without refactoring any React-Native code.

### 1 – Add Electron toolchain

```powershell
yarn add -D @electron-forge/cli
yarn electron-forge import            # scaffolds forge config
```

Edit **forge.config.js** (or `package.json > config.forge`) to add a simple ZIP maker:

```js
module.exports = {
  makers: [
    { name: '@electron-forge/maker-squirrel', config: { name: 'ai_doctor_helper' } },
    { name: '@electron-forge/maker-zip', platforms: ['win32'] }   // portable folder
  ]
};
```

### 2 – Package & make

```powershell
yarn make --platform=win32 --arch=x64      # creates out\make\*.zip + *.exe [33][45][49]
```

### 3 – Sign the Squirrel EXE (optional)

```powershell
& "C:\Program Files (x86)\Windows Kits\10\bin\**\x64\signtool.exe" sign `
  /fd SHA256 /f aidochelper.pfx /p P@ssw0rd! `
  ".\out\make\squirrel.windows\x64\AI Doctor Helper Setup.exe"
```

### 4 – Distribute

* **Portable ZIP** – unzip anywhere, double-click *AI Doctor Helper.exe*  
* **Signed installer** – run the Setup.exe for per-user install  
* **Enterprise push** – deploy `.exe` or `.msix` via Intune / SCCM.

## One-Click Automation Script

Save as **deploy‐windows.ps1** at repo root:

```powershell
param(
  [ValidateSet("native","electron")]$mode = "native"
)

if ($mode -eq "native") {

  yarn install
  yarn add react-native-windows@latest
  npx react-native-windows-init --overwrite

  msbuild windows\AI-doctor-helper.sln `
          /p:Configuration=Release /p:Platform=x64 `
          /p:GenerateAppxPackageOnBuild=true `
          /p:AppxBundle=Never `
          /p:AppxPackageDir="$(pwd)\AppPackages\\"

  $pkg = Get-ChildItem .\AppPackages -Filter *.msix -Recurse | Select-Object -First 1
  & "$Env:ProgramFiles (x86)\Windows Kits\10\bin\*\x64\signtool.exe" sign /fd sha256 `
     /f aidochelper.pfx /p P@ssw0rd! $pkg.FullName
  Add-AppxPackage $pkg.FullName

} else {

  yarn install
  yarn electron-forge import
  yarn make --platform=win32 --arch=x64
  $exe = Get-ChildItem .\out\make -Filter *.exe -Recurse | Select-Object -First 1
  & "$Env:ProgramFiles (x86)\Windows Kits\10\bin\*\x64\signtool.exe" sign /fd sha256 `
     /f aidochelper.pfx /p P@ssw0rd! $exe.FullName
  Write-Host "Installer ready at $exe"
}
```

Run with:

```powershell
.\deploy-windows.ps1           # native default
.\deploy-windows.ps1 electron  # Electron bundle
```

### Key References

React Native Windows CLI & init-windows[1][2] -  Official getting-started guide[3]  
MSIX build flags & CI tips[4] -  Electron Forge ZIP maker[5] & packaging flow[6]  
SignTool usage and certificate notes[7][8]  

With these commands you can reproduce a deterministic, signed Windows build—whether you opt for full native performance or a rapid Electron shell—directly from the current **AI-doctor-helper** code-base.

