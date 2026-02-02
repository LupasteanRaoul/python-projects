// Smart Budget Tracker - Interactive Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('💰 Smart Budget Tracker loaded');
    
    // Initialize everything
    initCharts();
    initEventListeners();
    updateLiveTime();
    checkForNewTransactions();
    
    // Auto-refresh data every 30 seconds
    setInterval(refreshData, 30000);
});

// ===== CHART FUNCTIONS =====
function initCharts() {
    createCategoryChart();
    createMonthlyChart();
}

function createCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    // This would typically come from an API endpoint
    // For now, we'll create sample data
    const categories = ['Salariu', 'Mâncare', 'Transport', 'Divertisment', 'Altele'];
    const incomeData = [5000, 0, 0, 0, 100];
    const expenseData = [0, 1500, 300, 200, 500];
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [
                {
                    label: 'Venituri',
                    data: incomeData,
                    backgroundColor: 'rgba(76, 201, 240, 0.7)',
                    borderColor: '#4cc9f0',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                },
                {
                    label: 'Cheltuieli',
                    data: expenseData,
                    backgroundColor: 'rgba(247, 37, 133, 0.7)',
                    borderColor: '#f72585',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 13,
                            family: 'Inter'
                        },
                        padding: 20,
                        usePointStyle: true,
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(33, 37, 41, 0.9)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        family: 'Inter'
                    },
                    bodyFont: {
                        size: 14,
                        family: 'Inter'
                    },
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed.y.toFixed(2) + ' RON';
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            family: 'Inter'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: 12,
                            family: 'Inter'
                        },
                        callback: function(value) {
                            return value + ' RON';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

function createMonthlyChart() {
    const ctx = document.getElementById('monthlyChart');
    if (!ctx) return;
    
    const months = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun'];
    const incomeData = [3000, 3200, 2800, 3500, 4000, 3800];
    const expenseData = [2500, 2700, 3000, 2800, 3200, 2900];
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Venituri',
                    data: incomeData,
                    borderColor: '#4cc9f0',
                    backgroundColor: 'rgba(76, 201, 240, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4cc9f0',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'Cheltuieli',
                    data: expenseData,
                    borderColor: '#f72585',
                    backgroundColor: 'rgba(247, 37, 133, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#f72585',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(33, 37, 41, 0.9)',
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + ' RON';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'nearest'
            }
        }
    });
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
    // Transaction type radio buttons
    const typeRadios = document.querySelectorAll('input[name="type"]');
    typeRadios.forEach(radio => {
        radio.addEventListener('change', updateFormStyle);
    });
    
    // Export buttons
    document.querySelectorAll('.export-btn').forEach(btn => {
        btn.addEventListener('click', handleExport);
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchTransactions, 300));
    }
    
    // Print button
    const printBtn = document.querySelector('[onclick="printPage()"]');
    if (printBtn) {
        printBtn.addEventListener('click', printPage);
    }
}

function updateFormStyle() {
    const form = document.getElementById('transactionForm');
    const incomeRadio = document.getElementById('typeIncome');
    
    if (incomeRadio.checked) {
        form.classList.remove('expense-form');
        form.classList.add('income-form');
    } else {
        form.classList.remove('income-form');
        form.classList.add('expense-form');
    }
}

// ===== UTILITY FUNCTIONS =====
function updateLiveTime() {
    const timeElement = document.getElementById('liveTime');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString('ro-RO', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    setTimeout(updateLiveTime, 1000);
}

function refreshData() {
    fetch('/api/health')
        .then(response => {
            if (response.ok) {
                console.log('Server is healthy');
            }
        })
        .catch(error => console.log('Health check failed:', error));
}

function checkForNewTransactions() {
    // This would check for new transactions via WebSocket or polling
    // For now, just log
    console.log('Checking for new transactions...');
}

function exportToJSON() {
    fetch('/api/transactions')
        .then(response => response.json())
        .then(data => {
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `budget-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('Backup JSON descărcat cu succes!', 'success');
        })
        .catch(error => {
            console.error('Export error:', error);
            showNotification('Eroare la export!', 'danger');
        });
}

function printPage() {
    window.print();
}

function searchTransactions() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('.list-group-item');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function showNotification(message, type = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    // Add to container
    const container = document.querySelector('.toast-container');
    container.appendChild(toast);
    
    // Show toast
    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();
    
    // Remove after hide
    toast.addEventListener('hidden.bs.toast', function () {
        container.removeChild(toast);
    });
}

// ===== HELPER FUNCTIONS =====
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

function formatCurrency(amount) {
    return new Intl.NumberFormat('ro-RO', {
        style: 'currency',
        currency: 'RON'
    }).format(amount);
}

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.innerHTML = formatCurrency(start + progress * (end - start));
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ===== PAGE TRANSITIONS =====
function navigateTo(url) {
    document.body.classList.add('page-transition');
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

// Add CSS for page transitions
const style = document.createElement('style');
style.textContent = `
    .page-transition {
        animation: fadeOut 0.3s ease-out forwards;
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// ===== INITIALIZE ON LOAD =====
// Update form style on load
window.onload = function() {
    updateFormStyle();
    
    // Animate numbers if present
    document.querySelectorAll('.animate-number').forEach(el => {
        const value = parseFloat(el.textContent);
        if (!isNaN(value)) {
            animateValue(el, 0, value, 2000);
        }
    });
    
    // Add hover effects to cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
};
function initProgressBars() {
    document.querySelectorAll('.progress[data-income]').forEach(progressBar => {
        const income = parseFloat(progressBar.dataset.income) || 0;
        const expenses = parseFloat(progressBar.dataset.expenses) || 0;
        const total = income + expenses;
        
        if (total > 0) {
            const incomePercent = Math.round((income / total) * 100);
            const expensesPercent = Math.round((expenses / total) * 100);
            
            progressBar.innerHTML = `
                <div class="progress-bar bg-success" style="width: ${incomePercent}%"></div>
                <div class="progress-bar bg-danger" style="width: ${expensesPercent}%"></div>
            `;
        } else {
            progressBar.innerHTML = `
                <div class="progress-bar bg-secondary" style="width: 100%"></div>
            `;
        }
    });
}

// Apelază funcția când se încarcă pagina
document.addEventListener('DOMContentLoaded', initProgressBars);