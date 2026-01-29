# budget_tracker.py
import json
from datetime import datetime
from dataclasses import dataclass, asdict
from typing import List, Optional

@dataclass
class Transaction:
    amount: float
    category: str
    description: str
    date: str
    type: str  # 'income' or 'expense'

class BudgetTracker:
    def __init__(self, filename: str = "budget_data.json"):
        self.filename = filename
        self.transactions = self.load_data()
    
    def add_transaction(self, amount: float, category: str, 
                       description: str, type: str):
        """Adaugă o tranzacție nouă"""
        transaction = Transaction(
            amount=amount,
            category=category,
            description=description,
            date=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            type=type
        )
        self.transactions.append(transaction)
        self.save_data()
        print(f"✓ Tranzacție adăugată: {type} - {amount} lei")
    
    def get_balance(self) -> float:
        """Calculează balanța totală"""
        income = sum(t.amount for t in self.transactions if t.type == 'income')
        expenses = sum(t.amount for t in self.transactions if t.type == 'expense')
        return income - expenses
    
    def get_category_summary(self):
        """Sumar pe categorii"""
        summary = {}
        for t in self.transactions:
            if t.category not in summary:
                summary[t.category] = {'income': 0, 'expense': 0}
            summary[t.category][t.type] += t.amount
        return summary
    
    def save_data(self):
        """Salvează datele în JSON"""
        data = [asdict(t) for t in self.transactions]
        with open(self.filename, 'w') as f:
            json.dump(data, f, indent=2)
    
    def load_data(self) -> List[Transaction]:
        """Încarcă datele din JSON"""
        try:
            with open(self.filename, 'r') as f:
                data = json.load(f)
                return [Transaction(**item) for item in data]
        except FileNotFoundError:
            return []
    
    def display_summary(self):
        """Afișează un sumar"""
        balance = self.get_balance()
        print("\n" + "="*50)
        print("BUDGET TRACKER - SUMAR")
        print("="*50)
        print(f"Tranzacții totale: {len(self.transactions)}")
        print(f"Balanța curentă: {balance:.2f} lei")
        print(f"Sold: {'✅ Pozitiv' if balance >= 0 else '❌ Negativ'}")
        print("-"*50)
        
        summary = self.get_category_summary()
        for category, amounts in summary.items():
            print(f"\n{category}:")
            print(f"  Venituri: {amounts['income']:.2f} lei")
            print(f"  Cheltuieli: {amounts['expense']:.2f} lei")

# main.py pentru Budget Tracker
def budget_tracker_main():
    tracker = BudgetTracker()
    
    while True:
        print("\n📊 BUDGET TRACKER")
        print("1. Adaugă venit")
        print("2. Adaugă cheltuială")
        print("3. Vezi sumar")
        print("4. Ieșire")
        
        choice = input("Alege opțiunea: ")
        
        if choice == '1':
            amount = float(input("Suma venit: "))
            category = input("Categoria: ")
            description = input("Descriere: ")
            tracker.add_transaction(amount, category, description, 'income')
        
        elif choice == '2':
            amount = float(input("Suma cheltuială: "))
            category = input("Categoria: ")
            description = input("Descriere: ")
            tracker.add_transaction(amount, category, description, 'expense')
        
        elif choice == '3':
            tracker.display_summary()
        
        elif choice == '4':
            print("Datele au fost salvate. La revedere!")
            break

if __name__ == "__main__":
    budget_tracker_main()