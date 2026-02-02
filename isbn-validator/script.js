// script.js - Logica aplicației ISBN Validator

let history = JSON.parse(localStorage.getItem('isbnHistory')) || [];

// Inițializare aplicație
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    loadSampleData();
    updateHistoryDisplay();
});

function initApp() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            switchTab(tabId);
        });
    });

    // Butoane principale
    document.getElementById('validate-btn').addEventListener('click', validateISBN);
    document.getElementById('generate-btn').addEventListener('click', generateCheckDigit);
    document.getElementById('convert-btn').addEventListener('click', convertISBN);
    document.getElementById('run-all-tests').addEventListener('click', runAllTests);
    document.getElementById('scan-btn').addEventListener('click', simulateScan);
    document.getElementById('copy-isbn').addEventListener('click', copyGeneratedISBN);
    document.getElementById('clear-history').addEventListener('click', clearHistory);

    // Enter key support
    document.getElementById('isbn-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') validateISBN();
    });

    document.getElementById('first-nine-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') generateCheckDigit();
    });

    document.getElementById('convert-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') convertISBN();
    });

    // Modal
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('modal')) {
            closeModal();
        }
    });

    // Toastr config
    toastr.options = {
        positionClass: 'toast-top-right',
        progressBar: true,
        timeOut: 3000,
        extendedTimeOut: 1000
    };
}

function switchTab(tabId) {
    // Update butoane tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

    // Update conținut tab
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabId}-tab`).classList.add('active');

    // Scroll la început
    document.querySelector('.content-area').scrollTop = 0;
}

// Funcția principală de validare
function validateISBN() {
    const isbnInput = document.getElementById('isbn-input');
    const isbn = isbnInput.value.trim();

    if (!isbn) {
        showError('Introduceți un cod ISBN pentru validare');
        return;
    }

    const result = ISBNValidator.validate(isbn);

    // Update UI
    document.getElementById('isbn-type').textContent = result.type;
    document.getElementById('clean-format').textContent = result.cleanFormat || '-';
    document.getElementById('check-digit').textContent = result.checkDigit || '-';
    document.getElementById('prefix-info').textContent = result.prefix ? 
        `${result.prefix} (${ISBNValidator.getPrefixInfo(result.prefix)})` : '-';
    document.getElementById('domain-info').textContent = result.prefix ? 
        getDomainInfo(result.prefix) : '-';

    const statusElement = document.getElementById('validation-status');
    statusElement.textContent = result.isValid ? 'VALID' : 'INVALID';
    statusElement.className = 'status ' + (result.isValid ? 'valid' : 'invalid');

    const errorElement = document.getElementById('error-message');
    if (result.error) {
        document.getElementById('error-text').textContent = result.error;
        errorElement.classList.remove('hidden');
    } else {
        errorElement.classList.add('hidden');
    }

    // Adaugă în istoric
    addToHistory(isbn, result);

    // Toast notification
    if (result.isValid) {
        toastr.success(`ISBN ${result.type} valid!`, 'Succes');
    } else {
        toastr.error(`ISBN invalid: ${result.error}`, 'Eroare');
    }
}

function generateCheckDigit() {
    const input = document.getElementById('first-nine-input');
    const firstNine = input.value.trim();

    try {
        const result = ISBNValidator.generateISBN10CheckDigit(firstNine);

        // Update UI
        document.getElementById('display-first-nine').textContent = firstNine;
        document.getElementById('display-check-digit').textContent = result.checkDigit;
        document.getElementById('display-check-digit').classList.add('highlight');
        
        const fullISBN = result.fullISBN;
        document.getElementById('display-full-isbn').textContent = fullISBN;
        document.getElementById('display-full-isbn').classList.add('highlight');

        // Animație
        setTimeout(() => {
            document.getElementById('display-check-digit').classList.remove('highlight');
            document.getElementById('display-full-isbn').classList.remove('highlight');
        }, 500);

        toastr.success(`Cifra de control generată: ${result.checkDigit}`, 'Succes');

    } catch (error) {
        toastr.error(error.message, 'Eroare');
    }
}

function convertISBN() {
    const input = document.getElementById('convert-input');
    const isbn10 = input.value.trim();

    try {
        const result = ISBNValidator.convertISBN10toISBN13(isbn10);

        // Update UI
        document.getElementById('original-isbn-display').textContent = result.originalISBN10;
        document.getElementById('converted-isbn-display').textContent = result.isbn13;
        document.getElementById('conversion-prefix').textContent = result.prefix;
        document.getElementById('conversion-check-digit').textContent = result.checkDigit;

        // Animație
        document.getElementById('converted-isbn-display').classList.add('highlight');
        setTimeout(() => {
            document.getElementById('converted-isbn-display').classList.remove('highlight');
        }, 500);

        toastr.success(`Convertit cu succes la ISBN-13`, 'Succes');

    } catch (error) {
        toastr.error(error.message, 'Eroare de conversie');
    }
}

function loadSampleData() {
    const samples = ISBNValidator.getSampleISBNs();
    
    // ISBN-10 Valide
    const valid10List = document.getElementById('valid-isbn10-list');
    valid10List.innerHTML = samples.validISBN10.map(isbn => `
        <div class="sample-item valid" onclick="testSample('${isbn}')">
            <div class="sample-isbn">${isbn}</div>
            <div class="sample-type">ISBN-10 Valid</div>
        </div>
    `).join('');

    // ISBN-10 Invalide
    const invalid10List = document.getElementById('invalid-isbn10-list');
    invalid10List.innerHTML = samples.invalidISBN10.map(isbn => `
        <div class="sample-item invalid" onclick="testSample('${isbn}')">
            <div class="sample-isbn">${isbn}</div>
            <div class="sample-type">ISBN-10 Invalid</div>
        </div>
    `).join('');

    // ISBN-13 Valide
    const valid13List = document.getElementById('valid-isbn13-list');
    valid13List.innerHTML = samples.validISBN13.map(isbn => `
        <div class="sample-item valid" onclick="testSample('${isbn}')">
            <div class="sample-isbn">${isbn}</div>
            <div class="sample-type">ISBN-13 Valid</div>
        </div>
    `).join('');

    // ISBN-13 Invalide
    const invalid13List = document.getElementById('invalid-isbn13-list');
    invalid13List.innerHTML = samples.invalidISBN13.map(isbn => `
        <div class="sample-item invalid" onclick="testSample('${isbn}')">
            <div class="sample-isbn">${isbn}</div>
            <div class="sample-type">ISBN-13 Invalid</div>
        </div>
    `).join('');
}

function testSample(isbn) {
    document.getElementById('isbn-input').value = isbn;
    switchTab('validate');
    validateISBN();
}

function runAllTests() {
    const samples = ISBNValidator.getSampleISBNs();
    let passed = 0;
    let total = 0;

    // Test ISBN-10 valide
    samples.validISBN10.forEach(isbn => {
        const result = ISBNValidator.validate(isbn);
        if (result.isValid) passed++;
        total++;
    });

    // Test ISBN-10 invalide
    samples.invalidISBN10.forEach(isbn => {
        const result = ISBNValidator.validate(isbn);
        if (!result.isValid) passed++;
        total++;
    });

    // Test ISBN-13 valide
    samples.validISBN13.forEach(isbn => {
        const result = ISBNValidator.validate(isbn);
        if (result.isValid) passed++;
        total++;
    });

    // Test ISBN-13 invalide
    samples.invalidISBN13.forEach(isbn => {
        const result = ISBNValidator.validate(isbn);
        if (!result.isValid) passed++;
        total++;
    });

    const percentage = Math.round((passed / total) * 100);
    
    toastr.info(`${passed}/${total} teste au trecut (${percentage}%)`, 'Rezultate Teste');
}

function simulateScan() {
    const sampleISBNs = [
        '978-0-306-40615-7',
        '0-306-40615-2',
        '9992158107',
        '9780136091813',
        '85-359-0277-5'
    ];
    
    const randomISBN = sampleISBNs[Math.floor(Math.random() * sampleISBNs.length)];
    document.getElementById('isbn-input').value = randomISBN;
    
    toastr.info(`ISBN scanat: ${randomISBN}`, 'Scanare Simulată');
    validateISBN();
}

function copyGeneratedISBN() {
    const isbnElement = document.getElementById('display-full-isbn');
    const isbn = isbnElement.textContent;
    
    if (isbn && isbn !== '_________') {
        navigator.clipboard.writeText(isbn.replace(/-/g, '')).then(() => {
            toastr.success('ISBN copiat în clipboard!', 'Copiat');
        }).catch(err => {
            toastr.error('Nu s-a putut copia', 'Eroare');
        });
    }
}

// Funcții pentru istoric
function addToHistory(isbn, validationResult) {
    const historyItem = {
        isbn: isbn,
        type: validationResult.type,
        isValid: validationResult.isValid,
        cleanFormat: validationResult.cleanFormat,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleString('ro-RO')
    };

    history.unshift(historyItem);
    
    // Păstrează doar ultimele 50 de intrări
    if (history.length > 50) {
        history.pop();
    }

    localStorage.setItem('isbnHistory', JSON.stringify(history));
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    
    if (history.length === 0) {
        historyList.innerHTML = '<div class="history-empty">Nicio operație în istoric</div>';
        return;
    }

    historyList.innerHTML = history.map((item, index) => `
        <div class="history-item ${item.isValid ? 'valid' : 'invalid'}" 
             onclick="loadFromHistory(${index})">
            <div class="history-isbn">${item.cleanFormat || item.isbn}</div>
            <div class="history-details">
                <span class="history-type">${item.type}</span>
                <span class="history-date">${item.date}</span>
            </div>
            <div class="history-status">
                ${item.isValid ? '✓' : '✗'}
            </div>
        </div>
    `).join('');
}

function loadFromHistory(index) {
    const item = history[index];
    document.getElementById('isbn-input').value = item.isbn;
    switchTab('validate');
    
    // Re-validate
    setTimeout(() => validateISBN(), 100);
}

function clearHistory() {
    if (history.length === 0) {
        toastr.info('Istoricul este deja gol', 'Informare');
        return;
    }

    if (confirm('Sigur doriți să ștergeți tot istoricul?')) {
        history = [];
        localStorage.removeItem('isbnHistory');
        updateHistoryDisplay();
        toastr.success('Istoric șters', 'Succes');
    }
}

// Funcții utilitare
function getDomainInfo(prefix) {
    if (prefix.startsWith('978')) return 'Bookland (International)';
    if (prefix.startsWith('979')) return 'Bookland (Music)';
    
    const countryPrefixes = {
        '0': 'Limba engleză (SUA, UK, etc.)',
        '1': 'Limba engleză',
        '2': 'Limba franceză',
        '3': 'Limba germană',
        '4': 'Japonia',
        '5': 'Rusia',
        '80': 'Cehia, Slovacia',
        '81': 'India',
        '82': 'Norvegia',
        '83': 'Polonia',
        '84': 'Spania',
        '85': 'Brazilia',
        '86': 'Serbia',
        '87': 'Danemarca',
        '88': 'Italia',
        '89': 'Coreea de Sud',
        '90': 'Olanda',
        '91': 'Suedia',
        '92': 'Organizații internaționale',
        '93': 'India',
        '94': 'Olanda',
        '95': 'Polonia',
        '96': 'Turcia',
        '97': 'Brazilia',
        '98': 'Iran',
        '99': 'Colombia',
        '973': 'România'
    };

    return countryPrefixes[prefix] || 'Domeniu necunoscut';
}

function showError(message) {
    toastr.error(message, 'Eroare');
}

function showHelp() {
    document.getElementById('modal-body').innerHTML = `
        <h2>Ajutor și Instrucțiuni</h2>
        
        <h3>Cum să folosești:</h3>
        <ol>
            <li><strong>Validează ISBN:</strong> Introdu un cod ISBN și apasă "Validează"</li>
            <li><strong>Generează cifră control:</strong> Introdu primele 9 cifre pentru ISBN-10</li>
            <li><strong>Convertește:</strong> Transformă ISBN-10 în ISBN-13</li>
            <li><strong>Teste:</strong> Folosește exemplele predefinite pentru testare</li>
        </ol>
        
        <h3>Formate acceptate:</h3>
        <ul>
            <li>ISBN-10: 0-306-40615-2 sau 9992158107</li>
            <li>ISBN-13: 978-0-306-40615-7 sau 9780136091813</li>
            <li>Cu sau fără cratime/spații</li>
        </ul>
        
        <h3>Scurtături:</h3>
        <ul>
            <li><strong>Enter:</strong> Validează ISBN în câmpul curent</li>
            <li><strong>Click pe istoric:</strong> Reîncarcă ISBN-ul</li>
            <li><strong>Click pe exemplu:</strong> Testează automat</li>
        </ul>
    `;
    document.getElementById('modal').style.display = 'block';
}

function showPrivacy() {
    document.getElementById('modal-body').innerHTML = `
        <h2>Confidențialitate</h2>
        
        <p>Acest validator ISBN funcționează 100% în browser. Datele tale nu sunt trimise la niciun server.</p>
        
        <h3>Ce date sunt stocate:</h3>
        <ul>
            <li><strong>Istoric local:</strong> Ultimele 50 de validări (în localStorage)</li>
            <li><strong>Preferințe:</strong> Niciuna</li>
            <li><strong>Cookie-uri:</strong> Nu folosim cookie-uri de urmărire</li>
        </ul>
        
        <h3>Cum ștergi datele:</h3>
        <ul>
            <li>Apasă "Curăță Istoric" în sidebar</li>
            <li>Șterge localStorage în setările browser-ului</li>
            <li>Folosește modul incognito</li>
        </ul>
        
        <p><em>Acest proiect este open-source și nu colectează date personale.</em></p>
    `;
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}