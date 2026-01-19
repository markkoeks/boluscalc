const inputs = ['currentBg', 'carbs', 'targetBg', 'isf', 'carbRatio'];
const elements = {};
inputs.forEach(id => elements[id] = document.getElementById(id));

const outputs = {
    carb: document.getElementById('outCarb'),
    corr: document.getElementById('outCorr'),
    total: document.getElementById('outTotal'),
    rounded: document.getElementById('outRounded')
};

// Load saved settings
window.addEventListener('load', () => {
    elements.targetBg.value = localStorage.getItem('targetBg') || 5.5;
    elements.isf.value = localStorage.getItem('isf') || 2.0;
    elements.carbRatio.value = localStorage.getItem('carbRatio') || 10;
    calculate();
});

// Listen for any input change
document.body.addEventListener('input', (e) => {
    if (['targetBg', 'isf', 'carbRatio'].includes(e.target.id)) {
        localStorage.setItem(e.target.id, e.target.value);
    }
    calculate();
});

const resetBtn = document.getElementById('resetBtn');

resetBtn.addEventListener('click', () => {
    if (confirm('Clear all settings and inputs?')) {
        // Clear LocalStorage
        localStorage.clear();
        
        // Clear Inputs
        elements.currentBg.value = '';
        elements.carbs.value = '';
        
        // Reset Settings to Defaults
        elements.targetBg.value = 5.5;
        elements.isf.value = 2.0;
        elements.carbRatio.value = 10;
        
        // Refresh Calculations
        calculate();
        
        // Return focus to top
        elements.currentBg.focus();
    }
});

function calculate() {
    const bg = parseFloat(elements.currentBg.value) || 0;
    const carbs = parseFloat(elements.carbs.value) || 0;
    const target = parseFloat(elements.targetBg.value) || 0;
    const isf = parseFloat(elements.isf.value) || 1; // Avoid div by zero
    const ratio = parseFloat(elements.carbRatio.value) || 1;

    // Carb Bolus
    const carbBolus = carbs / ratio;
    
    // Correction Bolus (logic: if current <= target, correction is 0)
    const correctionBolus = bg > target ? (bg - target) / isf : 0;
    
    const totalBolus = carbBolus + correctionBolus;
    const roundedBolus = Math.round(totalBolus * 2) / 2;

    // Display
    outputs.carb.textContent = carbBolus.toFixed(2);
    outputs.corr.textContent = correctionBolus.toFixed(2);
    outputs.total.textContent = totalBolus.toFixed(2);
    outputs.rounded.textContent = roundedBolus.toFixed(1);
}

// ... existing element references ...

// Carb Pad Logic
let carbTally = 0;
let tallyHistory = [];

const tallyDisplay = document.getElementById('tallyDisplay');
const customInput = document.getElementById('customCarb');

function updateTally(amount) {
    tallyHistory.push(carbTally);
    carbTally = Math.max(0, carbTally + amount);
    tallyDisplay.textContent = carbTally;
}

// Event Listeners for Quick Add
document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => updateTally(parseInt(btn.dataset.val)));
});

document.getElementById('addCustomBtn').addEventListener('click', () => {
    const val = parseInt(customInput.value) || 0;
    if (val !== 0) {
        updateTally(val);
        customInput.value = '';
    }
});

document.getElementById('undoCarb').addEventListener('click', () => {
    if (tallyHistory.length > 0) {
        carbTally = tallyHistory.pop();
        tallyDisplay.textContent = carbTally;
    }
});

document.getElementById('clearCarb').addEventListener('click', () => {
    tallyHistory.push(carbTally);
    carbTally = 0;
    tallyDisplay.textContent = 0;
});

document.getElementById('useTotalBtn').addEventListener('click', () => {
    elements.carbs.value = carbTally;
    calculate(); // Trigger main calculation
});

// Update reset logic to also clear tally
resetBtn.addEventListener('click', () => {
    if (confirm('Clear all settings, tally, and inputs?')) {
        localStorage.clear();
        elements.currentBg.value = '';
        elements.carbs.value = '';
        carbTally = 0;
        tallyHistory = [];
        tallyDisplay.textContent = 0;
        elements.targetBg.value = 5.5;
        elements.isf.value = 2.0;
        elements.carbRatio.value = 10;
        calculate();
        elements.currentBg.focus();
    }
});

const inputs = ['currentBg', 'carbs', 'targetBg', 'isf', 'carbRatio'];
const elements = {};
inputs.forEach(id => elements[id] = document.getElementById(id));

const outputs = {
    carb: document.getElementById('outCarb'),
    corr: document.getElementById('outCorr'),
    total: document.getElementById('outTotal'),
    rounded: document.getElementById('outRounded')
};

// --- Carb Pad Logic ---
let carbTally = 0;
let tallyHistory = [];
const tallyDisplay = document.getElementById('tallyDisplay');
const customInput = document.getElementById('customCarb');

function updateTally(amount) {
    tallyHistory.push(carbTally);
    carbTally = Math.max(0, carbTally + amount);
    tallyDisplay.textContent = carbTally;
}

document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => updateTally(parseInt(btn.dataset.val)));
});

document.getElementById('addCustomBtn').addEventListener('click', () => {
    const val = parseInt(customInput.value) || 0;
    if (val !== 0) {
        updateTally(val);
        customInput.value = '';
        customInput.blur(); // Close keyboard
    }
});

document.getElementById('undoCarb').addEventListener('click', () => {
    if (tallyHistory.length > 0) {
        carbTally = tallyHistory.pop();
        tallyDisplay.textContent = carbTally;
    }
});

document.getElementById('clearCarb').addEventListener('click', () => {
    tallyHistory.push(carbTally);
    carbTally = 0;
    tallyDisplay.textContent = 0;
});

// --- Use Tally & Scroll ---
document.getElementById('useTotalBtn').addEventListener('click', () => {
    elements.carbs.value = carbTally;
    calculate();
    
    // Scroll results into view smoothly
    const res = document.getElementById('resultsSection');
    res.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Brief visual highlight
    res.classList.add('highlight-results');
    setTimeout(() => res.classList.remove('highlight-results'), 1000);
});

// --- Main Calculation & Persistence ---
function calculate() {
    const bg = parseFloat(elements.currentBg.value) || 0;
    const carbs = parseFloat(elements.carbs.value) || 0;
    const target = parseFloat(elements.targetBg.value) || 0;
    const isf = parseFloat(elements.isf.value) || 1;
    const ratio = parseFloat(elements.carbRatio.value) || 1;

    const carbBolus = carbs / ratio;
    const correctionBolus = bg > target ? (bg - target) / isf : 0;
    const totalBolus = carbBolus + correctionBolus;

    outputs.carb.textContent = carbBolus.toFixed(2);
    outputs.corr.textContent = correctionBolus.toFixed(2);
    outputs.total.textContent = totalBolus.toFixed(2);
    outputs.rounded.textContent = (Math.round(totalBolus * 2) / 2).toFixed(1);
}

// Event Listeners for settings persistence
document.body.addEventListener('input', (e) => {
    if (['targetBg', 'isf', 'carbRatio'].includes(e.target.id)) {
        localStorage.setItem(e.target.id, e.target.value);
    }
    calculate();
});

// Load saved settings on start
window.addEventListener('load', () => {
    elements.targetBg.value = localStorage.getItem('targetBg') || 5.5;
    elements.isf.value = localStorage.getItem('isf') || 2.0;
    elements.carbRatio.value = localStorage.getItem('carbRatio') || 10;
    calculate();
});
