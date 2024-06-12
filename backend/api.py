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
    
    name_query = request.args.get('name', '')
    
    conn = connect_db()
    cursor = conn.cursor()
    
    # LEFT JOIN (
    #   SELECT name, MAX(date) as last_seen_date
    #   - select the name to identify the person uniquely
    #   - select the maximum date (latest date) for each person
    #   FROM payroll
    #   GROUP BY name
    #   - group by name to get the latest date for each person
    # ) last_seen ON p.name = last_seen.name
    # - join the subquery on name to get the latest record
    #
    # WHERE p.date = last_seen.last_seen_date
    # - filter to ensure only the latest records are selected
    #
    # AND p.name LIKE ?
    # - add a fuzzy search condition on the name column if a name query is provided
    
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
            MAX(date) as last_seen_date  
        FROM payroll
        GROUP BY name  
    ) last_seen ON p.name = last_seen.name  
    WHERE p.date = last_seen.last_seen_date
    '''
    
    params = []
    if name_query:
        sql_query += ' AND p.name LIKE ?'
        params.append('%' + name_query + '%')
    
    sql_query += ' ORDER BY p.date DESC LIMIT ? OFFSET ?'
    params.extend([per_page, offset])
    
    cursor.execute(sql_query, params)
    
    payroll_records = [dict(zip([column[0] for column in cursor.description], row)) for row in cursor.fetchall()]
    conn.close()
    
    pageInfo = max_page('payroll', per_page)
    
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
