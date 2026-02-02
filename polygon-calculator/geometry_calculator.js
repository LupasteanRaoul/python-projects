// geometry_calculator.js
class Shape {
    constructor(type, color) {
        this.type = type;
        this.id = Date.now() + Math.random().toString(36).substr(2, 9);
        this.color = color || this.getRandomColor();
        this.createdAt = new Date();
    }

    getRandomColor() {
        const colors = ['#4361ee', '#3a0ca3', '#4cc9f0', '#f72585', '#f8961e', '#2a9d8f'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    area() { return 0; }
    perimeter() { return 0; }
    draw(ctx, x, y, scale) {}

    getInfo() {
        return {
            id: this.id,
            type: this.type,
            area: this.area(),
            perimeter: this.perimeter(),
            color: this.color,
            createdAt: this.createdAt.toLocaleTimeString('ro-RO')
        };
    }
}

class Circle extends Shape {
    constructor(radius) {
        super('Cerc');
        this.radius = parseFloat(radius);
    }

    area() { return Math.PI * this.radius * this.radius; }
    perimeter() { return 2 * Math.PI * this.radius; }

    draw(ctx, x, y, scale) {
        const scaledRadius = this.radius * scale;
        ctx.beginPath();
        ctx.arc(x, y, scaledRadius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + '20';
        ctx.fill();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

class Rectangle extends Shape {
    constructor(length, width) {
        super('Dreptunghi');
        this.length = parseFloat(length);
        this.width = parseFloat(width);
    }

    area() { return this.length * this.width; }
    perimeter() { return 2 * (this.length + this.width); }
    isSquare() { return Math.abs(this.length - this.width) < 0.001; }

    draw(ctx, x, y, scale) {
        const halfWidth = (this.width * scale) / 2;
        const halfHeight = (this.length * scale) / 2;
        
        ctx.beginPath();
        ctx.rect(x - halfWidth, y - halfHeight, this.width * scale, this.length * scale);
        ctx.fillStyle = this.color + '20';
        ctx.fill();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

class Triangle extends Shape {
    constructor(a, b, c) {
        super('Triunghi');
        this.a = parseFloat(a);
        this.b = parseFloat(b);
        this.c = parseFloat(c);
    }

    area() {
        const s = (this.a + this.b + this.c) / 2;
        return Math.sqrt(s * (s - this.a) * (s - this.b) * (s - this.c));
    }

    perimeter() { return this.a + this.b + this.c; }
    isValid() { return (this.a + this.b > this.c) && (this.a + this.c > this.b) && (this.b + this.c > this.a); }

    draw(ctx, x, y, scale) {
        const height = (this.area() * 2) / this.a * scale;
        const base = this.a * scale;
        
        ctx.beginPath();
        ctx.moveTo(x - base/2, y + height/2);
        ctx.lineTo(x + base/2, y + height/2);
        ctx.lineTo(x, y - height/2);
        ctx.closePath();
        ctx.fillStyle = this.color + '20';
        ctx.fill();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

class Polygon extends Shape {
    constructor(sides, sideLength) {
        super('Poligon Regulat');
        this.sides = parseInt(sides);
        this.sideLength = parseFloat(sideLength);
    }

    area() {
        return (this.sides * this.sideLength * this.sideLength) / 
               (4 * Math.tan(Math.PI / this.sides));
    }

    perimeter() { return this.sides * this.sideLength; }

    draw(ctx, x, y, scale) {
        const radius = this.sideLength * scale / (2 * Math.sin(Math.PI / this.sides));
        
        ctx.beginPath();
        for (let i = 0; i <= this.sides; i++) {
            const angle = i * 2 * Math.PI / this.sides - Math.PI / 2;
            const px = x + radius * Math.cos(angle);
            const py = y + radius * Math.sin(angle);
            
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        
        ctx.fillStyle = this.color + '20';
        ctx.fill();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

class GeometryCalculator {
    constructor() {
        this.shapes = [];
        this.selectedShape = null;
        this.showGrid = true;
    }

    addShape(shape) {
        if (shape.type === 'Triunghi' && !shape.isValid()) {
            throw new Error('Triunghi invalid: suma a două laturi trebuie să fie mai mare decât a treia');
        }
        
        this.shapes.push(shape);
        return true;
    }

    removeShape(id) {
        const index = this.shapes.findIndex(s => s.id === id);
        if (index !== -1) {
            const shape = this.shapes.splice(index, 1)[0];
            if (this.selectedShape?.id === id) {
                this.selectedShape = null;
            }
            return true;
        }
        return false;
    }

    clearAll() {
        const count = this.shapes.length;
        this.shapes = [];
        this.selectedShape = null;
        return count;
    }

    selectShape(id) {
        this.selectedShape = this.shapes.find(s => s.id === id) || null;
    }

    getTotalArea() { return this.shapes.reduce((sum, shape) => sum + shape.area(), 0); }
    getTotalPerimeter() { return this.shapes.reduce((sum, shape) => sum + shape.perimeter(), 0); }
    getLargestShape() {
        if (this.shapes.length === 0) return null;
        return this.shapes.reduce((largest, current) => 
            current.area() > largest.area() ? current : largest
        );
    }

    drawAll(ctx, width, height) {
        ctx.clearRect(0, 0, width, height);
        
        if (this.showGrid) {
            this.drawGrid(ctx, width, height);
        }
        
        if (this.shapes.length === 0) {
            this.showCanvasPlaceholder(true);
            return;
        }
        
        this.showCanvasPlaceholder(false);
        
        const cols = Math.ceil(Math.sqrt(this.shapes.length));
        const rows = Math.ceil(this.shapes.length / cols);
        const cellWidth = width / cols;
        const cellHeight = height / rows;
        
        this.shapes.forEach((shape, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            const x = col * cellWidth + cellWidth / 2;
            const y = row * cellHeight + cellHeight / 2;
            
            let maxDimension = 0;
            if (shape.type === 'Cerc') maxDimension = shape.radius * 2;
            else if (shape.type === 'Dreptunghi') maxDimension = Math.max(shape.length, shape.width);
            else if (shape.type === 'Triunghi') maxDimension = Math.max(shape.a, shape.b, shape.c);
            else maxDimension = shape.sideLength * 2;
            
            const scale = Math.min(cellWidth, cellHeight) * 0.3 / maxDimension;
            
            shape.draw(ctx, x, y, scale);
            this.drawLabel(ctx, shape, x, y + cellHeight/2 - 10);
        });
    }

    drawGrid(ctx, width, height) {
        const gridSize = 50;
        const offsetX = width / 2 % gridSize;
        const offsetY = height / 2 % gridSize;
        
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;
        
        for (let x = offsetX; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        for (let y = offsetY; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }

    drawLabel(ctx, shape, x, y) {
        ctx.fillStyle = shape.color;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(shape.type, x, y - 5);
        ctx.font = '10px Arial';
        ctx.fillText(`A: ${shape.area().toFixed(1)} cm²`, x, y + 10);
    }

    showCanvasPlaceholder(show) {
        const placeholder = document.getElementById('canvas-placeholder');
        if (placeholder) {
            placeholder.style.display = show ? 'flex' : 'none';
        }
    }

    saveToStorage() {
        try {
            const data = {
                shapes: this.shapes.map(shape => ({
                    type: shape.type,
                    data: {
                        ...shape,
                        id: shape.id,
                        color: shape.color,
                        createdAt: shape.createdAt.toISOString()
                    }
                }))
            };
            localStorage.setItem('geometryCalculator', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('geometryCalculator');
            if (saved) {
                const data = JSON.parse(saved);
                
                data.shapes?.forEach(item => {
                    let shape;
                    switch(item.type) {
                        case 'Cerc':
                            shape = new Circle(item.data.radius);
                            break;
                        case 'Dreptunghi':
                            shape = new Rectangle(item.data.length, item.data.width);
                            break;
                        case 'Triunghi':
                            shape = new Triangle(item.data.a, item.data.b, item.data.c);
                            break;
                        case 'Poligon Regulat':
                            shape = new Polygon(item.data.sides, item.data.sideLength);
                            break;
                    }
                    if (shape) {
                        shape.id = item.data.id;
                        shape.color = item.data.color;
                        shape.createdAt = new Date(item.data.createdAt);
                        this.shapes.push(shape);
                    }
                });
                return true;
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
        return false;
    }

    exportData() {
        const data = {
            shapes: this.shapes.map(shape => shape.getInfo()),
            stats: {
                totalShapes: this.shapes.length,
                totalArea: this.getTotalArea(),
                totalPerimeter: this.getTotalPerimeter(),
                largestShape: this.getLargestShape()?.getInfo()
            },
            exportDate: new Date().toISOString()
        };
        
        return JSON.stringify(data, null, 2);
    }
}

// Export pentru script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Shape, Circle, Rectangle, Triangle, Polygon, GeometryCalculator };
}