function updateRadioButtons(id) {
    let element = document.getElementById(id);
    let value = Number(element.value);
    for (let button of element.parentElement.querySelectorAll(".dream-button")) {
        if (Number(button.value) === value || Number(button.innerHTML) === value) {
            button.classList.add("selected");
        } else {
            button.classList.remove("selected");
        }
    }
}

function clickRadioButton(id, value) {
    let element = document.getElementById(id);
    for (let button of element.parentElement.querySelectorAll(".dream-button")) {
        if (Number(button.value) === value || Number(button.innerHTML) === value) {
            button.click();
        }
    }
}

function getRadius() {
    return Number(document.getElementById("form:radius").value);
}

function getCoordX() {
    return Number(document.getElementById("form:coordX").value);
}

function setCoordX(x) {
    clickRadioButton("form:coordX", x);
}

function getCoordY() {
    return Number(document.getElementById("form:coordY").value);
}

function setCoordY(y) {
    let el = document.getElementById("form:coordY");
    el.value = String(y);
    el.onchange(undefined);
}

function coordsToScreen(c) {
    let r = getRadius();
    return {x: c.x / r * 127.3 + 160, y: (-c.y) / r * 127.3 + 160};
}

function coordsFromScreen(c) {
    let r = getRadius();
    return {x: (c.x - 160) / 127.3 * r, y: (160 - c.y) / 127.3 * r};
}

function setElementCoords(el, c) {
    let coords = coordsToScreen(c);
    el.style.left = coords.x + "px";
    el.style.top = coords.y + "px";
}

function clampCoords(c) {
    return {
        x: Math.max(-4, Math.min(4, Math.round(c.x))),
        y: Math.max(-2.99999976158, Math.min(2.99999976158, Math.round(c.y * 1000) / 1000))
    };
}

function resetMapPoint() {
    if (document.getElementById("map-container").matches(":hover"))
        return;
    setElementCoords(document.getElementById("point"), { x: getCoordX(), y: getCoordY() });
    setElementCoords(document.getElementById("cursor"), { x: 100, y: 100 });
}

function redrawMapPoints() {
    let container = document.getElementById("points");
    container.innerHTML = "";

    let count = 0;

    for (let point of document.querySelectorAll("tbody tr")) {
        let x = Number(point.querySelector("td:nth-child(3)").innerHTML.trim());
        let y = Number(point.querySelector("td:nth-child(4)").innerHTML.trim());
        let isHit = point.querySelector("td:nth-child(6)").innerHTML.trim() === "Попадание";
        let newPoint = document.createElement("div");
        setElementCoords(newPoint, {x, y})
        newPoint.className = "point";
        newPoint.style.opacity = (100 - count * 12.5) + "%";
        newPoint.style.borderColor = isHit ? "green" : "red";
        container.appendChild(newPoint);
        count += 1;
        if (count >= 8) break;
    }
}

function updateMapImage() {
    let radius = getRadius().toFixed(1);
    for (let image of document.querySelectorAll(".map")) {
        image.style.display = image.src.includes(radius) ? "block" : "none";
    }
}

function setupMapListeners() {
    let map = document.getElementById("map-container");

    map.addEventListener("mousemove", (e) => {
        let rect = map.getBoundingClientRect();
        let coords = coordsFromScreen({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });

        setElementCoords(document.getElementById("point"), clampCoords(coords));
        setElementCoords(document.getElementById("cursor"), coords);
    });

    map.addEventListener("click", (e) => {
        let rect = map.getBoundingClientRect();
        let coords = clampCoords(coordsFromScreen({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }));

        setCoordY(coords.y);
        setCoordX(coords.x);
        document.getElementById("form:submitButton").click();
    });

    map.addEventListener("mouseleave", resetMapPoint);
}

function updateForm() {
    updateRadioButtons("form:radius");
    updateRadioButtons("form:coordX");
    resetMapPoint();
    redrawMapPoints();
    updateMapImage();
}

window.addEventListener("DOMContentLoaded", () => {
    updateForm();
    setupMapListeners();
})