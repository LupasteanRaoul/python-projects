# 📊 Hash Table Visualizer

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![HTML5](https://img.shields.io/badge/HTML5-E34F26-orange)
![CSS3](https://img.shields.io/badge/CSS3-1572B6-blue)
![License](https://img.shields.io/badge/License-MIT-green)

Interactive web application for visualizing hash table operations with real-time feedback.

## ✨ Features

- **🔍 Interactive Operations** - Insert, search, and delete key-value pairs
- **📈 Real-time Statistics** - Load factor, collisions, bucket distribution
- **🎨 Visual Feedback** - Color-coded table visualization
- **⚡ Automatic Rehashing** - Triggers when load factor exceeds 0.7
- **📱 Responsive Design** - Works on all devices

## 🚀 Live Demo

[**View Live Demo**](https://lupasteanraoul.github.io/python-projects/hash-table/)

## 🛠️ Technologies

- **JavaScript (ES6+)** - Core logic
- **HTML5 & CSS3** - Interface and styling
- **Font Awesome** - Icons
- **GitHub Pages** - Hosting

## 📊 How It Works

### Hash Function
```javascript
_hash(key) {
    let hash = 0;
    const prime = 31;
    for (let i = 0; i < key.length; i++) {
        hash = (hash * prime + key.charCodeAt(i)) % this.size;
    }
    return hash;
}
Load Factor Management
Ideal: 0.5 - 0.7

Auto Rehash: > 0.7

Goal: Maintain O(1) operations

📁 Project Structure

hash-table/
├── index.html          # Main interface
├── style.css           # Styling
├── hash_table.js       # HashTable class
├── script.js           # UI logic
└── README.md           # Documentation
# Clone repository
git clone https://github.com/LupasteanRaoul/python-projects.git

# Navigate to project
cd python-projects/hash-table

# Open in browser
open index.html
🤝 Contributing
Fork the repository

Create feature branch (git checkout -b feature/amazing)

Commit changes (git commit -m 'Add amazing feature')

Push to branch (git push origin feature/amazing)

Open Pull Request

📝 License
MIT License - see LICENSE file.

🙏 Credits
Font Awesome for icons

GitHub for hosting

Open source community

Educational tool for understanding data structures and algorithms.