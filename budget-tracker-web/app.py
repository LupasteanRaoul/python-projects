<<<<<<< HEAD
from flask import Flask, render_template, request, redirect
import json
from datetime import datetime
=======
from flask import Flask, render_template, request, jsonify, redirect, url_for
from budget_tracker import BudgetTracker
>>>>>>> f62f3bdc657729335315a20c3b6d4cd90ba9425c
import os

app = Flask(__name__)

<<<<<<< HEAD
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
=======
# Initialize tracker
tracker = BudgetTracker()
>>>>>>> f62f3bdc657729335315a20c3b6d4cd90ba9425c

@app.route('/')
def home():
    """Pagina principală"""
<<<<<<< HEAD
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
=======
    stats = tracker.get_stats()
    recent_transactions = tracker.transactions[-10:] if tracker.transactions else []
    
    return render_template('index.html',
                         stats=stats,
                         transactions=recent_transactions,
                         categories=tracker.categories)

@app.route('/add-transaction', methods=['POST'])
def add_transaction():
    """Adaugă o nouă tranzacție"""
    try:
        amount = float(request.form['amount'])
        category = request.form['category']
        description = request.form['description']
        transaction_type = request.form['type']
        
        transaction = tracker.add_transaction(amount, category, description, transaction_type)
        
        return jsonify({
            'success': True,
            'message': 'Tranzacție adăugată!',
            'transaction': {
                'id': transaction.id,
                'amount': transaction.amount,
                'category': transaction.category,
                'description': transaction.description,
                'date': transaction.date,
                'type': transaction.type.value
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400
>>>>>>> f62f3bdc657729335315a20c3b6d4cd90ba9425c

@app.route('/transactions')
def view_transactions():
    """Pagina cu toate tranzacțiile"""
<<<<<<< HEAD
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
=======
    transactions = tracker.transactions
    return render_template('transactions.html', transactions=transactions)

@app.route('/api/delete/<transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    """Șterge o tranzacție"""
    if tracker.delete_transaction(transaction_id):
        return jsonify({'success': True})
    return jsonify({'error': 'Tranzacția nu există'}), 404

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
>>>>>>> f62f3bdc657729335315a20c3b6d4cd90ba9425c
