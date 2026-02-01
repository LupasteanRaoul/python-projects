// Budget Tracker - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadCharts();
    updateDateTime();
    
    // Auto-refresh data every 30 seconds
    setInterval(refreshData, 30000);
}

function setupEventListeners() {
    // Form submission
    const addForm = document.getElementById('addTransactionForm');
    if (addForm) {
        addForm.addEventListener('submit', handleAddTransaction);
    }
    
    // Category management
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', addNewCategory);
    }
    
    // Transaction deletion
    document.addEventListener('click', function(e) {
        if (e.target.closest('.delete-btn')) {
            const btn = e.target.closest('.delete-btn');
            deleteTransaction(btn.dataset.id);
        }
        
        if (e.target.closest('.edit-btn')) {
            const btn = e.target.closest('.edit-btn');
            editTransaction(btn.dataset.id);
        }
    });
    
    // Filters
    const applyFilterBtn = document.getElementById('applyFilter');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', applyFilters);
    }
    
    const applyAdvancedFilterBtn = document.getElementById('applyAdvancedFilter');
    if (applyAdvancedFilterBtn) {
        applyAdvancedFilterBtn.addEventListener('click', applyAdvancedFilters);
    }
    
    const resetFiltersBtn = document.getElementById('resetFilters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
    
    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchTransactions, 300));
    }
    
    // Month selector
    const monthSelector = document.getElementById('monthSelector');
    if (monthSelector) {
        monthSelector.addEventListener('change', updateMonthlyStats);
    }
    
    // Transaction type radio buttons
    const typeRadios = document.querySelectorAll('input[name="type"]');
    typeRadios.forEach(radio => {
        radio.addEventListener('change', updateCategoryOptions);
    });
}

function handleAddTransaction(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Validate amount
    if (parseFloat(data.amount) <= 0) {
        showMessage('Suma trebuie să fie mai mare decât 0', 'danger');
        return;
    }
    
    // If no date provided, use current
    if (!data.date) {
        const now = new Date();
        data.date = now.toISOString().slice(0, 16);
    }
    
    showLoading(true);
    
    fetch('/add-transaction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            showMessage('✓ Tranzacție adăugată cu succes!', 'success');
            form.reset();
            
            // Update UI
            addTransactionToTable(result.transaction);
            refreshData();
            
            // Play success sound if available
            playSuccessSound();
        } else {
            showMessage(result.error || 'Eroare la adăugare', 'danger');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('Eroare de conexiune', 'danger');
    })
    .finally(() => {
        showLoading(false);
    });
}

function deleteTransaction(id) {
    if (!confirm('Sigur doriți să ștergeți această tranzacție?')) {
        return;
    }
    
    fetch(`/api/delete-transaction/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            showMessage('Tranzacție ștearsă', 'success');
            
            // Remove from table
            const row = document.querySelector(`tr[data-id="${id}"]`);
            if (row) {
                row.classList.add('table-danger');
                setTimeout(() => row.remove(), 300);
            }
            
            refreshData();
        } else {
            showMessage(result.error, 'danger');
        }
    });
}

function editTransaction(id) {
    // Implement edit functionality
    console.log('Edit transaction:', id);
    // You would typically open a modal with form pre-filled with transaction data
}

function addNewCategory() {
    const newCategoryInput = document.getElementById('newCategory');
    const category = newCategoryInput.value.trim();
    
    if (!category) {
        showMessage('Introduceți o categorie', 'warning');
        return;
    }
    
    const categorySelect = document.getElementById('categorySelect');
    const transactionType = document.querySelector('input[name="type"]:checked').value;
    
    // Determine which optgroup to add to
    const optgroupLabel = transactionType === 'income' ? 'Venituri' : 'Cheltuieli';
    let optgroup = categorySelect.querySelector(`optgroup[label="${optgroupLabel}"]`);
    
    if (!optgroup) {
        optgroup = document.createElement('optgroup');
        optgroup.label = optgroupLabel;
        categorySelect.appendChild(optgroup);
    }
    
    // Check if category already exists
    const existingOptions = Array.from(categorySelect.options);
    const exists = existingOptions.some(opt => opt.value === category);
    
    if (!exists) {
        const option = new Option(category, category);
        optgroup.appendChild(option);
        categorySelect.value = category;
        showMessage(`Categorie "${category}" adăugată`, 'success');
        newCategoryInput.value = '';
    } else {
        showMessage('Categoria există deja', 'warning');
    }
}

function updateCategoryOptions() {
    const selectedType = document.querySelector('input[name="type"]:checked').value;
    const categorySelect = document.getElementById('categorySelect');
    
    // You could filter categories here based on type
    // For now, just show all categories but preselect appropriate ones
}

function refreshData() {
    // Update stats
    fetch('/api/stats')
        .then(response => response.json())
        .then(stats => {
            updateStatsDisplay(stats);
        });
    
    // Update category summary
    fetch('/api/category-summary')
        .then(response => response.json())
        .then(summary => {
            updateCategoryChart(summary);
        });
    
    // Update transactions table if on transactions page
    if (document.getElementById('allTransactionsTable')) {
        fetch('/api/transactions')
            .then(response => response.json())
            .then(transactions => {
                updateTransactionsTable(transactions);
            });
    }
}

function loadCharts() {
    // Initialize category chart
    const ctx1 = document.getElementById('categoryChart');
    if (ctx1) {
        fetch('/api/category-summary')
            .then(response => response.json())
            .then(data => {
                createCategoryChart(ctx1, data);
            });
    }
    
    // Initialize monthly chart
    const ctx2 = document.getElementById('monthlyChart');
    if (ctx2) {
        createMonthlyChart(ctx2);
    }
}

function createCategoryChart(ctx, data) {
    const categories = Object.keys(data);
    const incomes = categories.map(cat => data[cat].income);
    const expenses = categories.map(cat => data[cat].expense);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                label: 'Venituri',
                data: incomes,
                backgroundColor: categories.map((_, i) => 
                    `hsl(${i * 50}, 70%, 60%)`
                ),
                borderWidth: 1
            }, {
                label: 'Cheltuieli',
                data: expenses,
                backgroundColor: categories.map((_, i) => 
                    `hsl(${i * 50 + 180}, 70%, 60%)`
                ),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed.toFixed(2) + ' lei';
                            return label;
                        }
                    }
                }
            }
        }
    });
}

function createMonthlyChart(ctx) {
    // This would typically fetch monthly data from API
    const months = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun'];
    const incomeData = [3000, 3200, 2800, 3500, 4000, 3800];
    const expenseData = [2500, 2700, 3000, 2800, 3200, 2900];
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Venituri',
                data: incomeData,
                borderColor: '#4cc9f0',
                backgroundColor: 'rgba(76, 201, 240, 0.1)',
                tension: 0.3,
                fill: true
            }, {
                label: 'Cheltuieli',
                data: expenseData,
                borderColor: '#f72585',
                backgroundColor: 'rgba(247, 37, 133, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + ' lei';
                        }
                    }
                }
            }
        }
    });
}

function applyFilters() {
    const period = document.getElementById('periodFilter').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    // Apply filters and update table
    fetch('/filter-transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            start_date: startDate,
            end_date: endDate
        })
    })
    .then(response => response.json())
    .then(transactions => {
        updateTransactionsTable(transactions);
    });
}

function applyAdvancedFilters() {
    const startDate = document.getElementById('filterStartDate').value;
    const endDate = document.getElementById('filterEndDate').value;
    const category = document.getElementById('filterCategory').value;
    const type = document.getElementById('filterType').value;
    
    fetch('/filter-transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            start_date: startDate,
            end_date: endDate,
            category: category,
            type: type
        })
    })
    .then(response => response.json())
    .then(transactions => {
        updateTransactionsTable(transactions);
    });
}

function resetFilters() {
    document.getElementById('filterStartDate').value = '';
    document.getElementById('filterEndDate').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterType').value = '';
    
    // Reload all transactions
    fetch('/api/transactions')
        .then(response => response.json())
        .then(transactions => {
            updateTransactionsTable(transactions);
        });
}

function searchTransactions() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#allTransactionsTable tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function updateMonthlyStats() {
    const monthValue = document.getElementById('monthSelector').value;
    const [year, month] = monthValue.split('-');
    
    fetch(`/monthly-summary?year=${year}&month=${month}`)
        .then(response => response.json())
        .then(summary => {
            const html = `
                <p><strong>Venituri:</strong> ${summary.income.toFixed(2)} lei</p>
                <p><strong>Cheltuieli:</strong> ${summary.expenses.toFixed(2)} lei</p>
                <p><strong>Balanță:</strong> 
                    <span class="${summary.balance >= 0 ? 'text-success' : 'text-danger'}">
                        ${summary.balance.toFixed(2)} lei
                    </span>
                </p>
                <p><strong>Tranzacții:</strong> ${summary.transactions}</p>
            `;
            document.getElementById('monthlyStats').innerHTML = html;
        });
}

function addTransactionToTable(transaction) {
    const table = document.getElementById('transactionsTable');
    if (!table) return;
    
    const row = document.createElement('tr');
    row.dataset.id = transaction.id;
    row.className = 'new-transaction';
    
    const typeClass = transaction.type === 'income' ? 'success' : 'danger';
    const typeText = transaction.type === 'income' ? 'Venit' : 'Cheltuială';
    
    row.innerHTML = `
        <td>${transaction.date.slice(0, 16)}</td>
        <td><span class="badge bg-secondary">${transaction.category}</span></td>
        <td>${transaction.description}</td>
        <td><span class="badge bg-${typeClass}">${typeText}</span></td>
        <td class="text-end ${transaction.type === 'income' ? 'text-success' : 'text-danger'}">
            ${parseFloat(transaction.amount).toFixed(2)} lei
        </td>
        <td>
            <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${transaction.id}">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;
    
    if (table.firstChild && table.firstChild.tagName === 'TR') {
        table.insertBefore(row, table.firstChild);
    } else {
        table.appendChild(row);
    }
    
    // If there was a "no transactions" row, remove it
    const emptyRow = table.querySelector('td[colspan]');
    if (emptyRow) {
        emptyRow.closest('tr').remove();
    }
}

function updateStatsDisplay(stats) {
    // Update various stat elements on the page
    const elements = {
        'balance': stats.balance.toFixed(2),
        'total_income': stats.total_income.toFixed(2),
        'total_expenses': stats.total_expenses.toFixed(2),
        'total_transactions': stats.total_transactions
    };
    
    for (const [key, value] of Object.entries(elements)) {
        const element = document.querySelector(`[data-stat="${key}"]`);
        if (element) {
            element.textContent = value;
        }
    }
}

function updateTransactionsTable(transactions) {
    const table = document.getElementById('allTransactionsTable');
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    
    if (transactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                    <p class="mt-2">Nu s-au găsit tranzacții</p>
                </td>
            </tr>
        `;
        return;
    }
    
    let totalIncome = 0;
    let totalExpense = 0;
    
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.dataset.id = transaction.id;
        row.className = transaction.type === 'income' ? 'table-success' : 'table-danger';
        
        if (transaction.type === 'income') {
            totalIncome += parseFloat(transaction.amount);
        } else {
            totalExpense += parseFloat(transaction.amount);
        }
        
        row.innerHTML = `
            <td><small class="text-muted">${transaction.id.slice(0, 8)}...</small></td>
            <td>${transaction.date}</td>
            <td><span class="badge bg-secondary">${transaction.category}</span></td>
            <td>${transaction.description}</td>
            <td><span class="badge bg-${transaction.type === 'income' ? 'success' : 'danger'}">
                ${transaction.type_display}
            </span></td>
            <td class="text-end fw-bold">
                ${parseFloat(transaction.amount).toFixed(2)} lei
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary edit-btn" data-id="${transaction.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger delete-btn" data-id="${transaction.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Update footer with totals
    const tfoot = table.querySelector('tfoot');
    if (tfoot) {
        tfoot.innerHTML = `
            <tr class="table-dark">
                <td colspan="5" class="text-end"><strong>Total:</strong></td>
                <td class="text-end fw-bold">
                    ${(totalIncome - totalExpense).toFixed(2)} lei
                </td>
                <td></td>
            </tr>
        `;
    }
}

function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('formMessage');
    if (messageDiv) {
        messageDiv.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const alert = messageDiv.querySelector('.alert');
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    } else {
        // Create temporary message
        const tempDiv = document.createElement('div');
        tempDiv.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
        tempDiv.style.zIndex = '9999';
        tempDiv.textContent = message;
        document.body.appendChild(tempDiv);
        
        setTimeout(() => tempDiv.remove(), 3000);
    }
}

function showLoading(show) {
    const submitBtn = document.querySelector('#addTransactionForm button[type="submit"]');
    if (submitBtn && show) {
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Se procesează...';
        submitBtn.disabled = true;
    } else if (submitBtn && !show) {
        submitBtn.innerHTML = '<i class="bi bi-check-circle"></i> Adaugă tranzacție';
        submitBtn.disabled = false;
    }
}

function updateDateTime() {
    const now = new Date();
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('ro-RO', options);
    }
}

function playSuccessSound() {
    // Simple beep sound
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        // Audio not supported, silently fail
    }
}

// Utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}