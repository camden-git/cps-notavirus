import pandas as pd

# Read Excel file skipping the first row
df = pd.read_excel('data/employeepositionroster_03312024.xls')

# Rename columns for convenience
df.columns = ['posNum', 'deptID', 'department', 'FTE', 'ClsIndc', 'annualSalary',
              'annualSalaryFTE', 'annualBenefit', 'jobCode', 'jobTitle', 'name']

df['name'] = df['name'].str.strip()

# Convert DataFrame to JSON
json_data = df.to_json(orient='records')

# Write JSON data to a file
with open('output.json', 'w') as json_file:
    json_file.write(json_data)

print("JSON data has been saved to 'output.json'")


# Create a DataFrame for unique departments and their IDs
departments_df = df[['deptID', 'department']].drop_duplicates().reset_index(drop=True)

# Convert departments DataFrame to JSON
departments_json = departments_df.to_json(orient='records')

# Write departments JSON data to a file
with open('departments.json', 'w') as departments_file:
    departments_file.write(departments_json)

# Create a DataFrame for unique job titles and their codes
jobs_df = df[['jobCode', 'jobTitle']].drop_duplicates().reset_index(drop=True)

# Convert jobs DataFrame to JSON
jobs_json = jobs_df.to_json(orient='records')

# Write jobs JSON data to a file
with open('jobs.json', 'w') as jobs_file:
    jobs_file.write(jobs_json)

print("Data has been saved to 'output.json', 'departments.json', and 'jobs.json'")
