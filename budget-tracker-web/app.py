from flask import Flask, render_template, request, jsonify, redirect
import json
from datetime import datetime
import os

app = Flask(__name__)

DATA_FILE = "budget_data.json"

def load_data():
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return []

def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

@app.route('/')
def home():
    """Pagina principală - folosește simple_index.html"""
    transactions = load_data()
    
    # Calculează statistici
    income = sum(t['amount'] for t in transactions if t['type'] == 'income')
    expenses = sum(t['amount'] for t in transactions if t['type'] == 'expense')
    balance = income - expenses
    
    # Ultimele 10 tranzacții (cele mai noi întâi)
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
        category = request.form['category'].strip()
        description = request.form['description'].strip()
        trans_type = request.form['type']
        
        if amount <= 0:
            return jsonify({'error': 'Suma trebuie să fie pozitivă'}), 400
            
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
        
        # Redirect cu mesaj de succes
        return redirect('/?success=1')
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/transactions')
def transactions():
    """Toate tranzacțiile - folosește simple_transactions.html"""
    data = load_data()
    data.reverse()  # cele mai noi întâi
    return render_template('simple_transactions.html', transactions=data)

@app.route('/api/health')
def health():
    """Endpoint pentru verificare sănătate"""
    return jsonify({'status': 'ok', 'message': 'Budget Tracker is running!'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)