import pandas as pd
import sqlite3

# read exel file
df = pd.read_excel('data/employeepositionroster_03312024.xls')
# MAKE SURE THIS IS CORRECT!!
IMPORT_DATE = '2024-03-31'


df.columns = ['posNum', 'deptID', 'department', 'FTE', 'ClsIndc', 'annualSalary',
              'annualSalaryFTE', 'annualBenefit', 'jobCode', 'jobTitle', 'name']

# clean up spaces
df['name'] = df['name'].str.strip()
df['deptID'] = df['deptID'].astype(str).str.strip()
df['jobCode'] = df['jobCode'].astype(str).str.strip()

conn = sqlite3.connect('payroll.db')
cursor = conn.cursor()

# create tables
# TODO: refactor this shit
cursor.execute('''
CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cpsID TEXT,
    name TEXT
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT,
    title TEXT
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS payroll (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    annualSalary REAL,
    annualSalaryFTE REAL,
    annualBenefit REAL,
    date DATE,
    ClsIndc TEXT,
    FTE REAL,
    posNum TEXT,
    dept_id INTEGER,
    job_id INTEGER,
    FOREIGN KEY(dept_id) REFERENCES departments(id),
    FOREIGN KEY(job_id) REFERENCES jobs(id)
)
''')

# insert unique departments iis DEFAULT '2024-03-31' needed if i have nto the departments table
departments_df = df[['deptID', 'department']].drop_duplicates().reset_index(drop=True)
departments_df.columns = ['cpsID', 'name']
departments_df.to_sql('departments', conn, if_exists='append', index=False)

# insert unique jobs into the jobs table
jobs_df = df[['jobCode', 'jobTitle']].drop_duplicates().reset_index(drop=True)
jobs_df.columns = ['code', 'title']
jobs_df.to_sql('jobs', conn, if_exists='append', index=False)

# get department and job IDs for foreign key references
dept_id_map = pd.read_sql('SELECT id, cpsID FROM departments', conn).set_index('cpsID')['id'].to_dict()
job_id_map = pd.read_sql('SELECT id, code FROM jobs', conn).set_index('code')['id'].to_dict()

print("department ID map:", dept_id_map)
print("job ID map:", job_id_map)

# map the foreign keys to the original dataframe
df['dept_id'] = df['deptID'].map(dept_id_map)
df['job_id'] = df['jobCode'].map(job_id_map)

print("mapped dept_id column:\n", df[['deptID', 'dept_id']].drop_duplicates())
print("mapped job_id column:\n", df[['jobCode', 'job_id']].drop_duplicates())

# select relevant columns for the payroll table and insert into database
payroll_df = df[['name', 'annualSalary', 'annualSalaryFTE', 'annualBenefit', 'ClsIndc', 'FTE', 'posNum', 'dept_id', 'job_id']]
payroll_df['date'] = IMPORT_DATE

payroll_df.to_sql('payroll', conn, if_exists='append', index=False)

# commit and close
conn.commit()
conn.close()
