// isbn_validator.js
class ISBNValidator {
    static validateISBN10(isbn) {
        // Elimină cratime și spații
        const cleanISBN = isbn.replace(/[-\s]/g, '').toUpperCase();
        
        if (cleanISBN.length !== 10) {
            return { isValid: false, error: 'Lungime invalidă (trebuie 10 caractere)' };
        }
        
        let total = 0;
        
        // Verifică primele 9 caractere (trebuie să fie cifre)
        for (let i = 0; i < 9; i++) {
            const char = cleanISBN.charAt(i);
            if (!this.isDigit(char)) {
                return { isValid: false, error: `Caracter invalid la poziția ${i + 1}` };
            }
            total += parseInt(char, 10) * (i + 1);
        }
        
        // Verifică ultimul caracter
        const lastChar = cleanISBN.charAt(9);
        let lastDigit;
        
        if (lastChar === 'X') {
            lastDigit = 10;
        } else if (this.isDigit(lastChar)) {
            lastDigit = parseInt(lastChar, 10);
        } else {
            return { isValid: false, error: 'Ultimul caracter invalid (trebuie cifră sau X)' };
        }
        
        total += lastDigit * 10;
        const isValid = total % 11 === 0;
        
        return {
            isValid,
            cleanFormat: this.formatISBN10(cleanISBN),
            checkDigit: lastChar,
            type: 'ISBN-10',
            error: isValid ? null : 'Suma de control nu este divizibilă cu 11'
        };
    }
    
    static validateISBN13(isbn) {
        const cleanISBN = isbn.replace(/[-\s]/g, '');
        
        if (cleanISBN.length !== 13) {
            return { isValid: false, error: 'Lungime invalidă (trebuie 13 caractere)' };
        }
        
        if (!/^\d+$/.test(cleanISBN)) {
            return { isValid: false, error: 'ISBN-13 trebuie să conțină doar cifre' };
        }
        
        let total = 0;
        const weights = [1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1];
        
        for (let i = 0; i < 13; i++) {
            const digit = parseInt(cleanISBN.charAt(i), 10);
            total += digit * weights[i];
        }
        
        const isValid = total % 10 === 0;
        
        return {
            isValid,
            cleanFormat: this.formatISBN13(cleanISBN),
            checkDigit: cleanISBN.charAt(12),
            type: 'ISBN-13',
            prefix: cleanISBN.substring(0, 3),
            error: isValid ? null : 'Suma de control nu este divizibilă cu 10'
        };
    }
    
    static validate(isbn) {
        const cleanISBN = isbn.replace(/[-\s]/g, '');
        
        if (cleanISBN.length === 10) {
            return this.validateISBN10(isbn);
        } else if (cleanISBN.length === 13) {
            return this.validateISBN13(isbn);
        } else {
            return {
                isValid: false,
                type: 'Necunoscut',
                error: `Lungime invalidă: ${cleanISBN.length} caractere (trebuie 10 sau 13)`
            };
        }
    }
    
    static generateISBN10CheckDigit(first9) {
        const clean = first9.replace(/[-\s]/g, '');
        
        if (clean.length !== 9) {
            throw new Error('Trebuie exact 9 cifre');
        }
        
        if (!/^\d+$/.test(clean)) {
            throw new Error('Toate caracterele trebuie să fie cifre');
        }
        
        let total = 0;
        for (let i = 0; i < 9; i++) {
            total += parseInt(clean.charAt(i), 10) * (i + 1);
        }
        
        const remainder = total % 11;
        const checkDigit = remainder === 10 ? 'X' : remainder.toString();
        
        const fullISBN = clean + checkDigit;
        
        return {
            checkDigit,
            fullISBN: this.formatISBN10(fullISBN),
            rawISBN: fullISBN
        };
    }
    
    static convertISBN10toISBN13(isbn10) {
        const cleanISBN10 = isbn10.replace(/[-\s]/g, '').toUpperCase();
        
        if (cleanISBN10.length !== 10) {
            throw new Error('ISBN-10 invalid: trebuie 10 caractere');
        }
        
        // Validăm ISBN-10 mai întâi
        const validation = this.validateISBN10(isbn10);
        if (!validation.isValid) {
            throw new Error('ISBN-10 invalid: ' + validation.error);
        }
        
        // Elimină cifra de control veche
        const base = '978' + cleanISBN10.substring(0, 9);
        
        // Calculează noua cifră de control
        let total = 0;
        for (let i = 0; i < 12; i++) {
            const digit = parseInt(base.charAt(i), 10);
            total += digit * (i % 2 === 0 ? 1 : 3);
        }
        
        const checkDigit = (10 - (total % 10)) % 10;
        const fullISBN13 = base + checkDigit;
        
        return {
            isbn13: this.formatISBN13(fullISBN13),
            rawISBN13: fullISBN13,
            checkDigit: checkDigit.toString(),
            prefix: '978',
            originalISBN10: this.formatISBN10(cleanISBN10)
        };
    }
    
    static formatISBN10(isbn) {
        const clean = isbn.replace(/[-\s]/g, '').toUpperCase();
        if (clean.length !== 10) return isbn;
        
        return `${clean.substring(0, 1)}-${clean.substring(1, 4)}-${clean.substring(4, 9)}-${clean.charAt(9)}`;
    }
    
    static formatISBN13(isbn) {
        const clean = isbn.replace(/[-\s]/g, '');
        if (clean.length !== 13) return isbn;
        
        return `${clean.substring(0, 3)}-${clean.substring(3, 4)}-${clean.substring(4, 9)}-${clean.substring(9, 12)}-${clean.charAt(12)}`;
    }
    
    static isDigit(char) {
        return /^\d$/.test(char);
    }
    
    static getSampleISBNs() {
        return {
            validISBN10: [
                '0-306-40615-2',
                '9992158107',
                '85-359-0277-5',
                '1-84356-028-3',
                '0-8044-2957-X'
            ],
            invalidISBN10: [
                '1234567890',
                '0-306-40615-3',
                '9992158108',
                '85-359-0277-6'
            ],
            validISBN13: [
                '978-0-306-40615-7',
                '9780136091813',
                '978-1-86197-876-9',
                '978-92-95055-02-5',
                '978-0-7432-7356-5'
            ],
            invalidISBN13: [
                '9781234567890',
                '978-0-306-40615-8',
                '9780136091814',
                '1234567890123'
            ]
        };
    }
    
    static getPrefixInfo(prefix) {
        const prefixMap = {
            '978': 'Bookland (English)',
            '979': 'Bookland (International)',
            '0': 'English',
            '1': 'English',
            '2': 'French',
            '3': 'German',
            '4': 'Japan',
            '5': 'Russian',
            '7': 'China',
            '80': 'Czech, Slovakia',
            '81': 'India',
            '82': 'Norway',
            '83': 'Poland',
            '84': 'Spain',
            '85': 'Brazil',
            '86': 'Serbia',
            '87': 'Denmark',
            '88': 'Italy',
            '89': 'South Korea',
            '90': 'Netherlands',
            '91': 'Sweden',
            '92': 'International',
            '93': 'India',
            '94': 'Netherlands',
            '95': 'Poland',
            '96': 'Turkey',
            '97': 'Brazil',
            '98': 'Iran',
            '99': 'Colombia'
        };
        
        return prefixMap[prefix] || 'Prefix necunoscut';
    }
}

// Export pentru Node.js sau browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ISBNValidator;
}