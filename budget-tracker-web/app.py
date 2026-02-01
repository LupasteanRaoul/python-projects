from flask import Flask, render_template, request, redirect
import json
from datetime import datetime
import os

app = Flask(__name__)

DATA_FILE = "budget_data.json"

def load_data():
    """Încarcă datele din fișier JSON"""
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Eroare la încărcare: {e}")
        return []

def save_data(data):
    """Salvează datele în fișier JSON"""
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

@app.route('/')
def home():
    """Pagina principală"""
    transactions = load_data()
    
    # Calculează sumele
    income = sum(t['amount'] for t in transactions if t['type'] == 'income')
    expenses = sum(t['amount'] for t in transactions if t['type'] == 'expense')
    balance = income - expenses
    
    # Ultimele 10 tranzacții (cele mai noi întâi)
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
def add_transaction():
    """Adaugă o nouă tranzacție"""
    try:
        # Primește datele din formular
        amount = float(request.form['amount'])
        category = request.form['category'].strip()
        description = request.form['description'].strip()
        trans_type = request.form['type']
        
        # Validare simplă
        if amount <= 0:
            return "Suma trebuie să fie pozitivă", 400
        
        if not category or not description:
            return "Categoria și descrierea sunt obligatorii", 400
        
        # Creează tranzacția
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
        return f"Eroare: {str(e)}", 400

@app.route('/transactions')
def view_transactions():
    """Pagina cu toate tranzacțiile"""
    data = load_data()
    # Inversează pentru a afișa cele mai noi întâi
    data.reverse()
    return render_template('transactions.html', transactions=data)

@app.route('/health')
def health_check():
    """Endpoint pentru verificarea sănătății"""
    return "OK", 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)