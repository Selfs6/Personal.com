let zIndexCounter = 100;
const windows = document.querySelectorAll('.window');
const taskbar = document.getElementById('taskbarApps');

// Setup each window
windows.forEach((win, index) => {
    const windowId = win.dataset.windowId;
    const titleBar = win.querySelector('.title-bar');
    const controls = win.querySelectorAll('.title-bar-controls button');

    makeDraggable(win, titleBar);
    bringToFront(win);

    // Add taskbar button
    const taskbarBtn = document.createElement('button');
    taskbarBtn.textContent = win.querySelector('.title-bar-text').textContent;
    taskbarBtn.dataset.windowId = windowId;
    taskbarBtn.addEventListener('click', () => {
        if (win.classList.contains('hidden')) {
            win.classList.remove('hidden');
            bringToFront(win);
        } else {
            win.classList.add('hidden');
        }
    });
    taskbar.appendChild(taskbarBtn);

    // Minimize
    controls[0].addEventListener('click', () => {
        win.classList.add('hidden');
    });

    // Maximize
    let isMaximized = false;
    let prevStyle = {};
    controls[1].addEventListener('click', () => {
        if (!isMaximized) {
            prevStyle = {
                top: win.style.top,
                left: win.style.left,
                width: win.style.width,
                height: win.style.height,
            };
            Object.assign(win.style, {
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
            });
            isMaximized = true;
        } else {
            Object.assign(win.style, prevStyle);
            isMaximized = false;
        }
        bringToFront(win);
    });

    // Close
    controls[2].addEventListener('click', () => {
        win.classList.add('hidden');
    });

    // Bring to front when clicked
    win.addEventListener('mousedown', () => bringToFront(win));
});

// Bring to front
function bringToFront(win) {
    win.style.zIndex = zIndexCounter++;
}

// Draggable windows
function makeDraggable(elmnt, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        bringToFront(elmnt);
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Clock
function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').textContent = `${h}:${m}`;
}
setInterval(updateClock, 1000);
updateClock();

// Start menu toggle
document.querySelector('.start-button').addEventListener('click', () => {
    document.getElementById('startMenu').classList.toggle('hidden');
});
// Utility: create new draggable, resizable window
function createWindow({ title, contentHTML, appId, resizable = true }) {
    const win = document.createElement('div');
    win.classList.add('window');
    win.dataset.windowId = appId;
    win.style.top = `${50 + Math.random() * 100}px`;
    win.style.left = `${50 + Math.random() * 100}px`;
    win.style.width = '350px';
    win.style.height = '250px';
    win.style.display = 'flex';
    win.style.flexDirection = 'column';

    win.innerHTML = `
    <div class="title-bar">
      <div class="title-bar-text">${title}</div>
      <div class="title-bar-controls">
        <button aria-label="Minimize"></button>
        <button aria-label="Maximize"></button>
        <button aria-label="Close"></button>
      </div>
    </div>
    <div class="window-body" style="height: calc(100% - 28px); display: flex; flex-direction: column; overflow: hidden;">
      ${contentHTML}
    </div>
  `;
    document.getElementById('desktop').appendChild(win);


    const titleBar = win.querySelector('.title-bar');
    const controls = win.querySelectorAll('.title-bar-controls button');

    makeDraggable(win, titleBar);
    if (resizable) makeResizable(win); // Only apply resizable if flag is true
    bringToFront(win);

    // Taskbar button setup...
    const taskbarBtn = document.createElement('button');
    taskbarBtn.textContent = title;
    taskbarBtn.dataset.windowId = appId;
    taskbarBtn.addEventListener('click', () => {
        if (win.classList.contains('hidden')) {
            win.classList.remove('hidden');
            bringToFront(win);
        } else {
            win.classList.add('hidden');
        }
    });
    taskbar.appendChild(taskbarBtn);

    // Minimize
    controls[0].addEventListener('click', () => win.classList.add('hidden'));

    // Maximize
    let isMaximized = false;
    let prevStyle = {};
    controls[1].addEventListener('click', () => {
        if (!isMaximized) {
            prevStyle = {
                top: win.style.top,
                left: win.style.left,
                width: win.style.width,
                height: win.style.height,
            };
            Object.assign(win.style, {
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
            });
            isMaximized = true;
        } else {
            Object.assign(win.style, prevStyle);
            isMaximized = false;
        }
        bringToFront(win);
    });

    // Close
    controls[2].addEventListener('click', () => {
        win.remove();
        taskbarBtn.remove();
    });

    win.addEventListener('mousedown', () => bringToFront(win));
}

// Example: Paint
document.getElementById('openPaintBtn').addEventListener('click', () => {
    createWindow({
        title: 'Paint',
        appId: `paint-${Date.now()}`,
        contentHTML: `
  <div class="window-body paint-body">
    <div class="paint-sidebar">
      <button title="Pencil" id="toolPencil">✏️</button>
      <button title="Eraser" id="toolEraser">🩹</button>
      <button title="Clear" id="toolClear">🧹</button>
    </div>
    <div class="paint-main">
      <canvas id="paintCanvas" width="400" height="300"></canvas>
      <div class="color-palette" id="colorPalette"></div>
    </div>
  </div>
    `
    });
    document.getElementById('startMenu').classList.add('hidden');
});
// ========== Paint App Logic ==========
document.addEventListener("DOMContentLoaded", () => {
    const paintCanvas = document.getElementById("paintCanvas");
    const ctx = paintCanvas.getContext("2d");
    let drawing = false;
    let erasing = false;
    let currentColor = "#000000";

    const colorPalette = document.getElementById("colorPalette");
    const colors = [
        "#000000", "#808080", "#800000", "#808000", "#008000", "#008080",
        "#000080", "#800080", "#C0C0C0", "#FF0000", "#FFFF00", "#00FF00",
        "#00FFFF", "#0000FF", "#FF00FF", "#FFFFFF", "#A52A2A", "#FFA500",
        "#FFD700", "#ADFF2F", "#20B2AA", "#40E0D0", "#6495ED", "#9932CC",
        "#DC143C", "#FF69B4", "#B0C4DE", "#D3D3D3"
    ];

    colors.forEach(color => {
        const btn = document.createElement("button");
        btn.style.backgroundColor = color;
        btn.addEventListener("click", () => {
            currentColor = color;
            erasing = false;
        });
        colorPalette.appendChild(btn);
    });

    // Tool buttons
    const pencilBtn = document.getElementById("toolPencil");
    const eraserBtn = document.getElementById("toolEraser");
    const clearBtn = document.getElementById("toolClear");

    pencilBtn.addEventListener("click", () => erasing = false);
    eraserBtn.addEventListener("click", () => erasing = true);
    clearBtn.addEventListener("click", () => ctx.clearRect(0, 0, paintCanvas.width, paintCanvas.height));

    // Drawing logic
    paintCanvas.addEventListener("mousedown", () => drawing = true);
    paintCanvas.addEventListener("mouseup", () => drawing = false);
    paintCanvas.addEventListener("mouseleave", () => drawing = false);
    paintCanvas.addEventListener("mousemove", (e) => {
        if (!drawing) return;
        const rect = paintCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx.fillStyle = erasing ? "#ffffff" : currentColor;
        ctx.fillRect(x, y, 2, 2);
    });

    /* CALC SCRIPTS LOGIC  */
    const display = document.getElementById('calcDisplay');
    let expression = "";

    // Sound setup
    const clickSound = new Audio("https://www.soundjay.com/button/beep-07.wav");

    document.querySelectorAll('#calculator button').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.textContent;
            clickSound.currentTime = 0;
            clickSound.play();

            if (val === 'C') {
                expression = "";
            } else if (val === '±') {
                // Try to flip sign of last number
                const match = expression.match(/(-?\d+(\.\d+)?)(?!.*\d)/);
                if (match) {
                    const num = parseFloat(match[0]) * -1;
                    expression = expression.slice(0, match.index) + num;
                }
            } else if (val === '=') {
                try {
                    expression = eval(expression).toString();
                } catch {
                    expression = 'Error';
                }
            } else if (val === '%') {
                try {
                    // Match format like: "number operator number"
                    const match = expression.match(/(-?\d+(?:\.\d+)?)([+\-*\/])(-?\d+(?:\.\d+)?)$/);
                    if (match) {
                        const base = parseFloat(match[1]);
                        const operator = match[2];
                        const perc = parseFloat(match[3]);
                        let result = perc;

                        if (operator === '+' || operator === '-') {
                            result = base * perc / 100;
                        } else if (operator === '*') {
                            result = perc / 100;
                        } else if (operator === '/') {
                            result = perc / 100; // Same behavior as `*`
                        }

                        // Replace the original percentage expression with calculated value
                        expression = expression.replace(/(-?\d+(?:\.\d+)?)([+\-*\/])(-?\d+(?:\.\d+)?)$/, `${match[1]}${operator}${result}`);
                    }
                } catch {
                    expression = 'Error';
                }
            } else {
                expression += val;
            }

            display.value = expression;
        });
    });
}, 10);





//notepad app 
document.getElementById('openNotepadBtn').addEventListener('click', () => {
    createWindow({
        title: 'Notepad',
        appId: `notepad-${Date.now()}`,
        contentHTML: `
      <div class="notepad-content">
        <textarea class="notepad-textarea">Welcome to Notepad!</textarea>
      </div>
    `
    });
    document.getElementById('startMenu').classList.add('hidden');
});



//resizing support 
function makeResizable(elmnt) {
    elmnt.style.resize = 'both';
    elmnt.style.overflow = 'auto';
}

document.getElementById('openCalcBtn').addEventListener('click', () => {
    createWindow({
        title: 'Calculator',
        appId: `calculator-${Date.now()}`,
        resizable: false,
        contentHTML: `
      <div id="calculator" class="calc-container">
    <input id="calcDisplay" class="calc-display" readonly />

    <div class="calc-buttons">
    <button>C</button><button>±</button><button>%</button><button>/</button>
    <button>7</button><button>8</button><button>9</button><button>*</button>
    <button>4</button><button>5</button><button>6</button><button>-</button>
    <button>1</button><button>2</button><button>3</button><button>+</button>
    <button>0</button><button>.</button><button>=</button>
    </div>
    </div>

    `
    });
    document.getElementById('startMenu').classList.add('hidden');


});
