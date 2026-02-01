from flask import Flask, render_template, request, redirect
import json
from datetime import datetime
import os

app = Flask(__name__)

DATA_FILE = "budget_data.json"

def load_data():
    """Încarcă datele din JSON"""
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except:
        return []

def save_data(data):
    """Salvează datele în JSON"""
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/')
def home():
    """Pagina principală"""
    transactions = load_data()
    
    # Calculează sumele
    income = sum(t['amount'] for t in transactions if t['type'] == 'income')
    expenses = sum(t['amount'] for t in transactions if t['type'] == 'expense')
    balance = income - expenses
    
    # Ultimele 10 tranzacții (inversează pentru a avea cele mai noi întâi)
    recent = transactions[-10:][::-1] if transactions else []
    
    # Verifică dacă a fost adăugată cu succes o tranzacție
    success = request.args.get('success', '0') == '1'
    
    return render_template('index.html',
                         transactions=recent,
                         income=income,
                         expenses=expenses,
                         balance=balance,
                         total=len(transactions),
                         success=success)

@app.route('/add', methods=['POST'])
def add():
    """Adaugă o nouă tranzacție"""
    try:
        # Primește datele din formular
        amount = float(request.form['amount'])
        category = request.form['category']
        description = request.form['description']
        trans_type = request.form['type']
        
        # Creează noua tranzacție
        new_transaction = {
            'amount': amount,
            'category': category,
            'description': description,
            'type': trans_type,
            'date': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        # Adaugă și salvează
        data = load_data()
        data.append(new_transaction)
        save_data(data)
        
        # Redirecționează cu mesaj de succes
        return redirect('/?success=1')
        
    except Exception as e:
        # Dacă apare o eroare, redirecționează cu mesaj de eroare
        return redirect('/?error=1')

@app.route('/transactions')
def transactions():
    """Pagina cu toate tranzacțiile"""
    data = load_data()
    # Inversează ordinea pentru a afișa cele mai noi întâi
    data.reverse()
    return render_template('transactions.html', transactions=data)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)