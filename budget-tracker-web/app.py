from flask import Flask, render_template, request, jsonify, redirect, url_for
from budget_tracker import BudgetTracker
import os

app = Flask(__name__)

# Initialize tracker
tracker = BudgetTracker()

@app.route('/')
def home():
    """Pagina principală"""
    transactions = load_data()
    
    # Calculează statistici
    income = sum(t['amount'] for t in transactions if t['type'] == 'income')
    expenses = sum(t['amount'] for t in transactions if t['type'] == 'expense')
    balance = income - expenses
    
    # Ultimele 10 tranzacții (cele mai noi întâi)
    recent = transactions[-10:][::-1] if transactions else []
    
    # Sumar lunar (simplificat)
    from datetime import datetime
    current_month = datetime.now().month
    current_year = datetime.now().year
    
    monthly_transactions = [
        t for t in transactions 
        if datetime.strptime(t['date'], "%Y-%m-%d %H:%M:%S").month == current_month
        and datetime.strptime(t['date'], "%Y-%m-%d %H:%M:%S").year == current_year
    ]
    
    monthly_income = sum(t['amount'] for t in monthly_transactions if t['type'] == 'income')
    monthly_expenses = sum(t['amount'] for t in monthly_transactions if t['type'] == 'expense')
    monthly_balance = monthly_income - monthly_expenses
    
    monthly_summary = {
        'income': monthly_income,
        'expenses': monthly_expenses,
        'balance': monthly_balance,
        'transactions': len(monthly_transactions)
    }
    
    return render_template('index.html',
                         transactions=recent,
                         income=income,
                         expenses=expenses,
                         balance=balance,
                         total=len(transactions),
                         monthly_summary=monthly_summary)
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
