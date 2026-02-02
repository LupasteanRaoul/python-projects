# 📐 Geometry Calculator Pro

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![HTML5](https://img.shields.io/badge/HTML5-E34F26-orange)
![CSS3](https://img.shields.io/badge/CSS3-1572B6-blue)
![Canvas](https://img.shields.io/badge/HTML5_Canvas-000000)

An interactive geometric calculator with 2D visualization for geometric shapes and real-time calculations.

## 🌐 Live Demo
[**View Live Application**](https://lupasteanraoul.github.io/python-projects/polygon-calculator/)

## 🚀 Features

### 📐 Geometric Calculation
- ✅ **4 Shape Types**: Circle, Rectangle/Square, Triangle, Regular Polygon
- ✅ **Automatic Calculation**: Area, perimeter, and specific properties
- ✅ **Data Validation**: Automatic shape validity checks
- ✅ **Precise Formulas**: According to mathematical standards

### 🎨 Interactive Visualization
- ✅ **2D Canvas**: Real-time shape drawing
- ✅ **Adjustable Grid**: With coordinate axes
- ✅ **Unique Colors**: Each shape gets a distinct color
- ✅ **Interaction**: Click to select shapes
- ✅ **Labels**: Information displayed on each shape

### 📊 Analysis & Statistics
- ✅ **Total Statistics**: Total area, total perimeter, shape count
- ✅ **Distribution**: Chart for shape types
- ✅ **Extreme Shapes**: Largest/smallest shape
- ✅ **Complete History**: All actions recorded

### 💾 Data Management
- ✅ **Persistence**: Automatic localStorage saving
- ✅ **Export/Import**: JSON format for backup
- ✅ **Demo Sets**: Predefined data for testing
- ✅ **Clear**: Easy shape management

## 📁 Project Structure

polygon-calculator/
├── index.html # Main application page
├── style.css # CSS styles
├── script.js # Main application logic
├── geometry_calculator.js # Geometric calculation library
├── README.md # Documentation
└── .gitignore # Git ignored files

## 🛠️ Technologies Used

- **HTML5 Canvas** - 2D visualization
- **JavaScript ES6+** - Application logic
- **CSS3** - Modern styling with Grid and Flexbox
- **Font Awesome** - Icons
- **Toastr.js** - Notifications
- **LocalStorage API** - Local persistence

## 📚 Implemented Formulas

### Circle
- **Area**: A = π × r²
- **Circumference**: C = 2 × π × r
- **Diameter**: d = 2 × r

### Rectangle/Square
- **Area**: A = L × W
- **Perimeter**: P = 2 × (L + W)
- **Diagonal**: d = √(L² + W²)

### Triangle
- **Area (Heron)**: A = √[s(s-a)(s-b)(s-c)]
- **Semiperimeter**: s = (a+b+c)/2
- **Validation**: a + b > c, a + c > b, b + c > a
- **Types**: Equilateral, Isosceles, Right, Scalene

### Regular Polygon
- **Area**: A = (n × s²) / [4 × tan(π/n)]
- **Perimeter**: P = n × s
- **Interior Angle**: U = (n-2) × 180° / n
- **Apothem**: a = s / [2 × tan(π/n)]

## 🎮 How to Use

### 1. Add Shapes
1. Click on a shape button in the left sidebar
2. Fill dimensions in the appearing form
3. Click "Add" or press Enter

### 2. Interact with Shapes
- **Click a shape** in visualization to select it
- **Click a card** in shape list for details
- **Delete button** to remove a specific shape

### 3. Manage Data
- **Export**: Save all data in JSON format
- **Import**: Load previously saved data
- **Clear All**: Remove all shapes at once
- **Demo Set**: Load predefined test data

### 4. Customize Visualization
- **Toggle Grid**: Show/hide grid
- **Toggle Labels**: Show/hide labels
- **Center**: Reset visualization

## 🔧 Installation & Running

### Run Locally
1. **Clone the repository:**
```bash
git clone https://github.com/LupasteanRaoul/python-projects.git
cd python-projects/polygon-calculator
Open in browser:

Simply open index.html in your browser

Or use a local server: python -m http.server 8000

Quick Start
Open the application

Click on a shape type

Enter dimensions

View real-time calculations

Explore statistics

🏗️ Architecture
Core Components
Geometry Calculator: Mathematical calculations

Canvas Renderer: 2D shape visualization

Data Manager: Local storage handling

UI Controller: User interface management

Data Structure
{
  shapes: [
    {
      type: "circle",
      dimensions: { radius: 10 },
      properties: { area: 314.16, circumference: 62.83 },
      color: "#FF5733",
      position: { x: 100, y: 100 }
    }
  ],
  settings: {
    showGrid: true,
    showLabels: true,
    lastSave: "2024-02-01T12:00:00Z"
  }
}
🤝 Contributing
Fork the repository

Create feature branch (git checkout -b feature/amazing)

Commit changes (git commit -m 'Add amazing feature')

Push to branch (git push origin feature/amazing)

Open Pull Request

📝 License
MIT License - see LICENSE file for details.

🙏 Acknowledgments
Mathematics community for formulas

Font Awesome for icons

GitHub for hosting

Open source tools for development

🔗 Related Projects
Hash Table Visualizer

ISBN Validator

Budget Tracker

Educational tool for learning geometry and interactive visualization.