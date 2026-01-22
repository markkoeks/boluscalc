const elements = {
    currentBg: document.getElementById('currentBg'),
    carbs: document.getElementById('carbs'),
    targetBg: document.getElementById('targetBg'),
    isf: document.getElementById('isf'),
    carbRatio: document.getElementById('carbRatio'),
    resultsSection: document.getElementById('resultsSection')
};

const outputs = {
    carb: document.getElementById('outCarb'),
    corr: document.getElementById('outCorr'),
    total: document.getElementById('outTotal'),
    rounded: document.getElementById('outRounded')
};

// YNAB-style Math Evaluator
function solve(str) {
    if (!str || typeof str !== 'string') return 0;
    try {
        // Sanitize: allow numbers and + - * / . ( )
        const clean = str.replace(/[^-()\d/*+.]/g, '');
        if (!clean) return 0;
        // Evaluate the string
        const result = Function(`'use strict'; return (${clean})`)();
        return isFinite(result) ? result : 0;
    } catch (e) {
        return 0; // Return 0 while the user is still typing (e.g., "10+")
    }
}

function calculate() {
    const bg = solve(elements.currentBg.value);
    const carbs = solve(elements.carbs.value);
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

// Handle "Enter" key to finalize math (YNAB behavior)
[elements.currentBg, elements.carbs].forEach(el => {
    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const finalValue = solve(el.value);
            el.value = finalValue > 0 ? finalValue.toFixed(1) : '';
            el.blur(); // Hide keyboard
            calculate();
        }
    });
});

// Real-time calculation as you type
document.body.addEventListener('input', (e) => {
    if (['targetBg', 'isf', 'carbRatio'].includes(e.target.id)) {
        localStorage.setItem(e.target.id, e.target.value);
    }
    calculate();
});

window.addEventListener('load', () => {
    elements.targetBg.value = localStorage.getItem('targetBg') || 5.5;
    elements.isf.value = localStorage.getItem('isf') || 2.0;
    elements.carbRatio.value = localStorage.getItem('carbRatio') || 10;
    calculate();
});

document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Clear everything?')) {
        localStorage.clear();
        location.reload();
    }
});
