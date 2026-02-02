# 📚 ISBN Validator Pro

![ISBN](https://img.shields.io/badge/ISBN-Validator-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![HTML5](https://img.shields.io/badge/HTML5-E34F26-orange)
![CSS3](https://img.shields.io/badge/CSS3-1572B6-blue)

A comprehensive web tool for validating, generating, and converting ISBN codes with detailed verification steps.

## 🌐 Live Demo
[**View Live Application**](https://lupasteanraoul.github.io/python-projects/isbn-validator/)

## 🚀 Features

### 📋 Validation
- ✅ Validate ISBN-10 and ISBN-13 codes
- ✅ Automatic type detection
- ✅ Clean formatted display
- ✅ Prefix and country information
- ✅ Complete operation history

### 🔧 Generation
- ✅ Generate ISBN-10 check digit
- ✅ Display fully formatted ISBN
- ✅ Quick clipboard copy

### 🔄 Conversion
- ✅ Convert ISBN-10 → ISBN-13
- ✅ Pre-validation check
- ✅ Step-by-step process display

### 🧪 Testing
- ✅ Predefined examples (valid and invalid)
- ✅ Automatic testing of all examples
- ✅ Barcode scanning simulation

## 📁 Project Structure
isbn-validator/
├── index.html # Main application page
├── style.css # CSS styles
├── script.js # Application logic
├── isbn_validator.js # ISBN validation library
├── README.md # Documentation
└── .gitignore # Git ignored files


## 🛠️ Technologies

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with Grid and Flexbox
- **JavaScript ES6** - Application logic
- **Font Awesome** - Icons
- **Toastr** - Notifications
- **LocalStorage** - Local persistence

## 📚 What is ISBN?

ISBN (International Standard Book Number) is a unique numeric identifier for books, used internationally.

### ISBN Types:
- **ISBN-10**: 10 characters (digits 0-9 or X for 10)
- **ISBN-13**: 13 characters (digits only)

### ISBN-13 Structure:
978 - 0 - 306 - 40615 - 7
│    │   │     │      └─ Check digit
│    │   │     └─ Title number
│    │   └─ Publisher prefix
│    └─ Language/region prefix
└─ Product prefix (978 for books)

## 🔧 Implemented Algorithms

### ISBN-10 Validation
```javascript
total = sum(i * digit_i) for i=1..10
valid = (total % 11 === 0)

ISBN-13 Validation
total = sum(digit_i * (i % 2 === 0 ? 3 : 1)) for i=1..13
valid = (total % 10 === 0)
🏃‍♂️ Quick Start
# Clone repository
git clone https://github.com/LupasteanRaoul/python-projects.git

# Navigate to project
cd python-projects/isbn-validator

# Open in browser
open index.html

📱 How to Use
Validate: Enter ISBN code in the input field

Generate: Click "Generate Check Digit" for ISBN-10

Convert: Convert ISBN-10 to ISBN-13

Test: Use predefined examples for quick testing

🤝 Contributing
Fork the repository

Create your feature branch (git checkout -b feature/amazing)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing)

Open a Pull Request

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
International ISBN Agency for standards

Font Awesome for icons

GitHub for hosting

Open source community for tools and inspiration

Educational tool for understanding ISBN standards and validation algorithms.