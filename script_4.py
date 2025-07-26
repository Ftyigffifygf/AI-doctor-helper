# Now create a ZIP file for the entire project directory
zip_filename = f"{project_name}.zip"

def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, os.path.join(path, '..'))
            ziph.write(file_path, arcname)

with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
    zipdir(project_name, zipf)

print(f"Created ZIP archive: {zip_filename}")