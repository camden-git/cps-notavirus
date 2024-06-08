import os
import re
import shutil

def rename_files(folder_path):
    for filename in os.listdir(folder_path):
        if filename.startswith('employeepositionroster'):
            # Extract date from filename
            match = re.search(r'_(\d{8})\.', filename)
            if match:
                date_str = match.group(1)
                new_filename = f"{date_str[4:]}-{date_str[0:2]}-{date_str[2:4]}.xls"
                old_file_path = os.path.join(folder_path, filename)
                new_file_path = os.path.join(folder_path, new_filename)
                shutil.move(old_file_path, new_file_path)
                print(f"Renamed {filename} to {new_filename}")
            else:
                print(f"Skipping {filename} - Date not found in filename")
                new_filename = input("Enter the new filename: ")
                if new_filename:
                    old_file_path = os.path.join(folder_path, filename)
                    new_file_path = os.path.join(folder_path, new_filename)
                    shutil.move(old_file_path, new_file_path)
                    print(f"Renamed {filename} to {new_filename}")
                else:
                    print(f"Skipping renaming of {filename}")


folder_path = "data"
rename_files(folder_path)
