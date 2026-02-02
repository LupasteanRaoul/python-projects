from flask import Flask, render_template, request, jsonify, redirect, url_for
import json
import os
from datetime import datetime

app = Flask(__name__)

DATA_FILE = 'budget_data.json'

def init_data():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w') as f:
            json.dump({
                'transactions': [],
                'next_id': 1
            }, f)

def load_data():
    init_data()
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/')
def index():
    data = load_data()
    transactions = data['transactions'][-10:]
    total = len(data['transactions'])
    
    income = sum(t['amount'] for t in data['transactions'] if t['type'] == 'income')
    expenses = sum(t['amount'] for t in data['transactions'] if t['type'] == 'expense')
    balance = income - expenses
    
    return render_template('index.html',
                           balancie=balance,
                           incomerii=income,
                           expenses=expenses,
                           total=total,
                           transactions=transactions)

@app.route('/add', methods=['POST'])
def add_transaction():
    data = load_data()
    
    transaction = {
        'id': data['next_id'],
        'type': request.form['type'],
        'amount': float(request.form['amount']),
        'category': request.form['category'],
        'description': request.form.get('description', ''),
        'date': datetime.now().isoformat()
    }
    
    data['transactions'].append(transaction)
    data['next_id'] += 1
    save_data(data)
    
    return redirect(url_for('index'))

@app.route('/api/transactions')
def api_transactions():
    data = load_data()
    return jsonify(data['transactions'])

@app.route('/api/delete/<int:tx_id>', methods=['POST'])
def delete_transaction(tx_id):
    data = load_data()
    data['transactions'] = [t for t in data['transactions'] if t['id'] != tx_id]
    save_data(data)
    return jsonify({'success': True})

if __name__ == '__main__':
    init_data()
    app.run(debug=True, port=5000)
