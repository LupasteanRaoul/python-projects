from flask import Flask, render_template, request, jsonify, redirect, url_for
from budget_tracker import BudgetTracker
import os

app = Flask(__name__)

# Initialize tracker
tracker = BudgetTracker()

@app.route('/')
def home():
    """Pagina principală"""
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

@app.route('/transactions')
def view_transactions():
    """Pagina cu toate tranzacțiile"""
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
