# isbn_validator.py
class ISBNValidator:
    @staticmethod
    def validate_isbn10(isbn: str) -> bool:
        """Validează ISBN-10"""
        # Elimină cratime și spații
        isbn = isbn.replace("-", "").replace(" ", "").upper()
        
        if len(isbn) != 10:
            return False
        
        total = 0
        for i, char in enumerate(isbn[:-1], start=1):
            if not char.isdigit():
                return False
            total += int(char) * i
        
        # Verifică ultimul caracter (poate fi X pentru 10)
        last_char = isbn[-1]
        if last_char == 'X':
            total += 10 * 10
        elif last_char.isdigit():
            total += int(last_char) * 10
        else:
            return False
        
        return total % 11 == 0
    
    @staticmethod
    def validate_isbn13(isbn: str) -> bool:
        """Validează ISBN-13"""
        isbn = isbn.replace("-", "").replace(" ", "")
        
        if len(isbn) != 13 or not isbn.isdigit():
            return False
        
        total = 0
        for i, digit in enumerate(isbn):
            num = int(digit)
            # Alternare între 1 și 3
            multiplier = 1 if i % 2 == 0 else 3
            total += num * multiplier
        
        return total % 10 == 0
    
    @staticmethod
    def validate(isbn: str) -> tuple:
        """Determină tipul ISBN și validează"""
        clean_isbn = isbn.replace("-", "").replace(" ", "")
        
        if len(clean_isbn) == 10:
            is_valid = ISBNValidator.validate_isbn10(isbn)
            return ("ISBN-10", is_valid)
        elif len(clean_isbn) == 13:
            is_valid = ISBNValidator.validate_isbn13(isbn)
            return ("ISBN-13", is_valid)
        else:
            return ("Invalid Length", False)
    
    @staticmethod
    def generate_isbn10_check_digit(first_9: str) -> str:
        """Generează cifra de control pentru ISBN-10"""
        if len(first_9) != 9 or not first_9.isdigit():
            raise ValueError("Primele 9 cifre trebuie să fie numere")
        
        total = sum(int(digit) * (i + 1) for i, digit in enumerate(first_9))
        remainder = total % 11
        
        return 'X' if remainder == 10 else str(remainder)
    
    @staticmethod
    def convert_isbn10_to_isbn13(isbn10: str) -> str:
        """Convertește ISBN-10 la ISBN-13"""
        clean = isbn10.replace("-", "").replace(" ", "").upper()
        if len(clean) != 10:
            raise ValueError("ISBN-10 invalid")
        
        # Adaugă prefixul 978
        isbn13 = "978" + clean[:-1]
        
        # Calculează cifra de control pentru ISBN-13
        total = 0
        for i, digit in enumerate(isbn13):
            num = int(digit)
            multiplier = 1 if i % 2 == 0 else 3
            total += num * multiplier
        
        check_digit = (10 - (total % 10)) % 10
        return isbn13 + str(check_digit)

# Interfață pentru utilizator
def isbn_validator_main():
    validator = ISBNValidator()
    
    while True:
        print("\n" + "="*50)
        print("ISBN VALIDATOR")
        print("="*50)
        print("1. Validează ISBN")
        print("2. Generează cifră de control ISBN-10")
        print("3. Convertește ISBN-10 la ISBN-13")
        print("4. Teste predefinite")
        print("5. Ieșire")
        
        choice = input("\nAlege opțiunea: ")
        
        if choice == '1':
            isbn = input("Introdu ISBN: ")
            isbn_type, is_valid = validator.validate(isbn)
            status = "✅ VALID" if is_valid else "❌ INVALID"
            print(f"\nTip: {isbn_type}")
            print(f"Status: {status}")
            
        elif choice == '2':
            first_9 = input("Primele 9 cifre: ")
            try:
                check_digit = validator.generate_isbn10_check_digit(first_9)
                print(f"ISBN complet: {first_9}{check_digit}")
            except ValueError as e:
                print(f"Eroare: {e}")
        
        elif choice == '3':
            isbn10 = input("ISBN-10: ")
            try:
                isbn13 = validator.convert_isbn10_to_isbn13(isbn10)
                print(f"ISBN-13: {isbn13}")
            except ValueError as e:
                print(f"Eroare: {e}")
        
        elif choice == '4':
            # Teste cu ISBN-uri cunoscute
            test_cases = [
                "0-306-40615-2",      # ISBN-10 valid
                "9992158107",         # ISBN-10 valid
                "978-0-306-40615-7",  # ISBN-13 valid
                "9780136091813",      # ISBN-13 valid
                "1234567890",         # ISBN-10 invalid
                "9781234567890"       # ISBN-13 invalid
            ]
            
            print("\nTeste automate:")
            for isbn in test_cases:
                isbn_type, is_valid = validator.validate(isbn)
                status = "VALID" if is_valid else "INVALID"
                print(f"{isbn:20} -> {isbn_type:10} {status}")
        
        elif choice == '5':
            break

if __name__ == "__main__":
    isbn_validator_main()