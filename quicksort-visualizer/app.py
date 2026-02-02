from flask import Flask, render_template, request, jsonify
import random
import json

app = Flask(__name__)

class QuicksortWeb:
    def __init__(self):
        self.steps = []
        self.comparisons = 0
        self.swaps = 0
    
    def generate_random_data(self, n, min_val=1, max_val=100):
        """Generează date aleatoare"""
        return [random.randint(min_val, max_val) for _ in range(n)]
    
    def partition(self, arr, low, high):
        """Partiționează array-ul și returnează indexul pivotului"""
        pivot = arr[high]
        i = low - 1
        
        for j in range(low, high):
            self.comparisons += 1
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
                self.swaps += 1
                # Salvează starea pentru animație
                self.steps.append({
                    'array': arr.copy(),
                    'type': 'swap',
                    'indices': [i, j],
                    'pivot_index': high,
                    'comparisons': self.comparisons,
                    'swaps': self.swaps
                })
        
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        self.swaps += 1
        self.steps.append({
            'array': arr.copy(),
            'type': 'pivot_placement',
            'pivot_final_index': i + 1,
            'pivot_index': high,
            'comparisons': self.comparisons,
            'swaps': self.swaps
        })
        
        return i + 1
    
    def quicksort(self, arr, low, high):
        """Algoritmul Quicksort recursiv"""
        if low < high:
            self.steps.append({
                'array': arr.copy(),
                'type': 'partition_call',
                'range': [low, high],
                'comparisons': self.comparisons,
                'swaps': self.swaps
            })
            
            pi = self.partition(arr, low, high)
            
            self.quicksort(arr, low, pi - 1)
            self.quicksort(arr, pi + 1, high)
    
    def sort(self, data):
        """Sortează datele și returnează pașii"""
        self.steps = []
        self.comparisons = 0
        self.swaps = 0
        
        arr = data.copy()
        self.steps.append({
            'array': arr.copy(),
            'type': 'initial',
            'comparisons': 0,
            'swaps': 0
        })
        
        self.quicksort(arr, 0, len(arr) - 1)
        
        self.steps.append({
            'array': arr.copy(),
            'type': 'final',
            'comparisons': self.comparisons,
            'swaps': self.swaps
        })
        
        return {
            'steps': self.steps,
            'original': data,
            'sorted': arr,
            'total_steps': len(self.steps),
            'total_comparisons': self.comparisons,
            'total_swaps': self.swaps
        }

# Instanțiem obiectul global
sorter = QuicksortWeb()

@app.route('/')
def index():
    """Pagina principală"""
    return render_template('index.html')

@app.route('/generate', methods=['GET'])
def generate_data():
    """Generează date aleatoare"""
    n = request.args.get('n', default=15, type=int)
    min_val = request.args.get('min', default=1, type=int)
    max_val = request.args.get('max', default=100, type=int)
    
    data = sorter.generate_random_data(n, min_val, max_val)
    
    return jsonify({
        'data': data,
        'n': n,
        'range': [min_val, max_val]
    })

@app.route('/sort', methods=['POST'])
def sort_data():
    """Sortează datele și returnează pașii pentru animație"""
    data = request.json.get('data', [])
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    result = sorter.sort(data)
    
    return jsonify(result)

@app.route('/presets', methods=['GET'])
def get_presets():
    """Returnează presetări pentru demo"""
    presets = {
        'small': [5, 2, 8, 1, 9, 3, 7, 4, 6, 10],
        'medium': [64, 34, 25, 12, 22, 11, 90, 88, 76, 54, 33, 21],
        'reverse': [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        'nearly_sorted': [1, 2, 3, 4, 6, 5, 7, 8, 9, 10],
        'duplicates': [5, 3, 5, 1, 3, 2, 5, 4, 3, 1]
    }
    
    return jsonify(presets)

if __name__ == '__main__':
    app.run(debug=True, port=5001)