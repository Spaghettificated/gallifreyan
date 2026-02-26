
// var drawMode = null;
import {drawMode, setDrawMode, Modes} from "./placers.js"

const modeButtons = document.querySelectorAll('.mode-button');
modeButtons.forEach(b => {
    b.textContent += " ["
    b.textContent += b.dataset.keybind
    b.textContent += "]"
});
function setActive(btn) {
    modeButtons.forEach(b => {
        b.classList.remove('active');
        b.style.backgroundColor = '';
    });
    if (btn) {
        btn.classList.add('active');
        btn.style.backgroundColor = '#4CAF50';
        // drawMode = btn.dataset.mode;
        setDrawMode(btn.dataset.mode)
    } else {
        setDrawMode(null)
    }
}
modeButtons.forEach(btn => {
    btn.addEventListener('click', () => setActive(btn));
});
// default select first mode
if (modeButtons.length > 0) setActive(modeButtons[0]);
// Keyboard shortcuts: press 1,2,3 to activate modes
document.addEventListener('keydown', (e) => {
    const k = e.key;
    if (k >= '1' && k <= String(modeButtons.length)) {
        const idx = parseInt(k, 10) - 1;
        setActive(modeButtons[idx]);
    }
});