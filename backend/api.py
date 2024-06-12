from flask import Flask, jsonify, request
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Function to connect to the SQLite database
def connect_db():
    return sqlite3.connect('payroll.db')

@app.route('/api/payroll', methods=['GET'])
def get_payroll():
    page = int(request.args.get('page', 1))
    per_page = 10
    offset = (page - 1) * per_page
    
    conn = connect_db()
    cursor = conn.cursor()
    
    # construct the SQL query to get the latest record for each person
    # 
    # SELECT p.*, d.id AS dept_id, d.name AS department_name, j.id AS job_id, j.title AS job_title, last_seen.last_seen_date
    # - department id with alias 'dept_id'
    # - department name with alias 'department_name'
    # - job id with alias 'job_id'
    # - job title with alias 'job_title'
    # - select the last seen date from the subquery with alias 'last_seen_date'
    #
    # FROM payroll p
    # LEFT JOIN departments d ON p.dept_id = d.id
    # - join the departments table to get department details
    #
    # LEFT JOIN jobs j ON p.job_id = j.id
    # - join the jobs table to get job details
    #
    # LEFT JOIN (
    #   SELECT name, dept_id, job_id, MAX(date) as last_seen_date
    #   - select the name, department id, and job id to identify the person uniquely
    #   - select the maximum date (latest date) for each person
    #   FROM payroll
    #   GROUP BY name, dept_id, job_id
    #   - group by name, dept_id, and job_id to get the latest date for each person
    # ) last_seen ON p.name = last_seen.name AND p.dept_id = last_seen.dept_id AND p.job_id = last_seen.job_id
    # - join the subquery on name, dept_id, and job_id to get the latest record
    #
    # WHERE p.date = last_seen.last_seen_date
    # - filter to ensure only the latest records are selected
    
    sql_query = '''
    SELECT 
        p.*,  
        d.id AS dept_id,  
        d.name AS department_name,  
        j.id AS job_id,  
        j.title AS job_title,  
        last_seen.last_seen_date  
    FROM payroll p
    LEFT JOIN departments d ON p.dept_id = d.id  
    LEFT JOIN jobs j ON p.job_id = j.id  
    LEFT JOIN (
        SELECT 
            name,  
            dept_id,  
            job_id,  
            MAX(date) as last_seen_date  
        FROM payroll
        GROUP BY name, dept_id, job_id  
    ) last_seen ON p.name = last_seen.name AND p.dept_id = last_seen.dept_id AND p.job_id = last_seen.job_id  
    WHERE p.date = last_seen.last_seen_date  
    ORDER BY p.id ASC  
    LIMIT ? OFFSET ?  
    '''
    
    # Execute the SQL query
    cursor.execute(sql_query, (per_page, offset))
    
    # Fetch and format the results
    payroll_records = [dict(zip([column[0] for column in cursor.description], row)) for row in cursor.fetchall()]
    conn.close()
    
    pageInfo = max_page('payroll', per_page)
    print(pageInfo)
    return jsonify({'payrollRecords': payroll_records, 'current_page': page, 'max_page': pageInfo['max_page'], 'total_records': pageInfo['total_records']})




@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    page = int(request.args.get('page', 1))
    per_page = 100
    offset = (page - 1) * per_page
    
    conn = connect_db()
    cursor = conn.cursor()
    
    cursor.execute('''
    SELECT * FROM jobs
    LIMIT ? OFFSET ?
    ''', (per_page, offset))
    
    jobs = [dict(zip([column[0] for column in cursor.description], row)) for row in cursor.fetchall()]
    conn.close()
    
    pageInfo = max_page('jobs', per_page)
    return jsonify({'jobs': jobs, 'current_page': page, 'max_page': pageInfo['max_page'], 'total_records': pageInfo['total_records']})


@app.route('/api/departments', methods=['GET'])
def get_departments():
    page = int(request.args.get('page', 1))
    per_page = 100
    offset = (page - 1) * per_page
    
    conn = connect_db()
    cursor = conn.cursor()
    
    cursor.execute('''
    SELECT * FROM departments
    LIMIT ? OFFSET ?
    ''', (per_page, offset))
    
    departments = [dict(zip([column[0] for column in cursor.description], row)) for row in cursor.fetchall()]
    conn.close()
    
    pageInfo = max_page('departments', per_page)
    return jsonify({'departments': departments, 'current_page': page, 'max_page': pageInfo['max_page'], 'total_records': pageInfo['total_records']})


def max_page(table, per_page):
    conn = connect_db()
    cursor = conn.cursor()
    
    cursor.execute(f'SELECT COUNT(*) FROM {table}')
    total_records = cursor.fetchone()[0]
    print(total_records)
    conn.close()
    
    return {'total_records': total_records, 'max_page': (total_records // per_page + 1)}


if __name__ == '__main__':
    app.run(debug=True)
