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
    per_page = 100
    offset = (page - 1) * per_page
    
    conn = connect_db()
    cursor = conn.cursor()
    
    # Construct the SQL query
    sql_query = '''
    SELECT 
        p.*, 
        d.id AS dept_id, 
        d.name AS department_name, 
        j.id AS job_id, 
        j.title AS job_title
    FROM payroll p
    LEFT JOIN departments d ON p.dept_id = d.id
    LEFT JOIN jobs j ON p.job_id = j.id
    ORDER BY p.date DESC
    LIMIT ? OFFSET ?
    '''
    
    # Execute the SQL query
    cursor.execute(sql_query, (per_page, offset))
    
    # Fetch and format the results
    payroll_records = [dict(zip([column[0] for column in cursor.description], row)) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify({'payrollRecords': payroll_records, 'current_page': page, 'max_page': max_page('payroll', per_page)})




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
    
    return jsonify({'jobs': jobs, 'current_page': page, 'max_page': max_page('jobs', per_page)})


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
    
    return jsonify({'departments': departments, 'current_page': page, 'max_page': max_page('departments', per_page)})


def max_page(table, per_page):
    conn = connect_db()
    cursor = conn.cursor()
    
    cursor.execute(f'SELECT COUNT(*) FROM {table}')
    total_records = cursor.fetchone()[0]
    print(total_records)
    conn.close()
    
    return (total_records // per_page + 1)


if __name__ == '__main__':
    app.run(debug=True)
