from flask import Flask, render_template, request, jsonify
import json
from datetime import datetime
import os

app = Flask(__name__)

DATA_FILE = "budget_data.json"

def load_data():
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except:
        return []

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/')
def home():
    """Pagina principală simplă"""
    transactions = load_data()
    
    # Calculează sume
    income = sum(t['amount'] for t in transactions if t['type'] == 'income')
    expenses = sum(t['amount'] for t in transactions if t['type'] == 'expense')
    balance = income - expenses
    
    # Ultimele 10 tranzacții
    recent = transactions[-10:][::-1] if transactions else []
    
    return render_template('simple_index.html',
                         transactions=recent,
                         income=income,
                         expenses=expenses,
                         balance=balance,
                         total=len(transactions))

@app.route('/add', methods=['POST'])
def add():
    """Adaugă tranzacție"""
    try:
        amount = float(request.form['amount'])
        category = request.form['category']
        description = request.form['description']
        trans_type = request.form['type']
        
        new_transaction = {
            'amount': amount,
            'category': category,
            'description': description,
            'type': trans_type,
            'date': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        data = load_data()
        data.append(new_transaction)
        save_data(data)
        
        return jsonify({'success': True, 'message': 'Tranzacție adăugată!'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/transactions')
def transactions():
    """Toate tranzacțiile"""
    data = load_data()
    return render_template('simple_transactions.html', transactions=data[::-1])

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)