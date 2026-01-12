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
