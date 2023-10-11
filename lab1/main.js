let selectedX = '1';
let selectedY = '0';
let selectedR = '3';

var xBoxes, rButtons, rText, yInput, lastY, canvas, historyDiv;
lastY = selectedY;

function syncValues() {
    for (const box of xBoxes)
        box.checked = box.value == selectedX;
    yInput.value = selectedY;
    rText.innerText = "R: " + selectedR;
}

function initCallbacks() {
    for (const xBox of xBoxes) {
        xBox.onclick = () => {
            selectedX = xBox.value;
            syncValues();
        }
    }

    for (const rButton of rButtons) {
        rButton.onclick = () => {
            selectedR = rButton.innerText;
            syncValues();
        }
    }

    yInput.addEventListener('keyup', () => {
        const oldVal = yInput.value;
        const hasMinus = oldVal.slice(0, 1) == "-";
        let newVal = Array.from(oldVal)
            .filter(t => "0123456789.".includes(t))
            .join("");

        newVal = hasMinus ? "-" + newVal : newVal;
        newVal = newVal.slice(0, 16);
        
        if (newVal!=5 && newVal>5 && (Math.abs(newVal - 5) < 0.0000000001)) newVal = 5;
        if (newVal!=-5 && newVal<5 && (Math.abs(newVal + 5) < 0.0000000001)) newVal = -5;
        if (newVal > 5) newVal = 5;
        if (newVal < -5) newVal = -5;

        yInput.value = newVal;
        selectedY = newVal;
    });

    document.getElementById("submit-button")
        .onclick = () => {
            if (selectedY=='-0') selectedY = '0'
            syncValues()
            if (/\d/.test(yInput.value)) {
                fetch("new_record.php", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                    body: JSON.stringify({ x: selectedX, y: selectedY, r: selectedR })
                }).then((_) => {
                    refreshHistory()
                });
            }
        };

    document.getElementById('clear-button')
        .onclick = () => {
            fetch("clear_history.php", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                }
            }).then((_) => {
                refreshHistory();
            });
        };
}

function refreshHistory() {
    fetch("request_history.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
    }).then((resp) => {
        return resp.json();
    }).then((resp) => {
        console.log(resp)
        tableHtml = '<table id="history_table" class="lined-table fixed-table"><tr><th>Данные</th><th>Время</th><th>Результат</th></tr>'
        for (record of resp.table) {
            tableHtml += `<tr><td>${record['data']}</td><td>${record['time']}</td><td>${record['success']}</td></tr>`
        }
        tableHtml += `<p>Время: ${resp['current_time']}</p> <br> <p>Время скрипта: ${resp['script_time']} сек</p>`
        historyDiv.innerHTML = tableHtml;
    });
}


function drawGraph() {
    const image = document.getElementById("graph-img");
    mainCtx.drawImage(image, 0, 0, mainCanvas.width, mainCanvas.height);
}

window.onload = () => {
    xBoxes = document.getElementsByClassName("x-box");
    rButtons = document.getElementsByClassName("z-button");
    rText = document.getElementById("r-text");
    yInput = document.getElementById("y-input");
    mainCanvas = document.getElementById("main-canvas");
    mainCtx = mainCanvas.getContext("2d");
    historyDiv = document.getElementById("history-div");

    initCallbacks();
    syncValues();
    drawGraph();
    refreshHistory();
};