import json
import os
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional, Tuple
from enum import Enum
import csv
from decimal import Decimal, ROUND_HALF_UP

class TransactionType(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"

@dataclass
class Transaction:
    id: str
    amount: float
    category: str
    description: str
    date: str
    type: TransactionType
    
    def __post_init__(self):
        # Convert amount to Decimal for precise calculations
        if not isinstance(self.amount, (Decimal, float)):
            self.amount = float(self.amount)

class BudgetTracker:
    def __init__(self, filename: str = "budget_data.json"):
        self.filename = filename
        self.transactions = self.load_data()
        self.categories = self._load_categories()
    
    def _generate_id(self) -> str:
        """Generate unique ID for transaction"""
        return datetime.now().strftime("%Y%m%d%H%M%S%f")
    
    def add_transaction(self, amount: float, category: str, 
                       description: str, type: str, date: Optional[str] = None) -> Transaction:
        """Adaugă o tranzacție nouă cu validare"""
        try:
            amount = float(amount)
            if amount <= 0:
                raise ValueError("Suma trebuie să fie pozitivă")
            
            transaction_type = TransactionType(type)
            
            transaction = Transaction(
                id=self._generate_id(),
                amount=amount,
                category=category.strip(),
                description=description.strip(),
                date=date or datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                type=transaction_type
            )
            
            self.transactions.append(transaction)
            self.save_data()
            return transaction
            
        except ValueError as e:
            raise ValueError(f"Eroare la adăugarea tranzacției: {str(e)}")
    
    def get_balance(self) -> float:
        """Calculează balanța totală"""
        income = sum(t.amount for t in self.transactions if t.type == TransactionType.INCOME)
        expenses = sum(t.amount for t in self.transactions if t.type == TransactionType.EXPENSE)
        return float(Decimal(str(income - expenses)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))
    
    def get_monthly_summary(self, year: Optional[int] = None, month: Optional[int] = None) -> Dict:
        """Sumar pentru o luna specifica"""
        if not year or not month:
            now = datetime.now()
            year, month = now.year, now.month
        
        monthly_transactions = [
            t for t in self.transactions 
            if datetime.strptime(t.date, "%Y-%m-%d %H:%M:%S").year == year
            and datetime.strptime(t.date, "%Y-%m-%d %H:%M:%S").month == month
        ]
        
        income = sum(t.amount for t in monthly_transactions if t.type == TransactionType.INCOME)
        expenses = sum(t.amount for t in monthly_transactions if t.type == TransactionType.EXPENSE)
        balance = income - expenses
        
        return {
            'income': float(income),
            'expenses': float(expenses),
            'balance': float(balance),
            'transactions': len(monthly_transactions)
        }
    
    def get_category_summary(self, period: str = 'all') -> Dict:
        """Sumar pe categorii cu opțiuni de perioadă"""
        now = datetime.now()
        
        if period == 'month':
            filtered = [
                t for t in self.transactions 
                if datetime.strptime(t.date, "%Y-%m-%d %H:%M:%S").month == now.month
                and datetime.strptime(t.date, "%Y-%m-%d %H:%M:%S").year == now.year
            ]
        elif period == 'week':
            week_ago = now - timedelta(days=7)
            filtered = [
                t for t in self.transactions 
                if datetime.strptime(t.date, "%Y-%m-%d %H:%M:%S") >= week_ago
            ]
        else:
            filtered = self.transactions
        
        summary = {}
        for t in filtered:
            if t.category not in summary:
                summary[t.category] = {'income': Decimal('0'), 'expense': Decimal('0')}
            summary[t.category][t.type.value] += Decimal(str(t.amount))
        
        # Convert back to float for JSON serialization
        for cat in summary:
            summary[cat]['income'] = float(summary[cat]['income'])
            summary[cat]['expense'] = float(summary[cat]['expense'])
        
        return summary
    
    def get_transactions_by_date(self, start_date: str, end_date: str) -> List[Transaction]:
        """Filtrează tranzacții după interval de date"""
        try:
            start = datetime.strptime(start_date, "%Y-%m-%d")
            end = datetime.strptime(end_date, "%Y-%m-%d")
            
            filtered = []
            for t in self.transactions:
                t_date = datetime.strptime(t.date.split()[0], "%Y-%m-%d")
                if start <= t_date <= end:
                    filtered.append(t)
            
            return filtered
        except ValueError:
            return []
    
    def delete_transaction(self, transaction_id: str) -> bool:
        """Șterge o tranzacție după ID"""
        initial_count = len(self.transactions)
        self.transactions = [t for t in self.transactions if t.id != transaction_id]
        
        if len(self.transactions) < initial_count:
            self.save_data()
            return True
        return False
    
    def edit_transaction(self, transaction_id: str, **kwargs) -> Optional[Transaction]:
        """Modifică o tranzacție existentă"""
        for i, t in enumerate(self.transactions):
            if t.id == transaction_id:
                for key, value in kwargs.items():
                    if key in ['amount', 'category', 'description', 'date', 'type']:
                        setattr(self.transactions[i], key, value)
                self.save_data()
                return self.transactions[i]
        return None
    
    def export_to_csv(self, filename: str = "budget_export.csv"):
        """Exportă tranzacțiile în format CSV"""
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['ID', 'Data', 'Tip', 'Categorie', 'Descriere', 'Suma'])
            
            for t in self.transactions:
                writer.writerow([
                    t.id,
                    t.date,
                    'Venit' if t.type == TransactionType.INCOME else 'Cheltuială',
                    t.category,
                    t.description,
                    f"{t.amount:.2f}"
                ])
    
    def save_data(self):
        """Salvează datele în JSON"""
        data = [asdict(t) for t in self.transactions]
        # Convert TransactionType to string
        for item in data:
            item['type'] = item['type'].value
        
        with open(self.filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    def load_data(self) -> List[Transaction]:
        """Încarcă datele din JSON"""
        try:
            if os.path.exists(self.filename):
                with open(self.filename, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    transactions = []
                    for item in data:
                        # Handle old format without ID
                        if 'id' not in item:
                            item['id'] = self._generate_id()
                        item['type'] = TransactionType(item['type'])
                        transactions.append(Transaction(**item))
                    return transactions
            return []
        except (json.JSONDecodeError, KeyError) as e:
            print(f"Eroare la încărcarea datelor: {e}")
            return []
    
    def _load_categories(self) -> Dict[str, List[str]]:
        """Încarcă categorii predefinite"""
        return {
            'income': ['Salariu', 'Freelance', 'Investiții', 'Cadouri', 'Altele'],
            'expense': ['Mâncare', 'Transport', 'Încălzire', 'Întreținere', 
                       'Divertisment', 'Îmbrăcăminte', 'Sănătate', 'Educație', 'Altele']
        }
    
    def get_stats(self) -> Dict:
        """Returnează statistici generale"""
        total_income = sum(t.amount for t in self.transactions if t.type == TransactionType.INCOME)
        total_expenses = sum(t.amount for t in self.transactions if t.type == TransactionType.EXPENSE)
        balance = total_income - total_expenses
        
        # Cel mai mare venit/cheltuială
        incomes = [t for t in self.transactions if t.type == TransactionType.INCOME]
        expenses = [t for t in self.transactions if t.type == TransactionType.EXPENSE]
        
        return {
            'total_transactions': len(self.transactions),
            'total_income': float(total_income),
            'total_expenses': float(total_expenses),
            'balance': float(balance),
            'avg_income': float(total_income / max(len(incomes), 1)),
            'avg_expense': float(total_expenses / max(len(expenses), 1)),
            'largest_income': max((t.amount for t in incomes), default=0),
            'largest_expense': max((t.amount for t in expenses), default=0),
        }