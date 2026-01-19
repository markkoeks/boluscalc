const elements = {
    currentBg: document.getElementById('currentBg'),
    carbs: document.getElementById('carbs'),
    targetBg: document.getElementById('targetBg'),
    isf: document.getElementById('isf'),
    carbRatio: document.getElementById('carbRatio'),
    tallyDisplay: document.getElementById('tallyDisplay'),
    customCarb: document.getElementById('customCarb'),
    resultsSection: document.getElementById('resultsSection')
};

const outputs = {
    carb: document.getElementById('outCarb'),
    corr: document.getElementById('outCorr'),
    total: document.getElementById('outTotal'),
    rounded: document.getElementById('outRounded')
};

let carbTally = 0;
let tallyHistory = [];

// The "Magic" function that calculates math inside the input fields
function solve(str) {
    if (!str) return 0;
    try {
        const clean = str.replace(/[^-()\d/*+.]/g, '');
        return Function(`'use strict'; return (${clean})`)() || 0;
    } catch (e) { return 0; }
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

// --- Listeners ---
window.addEventListener('load', () => {
    elements.targetBg.value = localStorage.getItem('targetBg') || 5.5;
    elements.isf.value = localStorage.getItem('isf') || 2.0;
    elements.carbRatio.value = localStorage.getItem('carbRatio') || 10;
    calculate();
});

document.body.addEventListener('input', (e) => {
    if (['targetBg', 'isf', 'carbRatio'].includes(e.target.id)) {
        localStorage.setItem(e.target.id, e.target.value);
    }
    calculate();
});

document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        tallyHistory.push(carbTally);
        carbTally = Math.max(0, carbTally + parseInt(btn.dataset.val));
        elements.tallyDisplay.textContent = carbTally;
    });
});

document.getElementById('addCustomBtn').addEventListener('click', () => {
    const val = parseInt(elements.customCarb.value) || 0;
    if (val !== 0) {
        tallyHistory.push(carbTally);
        carbTally += val;
        elements.tallyDisplay.textContent = carbTally;
        elements.customCarb.value = '';
    }
});

document.getElementById('undoCarb').addEventListener('click', () => {
    if (tallyHistory.length > 0) {
        carbTally = tallyHistory.pop();
        elements.tallyDisplay.textContent = carbTally;
    }
});

document.getElementById('clearCarb').addEventListener('click', () => {
    tallyHistory.push(carbTally);
    carbTally = 0;
    elements.tallyDisplay.textContent = 0;
});

document.getElementById('useTotalBtn').addEventListener('click', () => {
    elements.carbs.value = carbTally;
    calculate();
    elements.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Reset everything?')) {
        localStorage.clear();
        location.reload();
    }
});
