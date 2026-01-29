# polygon_calculator.py
import math
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import List, Tuple

class Shape(ABC):
    """Clasă abstractă pentru forme geometrice"""
    
    @abstractmethod
    def area(self) -> float:
        pass
    
    @abstractmethod
    def perimeter(self) -> float:
        pass
    
    @abstractmethod
    def display_info(self):
        pass

class Circle(Shape):
    def __init__(self, radius: float):
        if radius <= 0:
            raise ValueError("Raza trebuie să fie pozitivă")
        self.radius = radius
    
    def area(self) -> float:
        return math.pi * self.radius ** 2
    
    def perimeter(self) -> float:
        return 2 * math.pi * self.radius
    
    def display_info(self):
        print(f"\n● Cerc:")
        print(f"  Raza: {self.radius}")
        print(f"  Arie: {self.area():.2f}")
        print(f"  Circumferință: {self.perimeter():.2f}")

class Rectangle(Shape):
    def __init__(self, length: float, width: float):
        if length <= 0 or width <= 0:
            raise ValueError("Dimensiunile trebuie să fie pozitive")
        self.length = length
        self.width = width
    
    def area(self) -> float:
        return self.length * self.width
    
    def perimeter(self) -> float:
        return 2 * (self.length + self.width)
    
    def is_square(self) -> bool:
        return self.length == self.width
    
    def display_info(self):
        shape_type = "Pătrat" if self.is_square() else "Dreptunghi"
        print(f"\n■ {shape_type}:")
        print(f"  Lungime: {self.length}")
        print(f"  Lățime: {self.width}")
        print(f"  Arie: {self.area():.2f}")
        print(f"  Perimetru: {self.perimeter():.2f}")

class Triangle(Shape):
    def __init__(self, a: float, b: float, c: float):
        sides = [a, b, c]
        if any(side <= 0 for side in sides):
            raise ValueError("Laturile trebuie să fie pozitive")
        if not self.is_valid_triangle(a, b, c):
            raise ValueError("Laturile nu formează un triunghi valid")
        self.a = a
        self.b = b
        self.c = c
    
    @staticmethod
    def is_valid_triangle(a: float, b: float, c: float) -> bool:
        return (a + b > c) and (a + c > b) and (b + c > a)
    
    def area(self) -> float:
        # Formula lui Heron
        s = self.perimeter() / 2
        return math.sqrt(s * (s - self.a) * (s - self.b) * (s - self.c))
    
    def perimeter(self) -> float:
        return self.a + self.b + self.c
    
    def triangle_type(self) -> str:
        sides = [self.a, self.b, self.c]
        unique_sides = len(set(sides))
        
        if unique_sides == 1:
            return "Echilateral"
        elif unique_sides == 2:
            return "Isoscel"
        else:
            # Verifică dacă este triunghi dreptunghic
            sides_sorted = sorted(sides)
            a2, b2, c2 = [x**2 for x in sides_sorted]
            if abs(a2 + b2 - c2) < 1e-10:
                return "Dreptunghic"
            return "Oarecare"
    
    def display_info(self):
        print(f"\n▲ Triunghi:")
        print(f"  Laturi: {self.a}, {self.b}, {self.c}")
        print(f"  Tip: {self.triangle_type()}")
        print(f"  Arie: {self.area():.2f}")
        print(f"  Perimetru: {self.perimeter():.2f}")

class RegularPolygon(Shape):
    def __init__(self, n_sides: int, side_length: float):
        if n_sides < 3:
            raise ValueError("Poligonul trebuie să aibă cel puțin 3 laturi")
        if side_length <= 0:
            raise ValueError("Lungimea laturii trebuie să fie pozitivă")
        self.n_sides = n_sides
        self.side_length = side_length
    
    def area(self) -> float:
        # Arie pentru poligon regulat
        return (self.n_sides * self.side_length ** 2) / (4 * math.tan(math.pi / self.n_sides))
    
    def perimeter(self) -> float:
        return self.n_sides * self.side_length
    
    def interior_angle(self) -> float:
        return (self.n_sides - 2) * 180 / self.n_sides
    
    def display_info(self):
        names = {3: "Triunghi", 4: "Pătrat", 5: "Pentagon", 
                6: "Hexagon", 7: "Heptagon", 8: "Octogon"}
        name = names.get(self.n_sides, f"Poligon ({self.n_sides} laturi)")
        
        print(f"\n⬢ {name}:")
        print(f"  Număr laturi: {self.n_sides}")
        print(f"  Lungime latură: {self.side_length}")
        print(f"  Arie: {self.area():.2f}")
        print(f"  Perimetru: {self.perimeter():.2f}")
        print(f"  Unghi interior: {self.interior_angle():.1f}°")

class PolygonCalculator:
    def __init__(self):
        self.shapes = []
    
    def add_shape(self, shape: Shape):
        self.shapes.append(shape)
    
    def total_area(self) -> float:
        return sum(shape.area() for shape in self.shapes)
    
    def total_perimeter(self) -> float:
        return sum(shape.perimeter() for shape in self.shapes)
    
    def display_all(self):
        print("\n" + "="*50)
        print("POLYGON CALCULATOR - TOATE FORMETE")
        print("="*50)
        
        for i, shape in enumerate(self.shapes, 1):
            print(f"\nForma #{i}:")
            shape.display_info()
        
        if self.shapes:
            print("\n" + "-"*50)
            print(f"Arie totală: {self.total_area():.2f}")
            print(f"Perimetru total: {self.total_perimeter():.2f}")

# Interfață principală
def polygon_calculator_main():
    calculator = PolygonCalculator()
    
    while True:
        print("\n" + "="*50)
        print("📐 POLYGON CALCULATOR")
        print("="*50)
        print("1. Adaugă cerc")
        print("2. Adaugă dreptunghi/pătrat")
        print("3. Adaugă triunghi")
        print("4. Adaugă poligon regulat")
        print("5. Afișează toate formele")
        print("6. Calculează arie totală")
        print("7. Șterge toate formele")
        print("8. Ieșire")
        
        choice = input("\nAlege opțiunea: ")
        
        try:
            if choice == '1':
                radius = float(input("Raza cercului: "))
                circle = Circle(radius)
                calculator.add_shape(circle)
                print("✓ Cerc adăugat!")
            
            elif choice == '2':
                length = float(input("Lungime: "))
                width = float(input("Lățime: "))
                rectangle = Rectangle(length, width)
                calculator.add_shape(rectangle)
                print("✓ Formă adăugată!")
            
            elif choice == '3':
                a = float(input("Latura a: "))
                b = float(input("Latura b: "))
                c = float(input("Latura c: "))
                triangle = Triangle(a, b, c)
                calculator.add_shape(triangle)
                print("✓ Triunghi adăugat!")
            
            elif choice == '4':
                n_sides = int(input("Număr laturi (≥3): "))
                side_length = float(input("Lungime latură: "))
                polygon = RegularPolygon(n_sides, side_length)
                calculator.add_shape(polygon)
                print("✓ Poligon adăugat!")
            
            elif choice == '5':
                calculator.display_all()
            
            elif choice == '6':
                print(f"\nArie totală: {calculator.total_area():.2f}")
            
            elif choice == '7':
                calculator.shapes.clear()
                print("✓ Toate formele au fost șterse!")
            
            elif choice == '8':
                print("La revedere!")
                break
        
        except ValueError as e:
            print(f"❌ Eroare: {e}")

if __name__ == "__main__":
    polygon_calculator_main()