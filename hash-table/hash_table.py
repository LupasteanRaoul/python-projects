# hash_table.py
class HashTable:
    def __init__(self, size: int = 10):
        self.size = size
        self.table = [[] for _ in range(size)]
        self.count = 0
    
    def _hash(self, key: str) -> int:
        """Funcție hash simplă"""
        return sum(ord(c) for c in key) % self.size
    
    def insert(self, key: str, value):
        """Inserează o pereche cheie-valoare"""
        index = self._hash(key)
        
        # Verifică dacă cheia există deja
        for i, (k, v) in enumerate(self.table[index]):
            if k == key:
                self.table[index][i] = (key, value)
                return
        
        # Inserare nouă
        self.table[index].append((key, value))
        self.count += 1
        
        # Rehash dacă factorul de încărcare > 0.7
        if self.load_factor() > 0.7:
            self._rehash()
    
    def get(self, key: str):
        """Returnează valoarea pentru o cheie"""
        index = self._hash(key)
        for k, v in self.table[index]:
            if k == key:
                return v
        raise KeyError(f"Cheia '{key}' nu există")
    
    def remove(self, key: str):
        """Șterge o cheie"""
        index = self._hash(key)
        for i, (k, v) in enumerate(self.table[index]):
            if k == key:
                del self.table[index][i]
                self.count -= 1
                return True
        return False
    
    def load_factor(self) -> float:
        """Calculează factorul de încărcare"""
        return self.count / self.size
    
    def _rehash(self):
        """Rehash tabela când devine prea plină"""
        old_table = self.table
        self.size *= 2
        self.table = [[] for _ in range(self.size)]
        self.count = 0
        
        for bucket in old_table:
            for key, value in bucket:
                self.insert(key, value)
    
    def display(self):
        """Afișează tabela hash"""
        print("\n" + "="*40)
        print("HASH TABLE STRUCTURE")
        print("="*40)
        for i, bucket in enumerate(self.table):
            print(f"[{i}]: {bucket}")
        print(f"\nElemente totale: {self.count}")
        print(f"Factor încărcare: {self.load_factor():.2f}")

# Exemplu de utilizare
def hash_table_demo():
    ht = HashTable(size=5)
    
    # Testare operații
    test_data = [
        ("nume", "Ion"),
        ("varsta", 25),
        ("oras", "București"),
        ("ocupatie", "developer"),
        ("salariu", 5000),
        ("hobby", "programare"),
        ("email", "ion@example.com")
    ]
    
    for key, value in test_data:
        ht.insert(key, value)
        print(f"Insert: {key} -> {value}")
    
    ht.display()
    
    # Testare get
    print(f"\nCăutare 'nume': {ht.get('nume')}")
    print(f"Căutare 'oras': {ht.get('oras')}")
    
    # Testare remove
    ht.remove("hobby")
    print("\nDupă ștergerea 'hobby':")
    ht.display()

if __name__ == "__main__":
    hash_table_demo()