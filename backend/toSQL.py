import pandas as pd
import sqlite3
import os

conn = sqlite3.connect('payroll.db')
cursor = conn.cursor()

# migrations lol
cursor.execute('''
CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cpsID TEXT,
    name TEXT,
    UNIQUE(cpsID, name) ON CONFLICT IGNORE
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT,
    title TEXT,
    UNIQUE(code, title) ON CONFLICT IGNORE
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

cursor.execute('CREATE INDEX idx_payroll_name ON payroll(name);')
cursor.execute('CREATE INDEX idx_payroll_date ON payroll(date);')
cursor.execute('CREATE INDEX idx_payroll_dept_id ON payroll(dept_id);')
cursor.execute('CREATE INDEX idx_payroll_job_id ON payroll(job_id);')
cursor.execute('CREATE INDEX idx_payroll_name_date ON payroll(name, date);') 

conn.commit()

for file_name in os.listdir('data'):
    if file_name.endswith('.xls'):
        file_path = os.path.join('data', file_name)
        import_date = file_name.replace('.xls', '')  # rxtract date from filename
        
        # read Excel file
        df = pd.read_excel(file_path, skiprows=1)
        
        # handle columns based on import date
        if import_date <= '2015-12-31':
            # rename columns and adjust offset for files at or before 2015-12-31
            df.columns = ['posNum', 'deptID', 'department', 'FTE', 'annualSalary',
                          'annualSalaryFTE', 'annualBenefit', 'jobCode', 'jobTitle', 'name']
            df['ClsIndc'] = 'DATA_UNKNOWN'  # set 'ClsIndc' to 'DATA_UNKNOWN' for older files
        else:
            # rename columns for convenience
            df.columns = ['posNum', 'deptID', 'department', 'FTE', 'ClsIndc', 'annualSalary',
                          'annualSalaryFTE', 'annualBenefit', 'jobCode', 'jobTitle', 'name']
        
        # clean up spaces
        df['name'] = df['name'].str.strip()
        df['deptID'] = df['deptID'].astype(str).str.strip()
        df['jobCode'] = df['jobCode'].astype(str).str.strip()
        
        # fill missing values with empty strings or -1 for money-related columns
        money_columns = ['annualSalary', 'annualSalaryFTE', 'annualBenefit']
        df[money_columns] = df[money_columns].fillna(-1)
        df = df.fillna('')
        
        # insert unique departments into the departments table
        departments_df = df[['deptID', 'department']].drop_duplicates().reset_index(drop=True)
        departments_df.columns = ['cpsID', 'name']
        departments_df.to_sql('temp_departments', conn, if_exists='replace', index=False)

        cursor.execute('''
        INSERT OR IGNORE INTO departments (cpsID, name)
        SELECT cpsID, name FROM temp_departments
        ''')

        # insert unique jobs into the jobs table
        jobs_df = df[['jobCode', 'jobTitle']].drop_duplicates().reset_index(drop=True)
        jobs_df.columns = ['code', 'title']
        jobs_df.to_sql('temp_jobs', conn, if_exists='replace', index=False)

        cursor.execute('''
        INSERT OR IGNORE INTO jobs (code, title)
        SELECT code, title FROM temp_jobs
        ''')

        # retrieve department and job IDs for foreign key references
        dept_id_map = pd.read_sql('SELECT id, cpsID FROM departments', conn).set_index('cpsID')['id'].to_dict()
        job_id_map = pd.read_sql('SELECT id, code FROM jobs', conn).set_index('code')['id'].to_dict()

        # map the foreign keys to the original dataframe
        df['dept_id'] = df['deptID'].map(dept_id_map)
        df['job_id'] = df['jobCode'].map(job_id_map)

        # select relevant columns for the payroll table and insert into database
        payroll_df = df[['name', 'annualSalary', 'annualSalaryFTE', 'annualBenefit', 'ClsIndc', 'FTE', 'posNum', 'dept_id', 'job_id']]
        payroll_df['date'] = import_date

        payroll_df.to_sql('payroll', conn, if_exists='append', index=False)

# commit changes and close the connection
conn.commit()
conn.close()
