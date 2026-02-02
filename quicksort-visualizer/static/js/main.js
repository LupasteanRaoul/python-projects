document.addEventListener('DOMContentLoaded', function() {
    // State variables
    let currentData = [];
    let sortSteps = [];
    let currentStep = 0;
    let isSorting = false;
    let isPaused = false;
    let animationInterval;
    let startTime;
    let totalComparisons = 0;
    let totalSwaps = 0;
    
    // DOM Elements
    const arraySizeInput = document.getElementById('arraySize');
    const sizeValueSpan = document.getElementById('sizeValue');
    const minValueInput = document.getElementById('minValue');
    const maxValueInput = document.getElementById('maxValue');
    const generateBtn = document.getElementById('generateBtn');
    const sortBtn = document.getElementById('sortBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const speedControl = document.getElementById('speedControl');
    const speedValueSpan = document.getElementById('speedValue');
    const stepCounter = document.getElementById('stepCounter');
    const comparisonCounter = document.getElementById('comparisonCounter');
    const swapCounter = document.getElementById('swapCounter');
    const timeCounter = document.getElementById('timeCounter');
    const arrayDisplay = document.getElementById('arrayDisplay');
    const prevStepBtn = document.getElementById('prevStep');
    const nextStepBtn = document.getElementById('nextStep');
    const currentStepInfo = document.getElementById('currentStepInfo');
    const operationType = document.getElementById('operationType');
    const activeIndices = document.getElementById('activeIndices');
    const pivotIndex = document.getElementById('pivotIndex');
    const currentArray = document.getElementById('currentArray');
    const presetButtons = document.querySelectorAll('.preset-btn');
    
    // Initialize
    updateSizeDisplay();
    updateSpeedDisplay();
    generateRandomArray();
    
    // Event Listeners
    arraySizeInput.addEventListener('input', updateSizeDisplay);
    speedControl.addEventListener('input', updateSpeedDisplay);
    
    generateBtn.addEventListener('click', generateRandomArray);
    
    sortBtn.addEventListener('click', function() {
        if (!isSorting) {
            startSorting();
        }
    });
    
    pauseBtn.addEventListener('click', function() {
        if (isSorting) {
            if (isPaused) {
                resumeSorting();
            } else {
                pauseSorting();
            }
        }
    });
    
    resetBtn.addEventListener('click', resetVisualization);
    
    prevStepBtn.addEventListener('click', function() {
        if (currentStep > 0) {
            goToStep(currentStep - 1);
        }
    });
    
    nextStepBtn.addEventListener('click', function() {
        if (currentStep < sortSteps.length - 1) {
            goToStep(currentStep + 1);
        }
    });
    
    // Preset buttons
    presetButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const preset = this.dataset.preset;
            loadPreset(preset);
        });
    });
    
    // Functions
    function updateSizeDisplay() {
        sizeValueSpan.textContent = arraySizeInput.value;
    }
    
    function updateSpeedDisplay() {
        const speed = parseInt(speedControl.value);
        speedValueSpan.textContent = `${speed}ms`;
    }
    
    async function generateRandomArray() {
        const size = parseInt(arraySizeInput.value);
        const min = parseInt(minValueInput.value);
        const max = parseInt(maxValueInput.value);
        
        try {
            const response = await fetch(`/generate?n=${size}&min=${min}&max=${max}`);
            const data = await response.json();
            
            currentData = data.data;
            resetVisualization();
            renderArray(currentData);
        } catch (error) {
            console.error('Error generating array:', error);
            alert('Error generating random array');
        }
    }
    
    async function loadPreset(presetName) {
        try {
            const response = await fetch('/presets');
            const presets = await response.json();
            
            if (presets[presetName]) {
                currentData = presets[presetName];
                resetVisualization();
                renderArray(currentData);
                
                // Update size display for presets
                arraySizeInput.value = currentData.length;
                updateSizeDisplay();
            }
        } catch (error) {
            console.error('Error loading preset:', error);
        }
    }
    
    async function startSorting() {
        if (currentData.length === 0) {
            alert('Please generate or select data first');
            return;
        }
        
        try {
            const response = await fetch('/sort', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: currentData })
            });
            
            const result = await response.json();
            
            if (result.error) {
                alert(result.error);
                return;
            }
            
            sortSteps = result.steps;
            totalComparisons = result.total_comparisons;
            totalSwaps = result.total_swaps;
            
            isSorting = true;
            isPaused = false;
            currentStep = 0;
            
            // Update UI
            sortBtn.disabled = true;
            pauseBtn.disabled = false;
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pauză';
            resetBtn.disabled = true;
            prevStepBtn.disabled = true;
            nextStepBtn.disabled = true;
            
            // Start timer
            startTime = Date.now();
            updateTimer();
            
            // Start animation
            playAnimation();
            
        } catch (error) {
            console.error('Error starting sort:', error);
            alert('Error starting sort process');
        }
    }
    
    function playAnimation() {
        clearInterval(animationInterval);
        
        const speed = parseInt(speedControl.value);
        
        animationInterval = setInterval(() => {
            if (!isPaused) {
                if (currentStep < sortSteps.length) {
                    updateVisualization(currentStep);
                    currentStep++;
                    
                    if (currentStep === sortSteps.length) {
                        finishSorting();
                    }
                }
            }
        }, speed);
    }
    
    function pauseSorting() {
        isPaused = true;
        pauseBtn.innerHTML = '<i class="fas fa-play"></i> Continuă';
    }
    
    function resumeSorting() {
        isPaused = false;
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pauză';
    }
    
    function finishSorting() {
        clearInterval(animationInterval);
        isSorting = false;
        
        // Update UI
        sortBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = false;
        prevStepBtn.disabled = false;
        nextStepBtn.disabled = false;
        
        // Show completion message
        operationType.textContent = 'SORTARE COMPLETĂ!';
        activeIndices.textContent = '-';
        pivotIndex.textContent = '-';
        
        // Update final array
        if (sortSteps.length > 0) {
            currentArray.textContent = sortSteps[sortSteps.length - 1].array.join(', ');
        }
    }
    
    function resetVisualization() {
        clearInterval(animationInterval);
        
        isSorting = false;
        isPaused = false;
        currentStep = 0;
        sortSteps = [];
        
        // Reset UI
        sortBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = false;
        prevStepBtn.disabled = true;
        nextStepBtn.disabled = true;
        
        stepCounter.textContent = '0/0';
        comparisonCounter.textContent = '0';
        swapCounter.textContent = '0';
        timeCounter.textContent = '0.00s';
        
        operationType.textContent = '-';
        activeIndices.textContent = '-';
        pivotIndex.textContent = '-';
        currentArray.textContent = currentData.join(', ');
        
        renderArray(currentData);
    }
    
    function updateVisualization(stepIndex) {
        if (stepIndex >= sortSteps.length) return;
        
        const step = sortSteps[stepIndex];
        
        // Update counters
        stepCounter.textContent = `${stepIndex + 1}/${sortSteps.length}`;
        comparisonCounter.textContent = step.comparisons || 0;
        swapCounter.textContent = step.swaps || 0;
        
        // Update step info
        currentStepInfo.textContent = `Pas #${stepIndex + 1}`;
        operationType.textContent = getOperationName(step.type);
        activeIndices.textContent = step.indices ? `[${step.indices.join(', ')}]` : '-';
        pivotIndex.textContent = step.pivot_index !== undefined ? step.pivot_index.toString() : '-';
        currentArray.textContent = step.array.join(', ');
        
        // Render array with visualization
        renderArrayWithHighlights(step);
        
        // Enable/disable navigation buttons
        prevStepBtn.disabled = stepIndex === 0;
        nextStepBtn.disabled = stepIndex === sortSteps.length - 1;
    }
    
    function goToStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= sortSteps.length) return;
        
        currentStep = stepIndex;
        updateVisualization(currentStep);
    }
    
    function updateTimer() {
        if (!isSorting) return;
        
        const elapsed = (Date.now() - startTime) / 1000;
        timeCounter.textContent = elapsed.toFixed(2) + 's';
        
        setTimeout(updateTimer, 100);
    }
    
    function getOperationName(type) {
        const names = {
            'initial': 'Stare inițială',
            'partition_call': 'Apel partiționare',
            'swap': 'Swap elemente',
            'pivot_placement': 'Plasare pivot',
            'final': 'Sortare finalizată'
        };
        
        return names[type] || type;
    }
    
    function renderArray(array) {
        arrayDisplay.innerHTML = '';
        
        const maxValue = Math.max(...array);
        const containerHeight = arrayDisplay.clientHeight;
        
        array.forEach((value, index) => {
            const element = document.createElement('div');
            element.className = 'array-element';
            
            const barHeight = (value / maxValue) * (containerHeight - 60);
            
            element.innerHTML = `
                <div class="element-bar" style="height: ${barHeight}px; background: #4a90e2;"></div>
                <div class="element-value">${value}</div>
                <div class="element-index">${index}</div>
            `;
            
            arrayDisplay.appendChild(element);
        });
    }
    
    function renderArrayWithHighlights(step) {
        const array = step.array;
        const maxValue = Math.max(...array);
        const containerHeight = arrayDisplay.clientHeight;
        
        arrayDisplay.innerHTML = '';
        
        array.forEach((value, index) => {
            const element = document.createElement('div');
            element.className = 'array-element';
            
            const barHeight = (value / maxValue) * (containerHeight - 60);
            
            // Determine color based on step type
            let color = '#4a90e2'; // Default
            
            if (step.type === 'swap' && step.indices && step.indices.includes(index)) {
                color = '#ff4757'; // Swapping
            } else if (step.pivot_index === index) {
                color = '#ffd700'; // Pivot
            } else if (step.type === 'pivot_placement' && step.pivot_final_index === index) {
                color = '#2ed573'; // Pivot final position
            }
            
            element.innerHTML = `
                <div class="element-bar" style="height: ${barHeight}px; background: ${color};"></div>
                <div class="element-value">${value}</div>
                <div class="element-index">${index}</div>
            `;
            
            arrayDisplay.appendChild(element);
        });
    }
});