let y0 = 0
let x0 = 0;
let a = 0;
let b = 1;
let h = 0.2;
let id = 0;

function myfunc(x,y) {
    return (Math.sin(2 * x) / 2) - y * Math.cos(x);
}

function checkFunc(x) {
    return Math.sin(x) + Math.pow(Math.E, -Math.sin(x)) - 1;
}

function buildMesh(){
    let arr = [];
    let curr_x = 0;
    for (let i = 0; i <= (b - a) / h; i++) {
        curr_x = i * h;
        arr.push(curr_x);
    }
    console.log(arr);
    return arr;
}

function euler() {
    reset();
    let mesh = buildMesh();
    for (let i = 0; i < mesh.length; i++) {
        y0 = y0 + h * myfunc(mesh[i], y0);
        appendRow(createRow(mesh[i], y0, y0 - checkFunc(mesh[i])));
        console.log(y0-checkFunc(mesh[i]));
    }
}

function eulerKoshi() {
    reset();
    let mesh = buildMesh();
    appendRow(createRow(mesh[0], y0, y0 - checkFunc(mesh[0])));
    for (let i = 1; i < mesh.length; i++) {
        k1 = myfunc(mesh[i - 1], y0);
        k2 = myfunc(mesh[i - 1] + h, y0 + h * k1);
        y0 = y0 + h/2 * (k1 + k2);
        appendRow(createRow(mesh[i], y0, y0 - checkFunc(mesh[i])));
        console.log(y0-checkFunc(mesh[i]));
    }
}

function rungeKutta() {
    reset();
    let mesh = buildMesh();
    appendRow(createRow(mesh[0], y0, y0 - checkFunc(mesh[0])));
    for (let i = 1; i < mesh.length; i++) {
        let k1 = myfunc(mesh[i - 1], y0);
        let k2 = myfunc(mesh[i - 1] + h/2, y0 + h/2 * k1);
        let k3 = myfunc(mesh[i - 1] + h/2, y0 + h/2 * k2);
        let k4 = myfunc(mesh[i - 1] + h, y0 + h * k3);
        y0 = y0 + h/6 * (k1 + 2 * k2 + 2 * k3 + k4);
        appendRow(createRow(mesh[i], y0, y0 - checkFunc(mesh[i])));
    }
}

function createRow(x, y, r) {
    const template = document.querySelector("#data-row-template");
    const row = template.content.cloneNode(true);
    var tds = row.querySelectorAll("td");
    tds[0].textContent = x;
    tds[1].textContent = y;
    tds[2].textContent = r;
    id = id + 1;
    row.querySelector("tr").id = `${id}`;
    return row;
}

function createEmpty() {
    const template = document.querySelector("#no-data-row-template");
    return template.content.cloneNode(true);
}

function appendRow(row) {
    const tbody = document.querySelector("#table-body");
    const rows = tbody.querySelectorAll("tr");
    if (rows.length !== 0) {
        if (rows[0].id === "no-data-row") {
            tbody.querySelector("tr").remove();
        }
    }
    tbody.appendChild(row);
}

function reset() {
    y0 = 0;
    x0 = 0;
    a = 0;
    b = 1;
    h = 0.2;
    const tbody = document.querySelector("#table-body");
    const rows = tbody.querySelectorAll("tr");
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    tbody.appendChild(createEmpty());
}

function onPageLoad() {
    appendRow(createEmpty());
    const eulerBtn = document.querySelector("#euler");
    eulerBtn.addEventListener("click", euler);
    const eulerKoshiBtn = document.querySelector("#eulerKoshi");
    eulerKoshiBtn.addEventListener("click", eulerKoshi);
    const rungeBtn = document.querySelector("#runge");
    rungeBtn.addEventListener("click", rungeKutta);
    console.log("page loaded");
    const clr = document.querySelector("#clearButton");
    clr.addEventListener("click", reset);
    const engage = document.querySelector("#engage");
    engage.addEventListener("click", applyChanges);
}

function applyChanges() {
    const xEl = document.querySelector("#x");
    const yEl = document.querySelector("#y");
    const hEl = document.querySelector("#h");
    x0 = xEl.textContent;
    y0 = yEl.textContent;
    h = hEl.textContent;
    console.log(h);
}

window.addEventListener("load", onPageLoad);