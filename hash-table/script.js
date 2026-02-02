// script.js
let hashTable = new HashTable(5);
let operationLog = [];

// Inițializare
document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();
    addLog('Aplicație inițializată cu succes.', 'success');
});

// Funcții pentru operații
function insertItem() {
    const key = document.getElementById('insert-key').value.trim();
    const value = document.getElementById('insert-value').value.trim();
    
    if (!key || !value) {
        showAlert('Te rog completează atât cheia cât și valoarea.', 'error');
        return;
    }
    
    try {
        const result = hashTable.insert(key, value);
        updateDisplay();
        
        let message = `Inserat: "${key}" -> "${value}" la indexul ${result.index}`;
        if (result.rehashed) {
            message += ` (Tabela a fost rehashed de la ${result.oldSize} la ${result.newSize} buckets)`;
            addLog(message, 'warning');
            showAlert('Tabela a fost rehashed automat!', 'info');
        } else {
            addLog(message, 'success');
        }
        
        // Reset input fields
        document.getElementById('insert-key').value = '';
        document.getElementById('insert-value').value = '';
        
    } catch (error) {
        addLog(`Eroare la inserare: ${error.message}`, 'error');
    }
}

function searchItem() {
    const key = document.getElementById('search-key').value.trim();
    
    if (!key) {
        showAlert('Te rog introdu o cheie de căutat.', 'error');
        return;
    }
    
    try {
        const result = hashTable.get(key);
        updateDisplay();
        
        // Highlight found item
        highlightBucket(result.index, key);
        
        addLog(`Găsit: "${key}" -> "${result.value}" la indexul ${result.index}`, 'success');
        document.getElementById('search-key').value = '';
        
    } catch (error) {
        addLog(`Cheia "${key}" nu a fost găsită.`, 'error');
        showAlert(`Cheia "${key}" nu există în tabelă.`, 'error');
    }
}

function deleteItem() {
    const key = document.getElementById('delete-key').value.trim();
    
    if (!key) {
        showAlert('Te rog introdu o cheie de șters.', 'error');
        return;
    }
    
    const result = hashTable.remove(key);
    
    if (result.success) {
        updateDisplay();
        addLog(`Șters: "${key}" de la indexul ${result.index}`, 'warning');
        showAlert(`Cheia "${key}" a fost ștearsă.`, 'success');
    } else {
        addLog(`Ștergere eșuată: cheia "${key}" nu există`, 'error');
        showAlert(`Cheia "${key}" nu există în tabelă.`, 'error');
    }
    
    document.getElementById('delete-key').value = '';
}

function loadSampleData() {
    const sampleData = [
        ["nume", "Ion Popescu"],
        ["varsta", 28],
        ["oras", "București"],
        ["ocupatie", "Developer"],
        ["salariu", 7500],
        ["hobby", "Programare"],
        ["email", "ion@example.com"],
        ["telefon", "0712345678"],
        ["experienta", "5 ani"],
        ["tehnologii", "JavaScript, Python"],
        ["proiecte", 12],
        ["limbi", "Română, Engleză"],
        ["educatie", "Master"],
        ["specializare", "Informatică"]
    ];
    
    sampleData.forEach(([key, value]) => {
        hashTable.insert(key, value);
    });
    
    updateDisplay();
    addLog(`Încărcate ${sampleData.length} elemente demo`, 'success');
    showAlert('Datele demo au fost încărcate cu succes!', 'info');
}

function clearTable() {
    if (hashTable.count === 0) {
        showAlert('Tabela este deja goală.', 'info');
        return;
    }
    
    if (confirm('Sigur vrei să cureți toată tabela hash? Această acțiune nu poate fi anulată.')) {
        hashTable.clear();
        updateDisplay();
        addLog('Tabela hash a fost curățată complet.', 'warning');
    }
}

function rehashTable() {
    const oldSize = hashTable.size;
    hashTable._rehash();
    updateDisplay();
    
    addLog(`Rehash complet: de la ${oldSize} la ${hashTable.size} buckets`, 'success');
    showAlert(`Tabela rehashed de la ${oldSize} la ${hashTable.size} buckets!`, 'info');
}

// Funcții pentru vizualizare
function updateDisplay() {
    updateTableVisualization();
    updateStats();
}

function updateTableVisualization() {
    const container = document.getElementById('hash-table-container');
    const entries = hashTable.getAllEntries();
    const stats = hashTable.getStats();
    
    document.getElementById('table-size').innerHTML = 
        `<i class="fas fa-layer-group"></i> Buckets: ${stats.size}`;
    document.getElementById('table-count').innerHTML = 
        `<i class="fas fa-hashtag"></i> Elemente: ${stats.count}`;
    document.getElementById('load-factor').innerHTML = 
        `<i class="fas fa-percentage"></i> Factor încărcare: ${stats.loadFactor.toFixed(2)}`;
    
    if (entries.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox fa-3x"></i>
                <h3>Tabela hash este goală</h3>
                <p>Folosește formularul din stânga pentru a adăuga elemente sau apasă "Date demo"</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="hash-table">';
    
    // Afișează doar bucket-urile care au elemente
    entries.forEach(entry => {
        html += `
            <div class="bucket" data-index="${entry.index}">
                <div class="bucket-header">
                    <span class="bucket-index">Bucket ${entry.index}</span>
                    <span class="bucket-size">${entry.chainLength} element${entry.chainLength !== 1 ? 'e' : ''}</span>
                </div>
                <div class="chain">
        `;
        
        entry.bucket.forEach((pair, idx) => {
            html += `
                <div class="key-value-pair" data-key="${pair.key}">
                    <div class="pair-index">${idx + 1}</div>
                    <div class="key">${pair.key}</div>
                    <div class="value">${pair.value}</div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function updateStats() {
    const stats = hashTable.getStats();
    const container = document.getElementById('stats-container');
    
    const statsHtml = `
        <div class="stat-item">
            <span class="stat-label">Dimensiune totală:</span>
            <span class="stat-value">${stats.size} buckets</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Elemente stocate:</span>
            <span class="stat-value">${stats.count}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Factor de încărcare:</span>
            <span class="stat-value">${stats.loadFactor.toFixed(2)}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Coliziuni totale:</span>
            <span class="stat-value">${stats.collisions}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Lungime maximă lanț:</span>
            <span class="stat-value">${stats.maxChainLength}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Buckets goale:</span>
            <span class="stat-value">${stats.emptyBuckets}</span>
        </div>
    `;
    
    container.innerHTML = statsHtml;
}

function highlightBucket(bucketIndex, key) {
    // Îndepărtează highlight-uri vechi
    document.querySelectorAll('.key-value-pair').forEach(pair => {
        pair.classList.remove('highlight');
    });
    
    // Găsește și highlight-ează elementul
    const bucket = document.querySelector(`.bucket[data-index="${bucketIndex}"]`);
    if (bucket) {
        const pair = bucket.querySelector(`.key-value-pair[data-key="${key}"]`);
        if (pair) {
            pair.classList.add('highlight');
            pair.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Funcții pentru log
function addLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
        message,
        type,
        timestamp
    };
    
    operationLog.unshift(logEntry);
    
    // Păstrează doar ultimele 50 de intrări
    if (operationLog.length > 50) {
        operationLog.pop();
    }
    
    updateLogDisplay();
}

function updateLogDisplay() {
    const container = document.getElementById('log-container');
    let html = '';
    
    operationLog.forEach(entry => {
        html += `
            <div class="log-entry ${entry.type}">
                <strong>[${entry.timestamp}]</strong> ${entry.message}
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function clearLogs() {
    operationLog = [];
    updateLogDisplay();
    addLog('Jurnalul a fost curățat.', 'info');
}

// Funcții utilitare
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 
                         type === 'success' ? 'check-circle' : 
                         type === 'warning' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(alertDiv);
    
    // Adaugă stil pentru alertă
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        background: ${type === 'error' ? 'var(--danger-color)' :
                     type === 'success' ? 'var(--success-color)' :
                     type === 'warning' ? 'var(--warning-color)' : 'var(--info-color)'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

function showInfo() {
    document.getElementById('modal-body').innerHTML = `
        <h2>Despre Hash Table Visualizer</h2>
        <p>Acest proiect vizualizează funcționarea unei tabele hash cu rezolvarea coliziunilor prin chainning.</p>
        
        <h3>Caracteristici:</h3>
        <ul>
            <li>Hash function optimizată</li>
            <li>Rehashing automat când factorul de încărcare > 0.7</li>
            <li>Vizualizare în timp real a structurii</li>
            <li>Statistici detaliate</li>
            <li>Jurnal complet al operațiilor</li>
        </ul>
        
        <h3>Operații suportate:</h3>
        <ul>
            <li><strong>Insert</strong>: Adaugă o pereche cheie-valoare</li>
            <li><strong>Search</strong>: Caută o valoare după cheie</li>
            <li><strong>Delete</strong>: Șterge o intrare</li>
            <li><strong>Rehash</strong>: Redimensionează tabela</li>
        </ul>
    `;
    document.getElementById('modal').style.display = 'block';
}

function showInstructions() {
    document.getElementById('modal-body').innerHTML = `
        <h2>Instrucțiuni de utilizare</h2>
        
        <h3>1. Inserare elemente</h3>
        <p>Completează ambele câmpuri din secțiunea "Inserare" și apasă butonul "Inserează".</p>
        
        <h3>2. Căutare elemente</h3>
        <p>Introdu cheia în câmpul "Căutare" și apasă "Caută". Elementul găsit va fi evidențiat.</p>
        
        <h3>3. Ștergere elemente</h3>
        <p>Introdu cheia în câmpul "Ștergere" și apasă "Șterge".</p>
        
        <h3>4. Acțiuni rapide</h3>
        <ul>
            <li><strong>Date demo</strong>: Încarcă date predefinite pentru testare</li>
            <li><strong>Curăță tabela</strong>: Șterge toate elementele</li>
            <li><strong>Rehash</strong>: Forțează o reindexare a tabelului</li>
        </ul>
        
        <h3>5. Interpretare vizualizare</h3>
        <ul>
            <li>Fiecare "bucket" reprezintă o poziție în tabelă</li>
            <li>Numărul din cerc arată poziția în lanț</li>
            <li>Coliziunile apar când un bucket conține mai mult de un element</li>
            <li>Factorul de încărcare = (elemente totale) / (număr buckets)</li>
        </ul>
    `;
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Închide modalul când se apasă în afara lui
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
};

// Adăugă animații CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .empty-state {
        text-align: center;
        padding: 50px 20px;
        color: var(--gray-color);
    }
    
    .empty-state i {
        margin-bottom: 20px;
        color: var(--secondary-color);
    }
`;
document.head.appendChild(style);