# quicksort_visualizer.py
import time
import random
from typing import List, Tuple
import matplotlib.pyplot as plt
import numpy as np

class QuicksortVisualizer:
    def __init__(self, data: List[int] = None):
        self.data = data if data else self.generate_random_data(15)
        self.original_data = self.data.copy()
        self.steps = []  # Pentru a salva fiecare pas
        self.comparisons = 0
        self.swaps = 0
    
    def generate_random_data(self, n: int) -> List[int]:
        """Generează date aleatoare"""
        return [random.randint(1, 100) for _ in range(n)]
    
    def partition(self, arr: List[int], low: int, high: int) -> int:
        """Partiționează array-ul și returnează indexul pivotului"""
        pivot = arr[high]
        i = low - 1
        
        for j in range(low, high):
            self.comparisons += 1
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
                self.swaps += 1
                # Salvează starea după fiecare swap
                self.steps.append((arr.copy(), i, j, high, "swap"))
        
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        self.swaps += 1
        self.steps.append((arr.copy(), i + 1, high, high, "final_swap"))
        
        return i + 1
    
    def quicksort(self, arr: List[int], low: int, high: int):
        """Algoritmul Quicksort recursiv"""
        if low < high:
            # Salvează starea curentă
            self.steps.append((arr.copy(), low, high, -1, "call"))
            
            pi = self.partition(arr, low, high)
            
            # Sortează recursiv
            self.quicksort(arr, low, pi - 1)
            self.quicksort(arr, pi + 1, high)
    
    def sort(self):
        """Sortează datele și salvează pașii"""
        self.steps.clear()
        self.comparisons = 0
        self.swaps = 0
        self.data = self.original_data.copy()
        
        self.quicksort(self.data, 0, len(self.data) - 1)
        self.steps.append((self.data.copy(), -1, -1, -1, "final"))
    
    def visualize_text(self, delay: float = 0.5):
        """Vizualizare text în consolă"""
        print("\n" + "="*60)
        print("QUICKSORT VISUALIZER - Text Mode")
        print("="*60)
        print(f"Date inițiale: {self.original_data}")
        print("\nÎncepe sortarea...\n")
        
        # Reset pentru a recolta pașii din nou
        self.sort()
        
        for step_num, (arr, i, j, pivot_idx, step_type) in enumerate(self.steps):
            print(f"\nPas #{step_num + 1}: {step_type.upper()}")
            print("-"*40)
            
            # Afișează array-ul cu evidențiere
            for idx, val in enumerate(arr):
                if step_type == "swap" and idx in [i, j]:
                    print(f"[{val:3}]", end=" ")  # Elemente schimbate
                elif step_type == "final_swap" and idx == i:
                    print(f"<{val:3}>", end=" ")  # Pivot la poziția finală
                elif idx == pivot_idx and pivot_idx != -1:
                    print(f"({val:3})", end=" ")  # Pivot curent
                else:
                    print(f" {val:3} ", end=" ")
            
            if step_type in ["swap", "final_swap"]:
                if i != -1 and j != -1:
                    print(f"\nSwap: {arr[j]} ↔ {arr[i]}")
            
            print()
            time.sleep(delay)
        
        print("\n" + "="*60)
        print("SORTARE FINALIZATĂ!")
        print(f"Date sortate: {self.data}")
        print(f"Comparații: {self.comparisons}")
        print(f"Swap-uri: {self.swaps}")
        print("="*60)
    
    def visualize_graphical(self):
        """Vizualizare grafică cu matplotlib"""
        if not self.steps:
            self.sort()
        
        fig, ax = plt.subplots(figsize=(12, 8))
        plt.ion()
        
        for step_num, (arr, i, j, pivot_idx, step_type) in enumerate(self.steps):
            ax.clear()
            
            # Creează bara de culori
            colors = ['lightblue'] * len(arr)
            
            if step_type == "swap" and i != -1 and j != -1:
                colors[i] = 'red'
                colors[j] = 'green'
            elif step_type == "final_swap" and i != -1:
                colors[i] = 'orange'  # Pivot la poziția finală
            elif pivot_idx != -1:
                colors[pivot_idx] = 'yellow'  # Pivot curent
            
            # Creează bara
            bars = ax.bar(range(len(arr)), arr, color=colors, edgecolor='black')
            
            # Setări grafic
            ax.set_xlabel('Index', fontsize=12)
            ax.set_ylabel('Valoare', fontsize=12)
            ax.set_title(f'Quicksort - Pas #{step_num + 1}: {step_type}', fontsize=14, fontweight='bold')
            ax.set_xticks(range(len(arr)))
            ax.set_xticklabels([str(x) for x in range(len(arr))])
            
            # Adaugă valori pe bare
            for bar, val in zip(bars, arr):
                height = bar.get_height()
                ax.text(bar.get_x() + bar.get_width()/2., height,
                       f'{val}', ha='center', va='bottom')
            
            # Legenda
            legend_elements = [
                plt.Rectangle((0,0),1,1,fc='lightblue', edgecolor='black', label='Normal'),
                plt.Rectangle((0,0),1,1,fc='yellow', edgecolor='black', label='Pivot'),
                plt.Rectangle((0,0),1,1,fc='red', edgecolor='black', label='Swap 1'),
                plt.Rectangle((0,0),1,1,fc='green', edgecolor='black', label='Swap 2'),
                plt.Rectangle((0,0),1,1,fc='orange', edgecolor='black', label='Pivot Final')
            ]
            ax.legend(handles=legend_elements, loc='upper right')
            
            plt.tight_layout()
            plt.draw()
            plt.pause(0.8)
        
        plt.ioff()
        plt.show()
    
    def benchmark(self, sizes: List[int] = [100, 500, 1000, 5000]):
        """Benchmark pentru diferite dimensiuni"""
        print("\n" + "="*60)
        print("QUICKSORT BENCHMARK")
        print("="*60)
        print(f"{'Dimensiune':<12} {'Timp (s)':<12} {'Comparații':<12} {'Swap-uri':<12}")
        print("-"*60)
        
        for size in sizes:
            # Generează date noi pentru fiecare dimensiune
            test_data = [random.randint(1, 10000) for _ in range(size)]
            visualizer = QuicksortVisualizer(test_data)
            
            # Măsoară timpul
            start_time = time.time()
            visualizer.sort()
            end_time = time.time()
            
            elapsed = end_time - start_time
            
            print(f"{size:<12} {elapsed:<12.6f} {visualizer.comparisons:<12} {visualizer.swaps:<12}")
    
    def interactive_demo(self):
        """Demo interactiv"""
        while True:
            print("\n" + "="*60)
            print("QUICKSORT VISUALIZER - Meniu Principal")
            print("="*60)
            print("1. Generează date noi")
            print("2. Vizualizează în consolă")
            print("3. Vizualizează grafic")
            print("4. Benchmark performanță")
            print("5. Afișează date curente")
            print("6. Ieșire")
            
            choice = input("\nAlege opțiunea: ")
            
            if choice == '1':
                n = int(input("Număr elemente: "))
                self.data = self.generate_random_data(n)
                self.original_data = self.data.copy()
                print(f"✓ Date generate: {self.data[:10]}..." if n > 10 else f"✓ Date generate: {self.data}")
            
            elif choice == '2':
                speed = float(input("Viteză (delay între pași, recomandat 0.3-1.0): "))
                self.visualize_text(speed)
            
            elif choice == '3':
                print("Se deschide vizualizarea grafică...")
                self.visualize_graphical()
            
            elif choice == '4':
                self.benchmark()
            
            elif choice == '5':
                print(f"\nDate curente ({len(self.data)} elemente):")
                print(self.data)
                print(f"\nSortat: {sorted(self.data)}")
            
            elif choice == '6':
                print("La revedere!")
                break

if __name__ == "__main__":
    visualizer = QuicksortVisualizer()
    visualizer.interactive_demo()