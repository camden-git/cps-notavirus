from flask import Flask, jsonify, request
import sqlite3
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

LATEST_DATAFRAME = '2024-03-31'
total_records = None
cached_total_records = None

# Function to connect to the SQLite database
def connect_db():
    return sqlite3.connect('payroll.db')

def compute_and_cache_total_records():
    global cached_total_records
    if cached_total_records is None:
        print('computing total records...')
        start_time = time.time()
        conn = connect_db()
        cursor = conn.cursor()
        count_query = '''
            SELECT COUNT(*)
            FROM (
                SELECT DISTINCT p.name
                FROM payroll p
                JOIN (
                    SELECT name, MAX(date) AS max_date
                    FROM payroll
                    WHERE name IS NOT NULL AND name <> ''
                    GROUP BY name
                ) AS latest_records 
                    ON p.name = latest_records.name AND p.date = latest_records.max_date
            )
        '''
        cursor.execute(count_query)
        cached_total_records = cursor.fetchone()[0]
        conn.close()
        print(f'done, took {time.time() - start_time}s')

with app.app_context():
    compute_and_cache_total_records()

@app.route('/api/payroll', methods=['GET'])
def get_payroll():
    page = int(request.args.get('page', 1))
    per_page = 100
    offset = (page - 1) * per_page
    
    name_query = request.args.get('name', '')
    
    conn = connect_db()
    cursor = conn.cursor()
    
    params = []  # Initialize params as an empty list at the start

    if name_query:
        # Perform count query with search condition
        count_query = '''
            SELECT COUNT(*)
            FROM (
                SELECT DISTINCT p.name
                FROM payroll p
                JOIN (
                    SELECT name, MAX(date) AS max_date
                    FROM payroll
                    WHERE name IS NOT NULL AND name <> ''
                    GROUP BY name
                ) AS latest_records 
                    ON p.name = latest_records.name AND p.date = latest_records.max_date
                WHERE p.name IS NOT NULL AND p.name <> ''
                AND (
                    p.name LIKE ?
                    OR p.name LIKE ?
                )
            )
        '''
        # Split the name query into first and last names
        names = name_query.split()
        params = ['%' + ' '.join(names) + '%', '%' + ', '.join(reversed(names)) + '%']
        cursor.execute(count_query, params)
        total_records = cursor.fetchone()[0]
    else:
        # Use cached count when no search query is applied
        compute_and_cache_total_records()
        total_records = cached_total_records
    
    # Base query for fetching records
    base_query = '''
        SELECT 
            p.id,
            p.name,
            p.annualSalary,
            p.annualSalaryFTE,
            p.annualBenefit,
            p.date AS last_seen_date,
            p.ClsIndc,
            p.FTE,
            p.posNum,
            d.id AS dept_id,
            d.name AS department_name,
            j.id AS job_id,
            j.title AS job_title
        FROM payroll p
        JOIN (
            SELECT name, MAX(date) AS max_date
            FROM payroll
            WHERE name IS NOT NULL AND name <> ''
            GROUP BY name
        ) AS latest_records 
            ON p.name = latest_records.name AND p.date = latest_records.max_date
        JOIN departments d ON p.dept_id = d.id
        JOIN jobs j ON p.job_id = j.id
        WHERE p.name IS NOT NULL AND p.name <> ''
    '''
    
    if name_query:
        # Append search conditions to the base query
        base_query += ' AND (p.name LIKE ? OR p.name LIKE ?)'

    start_time = time.time()
    # Construct the final query for fetching paginated records
    final_query = f'{base_query} ORDER BY p.date DESC LIMIT ? OFFSET ?'
    params.extend([per_page, offset])
    
    cursor.execute(final_query, params)
    payroll_records = [dict(zip([column[0] for column in cursor.description], row)) for row in cursor.fetchall()]
    
    conn.close()
    
    fetch_query_time = time.time() - start_time

    max_page = (total_records + per_page - 1) // per_page
    
    return jsonify({
        'payrollRecords': payroll_records,
        'current_page': page,
        'max_page': max_page,
        'total_records': total_records,
        'latest_dataframe': LATEST_DATAFRAME,
        'name_query': name_query,
        'fetch_query_time': f'{fetch_query_time:.3f}',
    })



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
    conn.close()
    
    return {'total_records': total_records, 'max_page': (total_records // per_page + 1)}


if __name__ == '__main__':
    app.run(debug=True)
