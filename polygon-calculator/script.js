// script.js
let calculator = new GeometryCalculator();
let canvas, ctx;
let isInitialized = false;

function initApp() {
    if (isInitialized) return;
    
    canvas = document.getElementById('main-canvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    if (calculator.loadFromStorage()) {
        showNotification('Date încărcate din memoria locală', 'info');
    }
    
    requestAnimationFrame(render);
    isInitialized = true;
}

function resizeCanvas() {
    if (!canvas) return;
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    render();
}

function render() {
    if (!ctx || !canvas) return;
    calculator.drawAll(ctx, canvas.width, canvas.height);
    updateUI();
    requestAnimationFrame(render);
}

function updateUI() {
    updateStats();
    updateShapesList();
    updateDetails(); // ADĂUGAT
    updateShapesCount();
    calculator.saveToStorage();
}

// Funcții pentru adăugare forme (păstrează-le ca înainte)
function addCircle() {
    const radius = document.getElementById('circle-radius').value;
    if (!radius || radius <= 0) {
        showNotification('Introdu o rază validă!', 'error');
        return;
    }
    
    try {
        const circle = new Circle(radius);
        if (calculator.addShape(circle)) {
            showNotification('Cerc adăugat cu succes!', 'success');
            document.getElementById('circle-radius').value = 10;
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function addRectangle() {
    const length = document.getElementById('rect-length').value;
    const width = document.getElementById('rect-width').value;
    
    if (!length || !width || length <= 0 || width <= 0) {
        showNotification('Introdu dimensiuni valide!', 'error');
        return;
    }
    
    try {
        const rectangle = new Rectangle(length, width);
        if (calculator.addShape(rectangle)) {
            const type = rectangle.isSquare() ? 'Pătrat' : 'Dreptunghi';
            showNotification(`${type} adăugat cu succes!`, 'success');
            document.getElementById('rect-length').value = 15;
            document.getElementById('rect-width').value = 10;
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function addTriangle() {
    const a = document.getElementById('tri-a').value;
    const b = document.getElementById('tri-b').value;
    const c = document.getElementById('tri-c').value;
    
    if (!a || !b || !c || a <= 0 || b <= 0 || c <= 0) {
        showNotification('Introdu laturi valide!', 'error');
        return;
    }
    
    try {
        const triangle = new Triangle(a, b, c);
        if (calculator.addShape(triangle)) {
            showNotification('Triunghi adăugat cu succes!', 'success');
            document.getElementById('tri-a').value = 10;
            document.getElementById('tri-b').value = 12;
            document.getElementById('tri-c').value = 15;
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function addPolygon() {
    const sides = document.getElementById('poly-sides').value;
    const sideLength = document.getElementById('poly-length').value;
    
    if (!sides || sides < 3 || !sideLength || sideLength <= 0) {
        showNotification('Introdu date valide!', 'error');
        return;
    }
    
    try {
        const polygon = new Polygon(sides, sideLength);
        if (calculator.addShape(polygon)) {
            showNotification('Poligon adăugat cu succes!', 'success');
            document.getElementById('poly-sides').value = 6;
            document.getElementById('poly-length').value = 8;
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function addRandomShape() {
    const shapes = ['circle', 'rectangle', 'triangle', 'polygon'];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    
    switch(randomShape) {
        case 'circle':
            document.getElementById('circle-radius').value = Math.floor(Math.random() * 30) + 5;
            addCircle();
            break;
        case 'rectangle':
            const size1 = Math.floor(Math.random() * 40) + 10;
            const size2 = Math.floor(Math.random() * 40) + 10;
            document.getElementById('rect-length').value = size1;
            document.getElementById('rect-width').value = size2;
            addRectangle();
            break;
        case 'triangle':
            const a = Math.floor(Math.random() * 30) + 10;
            const b = Math.floor(Math.random() * 30) + 10;
            const c = Math.max(a, b) + Math.floor(Math.random() * 10) + 1;
            document.getElementById('tri-a').value = a;
            document.getElementById('tri-b').value = b;
            document.getElementById('tri-c').value = c;
            addTriangle();
            break;
        case 'polygon':
            document.getElementById('poly-sides').value = Math.floor(Math.random() * 7) + 3;
            document.getElementById('poly-length').value = Math.floor(Math.random() * 20) + 5;
            addPolygon();
            break;
    }
}

function clearAllShapes() {
    if (calculator.shapes.length === 0) {
        showNotification('Nu există forme de șters!', 'info');
        return;
    }
    
    if (confirm(`Ștergi toate cele ${calculator.shapes.length} forme?`)) {
        const count = calculator.clearAll();
        showNotification(`${count} forme au fost șterse!`, 'success');
    }
}

// Funcții pentru UI
function updateStats() {
    const totalShapes = document.getElementById('total-shapes');
    const totalArea = document.getElementById('total-area');
    const totalPerimeter = document.getElementById('total-perimeter');
    const largestShape = document.getElementById('largest-shape');
    
    if (totalShapes) totalShapes.textContent = calculator.shapes.length;
    if (totalArea) totalArea.textContent = calculator.getTotalArea().toFixed(1);
    if (totalPerimeter) totalPerimeter.textContent = calculator.getTotalPerimeter().toFixed(1);
    
    const largest = calculator.getLargestShape();
    if (largestShape) {
        largestShape.textContent = largest ? 
            `${largest.type} (${largest.area().toFixed(1)} cm²)` : '-';
    }
}

function updateShapesCount() {
    const countElement = document.getElementById('shapes-count');
    if (countElement) {
        countElement.textContent = calculator.shapes.length;
    }
}

function updateShapesList() {
    const shapesList = document.getElementById('shapes-list');
    const emptyState = document.getElementById('empty-state');
    
    if (!shapesList || !emptyState) return;
    
    if (calculator.shapes.length === 0) {
        shapesList.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    shapesList.innerHTML = calculator.shapes.map(shape => {
        const isSelected = calculator.selectedShape?.id === shape.id;
        const icon = getShapeIcon(shape.type);
        
        return `
            <div class="shape-item ${isSelected ? 'selected' : ''}" 
                 onclick="selectShape('${shape.id}')">
                <div class="shape-header">
                    <div class="shape-icon" style="background: ${shape.color}">
                        ${icon}
                    </div>
                    <div class="shape-name">${shape.type}</div>
                    <button class="delete-btn" onclick="deleteShape('${shape.id}', event)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="shape-props">
                    <div class="shape-prop">
                        <div class="prop-label">Arie</div>
                        <div class="prop-value">${shape.area().toFixed(1)} cm²</div>
                    </div>
                    <div class="shape-prop">
                        <div class="prop-label">Perimetru</div>
                        <div class="prop-value">${shape.perimeter().toFixed(1)} cm</div>
                    </div>
                </div>
                <div class="shape-props">
                    <div class="shape-prop">
                        <div class="prop-label">Culoare</div>
                        <div class="prop-value" style="color: ${shape.color}">●</div>
                    </div>
                    <div class="shape-prop">
                        <div class="prop-label">Adăugat</div>
                        <div class="prop-value">${shape.createdAt.toLocaleTimeString('ro-RO', {hour: '2-digit', minute:'2-digit'})}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// FUNCȚIA IMPORTANTĂ: updateDetails
function updateDetails() {
    const detailsCard = document.getElementById('details-card');
    if (!detailsCard) {
        console.error('Elementul details-card nu a fost găsit!');
        return;
    }
    
    console.log('updateDetails called, selectedShape:', calculator.selectedShape);
    
    if (!calculator.selectedShape) {
        detailsCard.innerHTML = `
            <div class="no-selection">
                <i class="fas fa-mouse-pointer fa-2x"></i>
                <p>Selectează o formă din lista de mai sus</p>
            </div>
        `;
        return;
    }
    
    const shape = calculator.selectedShape;
    console.log('Updating details for shape:', shape);
    
    let specificDetails = '';
    if (shape.type === 'Cerc') {
        specificDetails = `
            <div class="detail-item">
                <div class="detail-label">Rază</div>
                <div class="detail-value">${shape.radius.toFixed(2)} cm</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Diametru</div>
                <div class="detail-value">${(shape.radius * 2).toFixed(2)} cm</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Circumferință</div>
                <div class="detail-value">${shape.perimeter().toFixed(2)} cm</div>
            </div>
        `;
    } else if (shape.type === 'Dreptunghi') {
        specificDetails = `
            <div class="detail-item">
                <div class="detail-label">Lungime</div>
                <div class="detail-value">${shape.length.toFixed(2)} cm</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Lățime</div>
                <div class="detail-value">${shape.width.toFixed(2)} cm</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Tip</div>
                <div class="detail-value">${shape.isSquare() ? 'Pătrat' : 'Dreptunghi'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Diagonală</div>
                <div class="detail-value">${Math.sqrt(shape.length * shape.length + shape.width * shape.width).toFixed(2)} cm</div>
            </div>
        `;
    } else if (shape.type === 'Triunghi') {
        specificDetails = `
            <div class="detail-item">
                <div class="detail-label">Latura A</div>
                <div class="detail-value">${shape.a.toFixed(2)} cm</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Latura B</div>
                <div class="detail-value">${shape.b.toFixed(2)} cm</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Latura C</div>
                <div class="detail-value">${shape.c.toFixed(2)} cm</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Semiperimetru</div>
                <div class="detail-value">${(shape.perimeter() / 2).toFixed(2)} cm</div>
            </div>
        `;
    } else if (shape.type === 'Poligon Regulat') {
        specificDetails = `
            <div class="detail-item">
                <div class="detail-label">Număr laturi</div>
                <div class="detail-value">${shape.sides}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Lungime latură</div>
                <div class="detail-value">${shape.sideLength.toFixed(2)} cm</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Unghi interior</div>
                <div class="detail-value">${((shape.sides - 2) * 180 / shape.sides).toFixed(1)}°</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Unghi exterior</div>
                <div class="detail-value">${(360 / shape.sides).toFixed(1)}°</div>
            </div>
        `;
    }
    
    detailsCard.innerHTML = `
        <div class="details-content">
            <div class="shape-header">
                <div class="shape-icon" style="background: ${shape.color};">
                    ${getShapeIcon(shape.type)}
                </div>
                <div>
                    <h3 style="color: ${shape.color};">${shape.type}</h3>
                    <small style="color: var(--gray-color);">ID: ${shape.id.substring(0, 8)}...</small>
                </div>
            </div>
            
            <div class="details-grid">
                <div class="detail-item">
                    <div class="detail-label">Arie</div>
                    <div class="detail-value">${shape.area().toFixed(2)} cm²</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Perimetru</div>
                    <div class="detail-value">${shape.perimeter().toFixed(2)} cm</div>
                </div>
                
                ${specificDetails}
                
                <div class="detail-item">
                    <div class="detail-label">Culoare</div>
                    <div class="detail-value">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 24px; height: 24px; background: ${shape.color}; border-radius: 4px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
                            <code>${shape.color}</code>
                        </div>
                    </div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-label">Creat la</div>
                    <div class="detail-value">${shape.createdAt.toLocaleString('ro-RO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</div>
                </div>
            </div>
            
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e9ecef;">
                <button class="btn btn-secondary" onclick="deleteShape('${shape.id}')" style="padding: 8px 16px;">
                    <i class="fas fa-trash"></i> Șterge această formă
                </button>
            </div>
        </div>
    `;
}

function selectShape(id) {
    calculator.selectShape(id);
    updateDetails(); // ADĂUGAT: Actualizează detaliile imediat!
}

function deleteShape(id, event) {
    if (event) event.stopPropagation();
    
    if (calculator.removeShape(id)) {
        showNotification('Formă ștearsă cu succes!', 'success');
    }
}

function toggleGrid() {
    calculator.showGrid = !calculator.showGrid;
    const btn = event.target.closest('.btn-control');
    if (btn) {
        btn.classList.toggle('active', calculator.showGrid);
        btn.innerHTML = calculator.showGrid ? 
            '<i class="fas fa-th"></i> Grid ON' : 
            '<i class="fas fa-th"></i> Grid OFF';
    }
}

function exportData() {
    const data = calculator.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `date-geometrice-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Date exportate cu succes!', 'success');
}

function getShapeIcon(type) {
    const icons = {
        'Cerc': '●',
        'Dreptunghi': '■',
        'Triunghi': '▲',
        'Poligon Regulat': '⬢'
    };
    return icons[type] || '◇';
}

// Notificări
function showNotification(message, type = 'info') {
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.animation = 'slideIn 0.3s ease';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Modal help
function showHelp() {
    const modal = document.getElementById('help-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeHelp() {
    const modal = document.getElementById('help-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}
function debugDetails() {
    console.log('=== DEBUG DETAILS ===');
    console.log('1. Element details-card:', document.getElementById('details-card'));
    console.log('2. Calculator shapes:', calculator.shapes.length);
    console.log('3. Selected shape:', calculator.selectedShape);
    console.log('4. Is updateDetails function defined?', typeof updateDetails);
    
    if (calculator.selectedShape) {
        console.log('5. Selected shape details:', {
            type: calculator.selectedShape.type,
            id: calculator.selectedShape.id,
            area: calculator.selectedShape.area(),
            color: calculator.selectedShape.color
        });
    }
    
    // Forțează update
    updateDetails();
}
// Initialize app
document.addEventListener('DOMContentLoaded', initApp);

// Event listeners pentru modal
window.addEventListener('click', function(event) {
    const modal = document.getElementById('help-modal');
    if (event.target === modal) {
        closeHelp();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeHelp();
    }
});

// Make functions global
window.addCircle = addCircle;
window.addRectangle = addRectangle;
window.addTriangle = addTriangle;
window.addPolygon = addPolygon;
window.addRandomShape = addRandomShape;
window.clearAllShapes = clearAllShapes;
window.selectShape = selectShape;
window.deleteShape = deleteShape;
window.toggleGrid = toggleGrid;
window.exportData = exportData;
window.showHelp = showHelp;
window.closeHelp = closeHelp;
window.updateUI = updateUI;