let circleSlider = document.getElementById("circleSlider"),
    squareSlider = document.getElementById("squareSlider"),
    diamondSlider = document.getElementById("diamondSlider");

// 1. ASSIGN CANVAS SIZES
function assignSliderSizes(){
    circleSlider.setAttribute("width", circleSlider.parentElement.offsetWidth);
    circleSlider.setAttribute("height", circleSlider.parentElement.offsetHeight);
    squareSlider.setAttribute("width", squareSlider.parentElement.offsetWidth);
    squareSlider.setAttribute("height", squareSlider.parentElement.offsetHeight);
    diamondSlider.setAttribute("width", diamondSlider.parentElement.offsetWidth);
    diamondSlider.setAttribute("height", diamondSlider.parentElement.offsetHeight);
}
window.addEventListener("load", () => {
    assignSliderSizes();
    drawCircleSlider();
    drawSquareSlider();
    drawDiamondSlider();
});
window.addEventListener("resize", () => {
    assignSliderSizes();
    drawCircleSlider();
    drawSquareSlider();
    drawDiamondSlider();
});

// 2. DRAW SLIDERS
let minSize = 0.1,
    maxSize = 0.9;

function drawSlider(canvas){
    let ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = canvas.width*0.015;
    ctx.strokeStyle = "#5d5d5d";
    ctx.beginPath();
    ctx.moveTo(canvas.width*minSize, canvas.height*0.5);
    ctx.lineTo(canvas.width*maxSize, canvas.height*0.5);
    ctx.stroke();
}

// 3. DRAW SHAPES
let circlePos = 0.5,
    squarePos = 0.5,
    diamondPos = 0.5;

function drawCircleSlider(){
    let ctx = circleSlider.getContext("2d");
    drawSlider(circleSlider);
    
    let length = circleSlider.width*maxSize - circleSlider.width*minSize,
        xPos = length*circlePos + circleSlider.width*minSize,
        radiusMod = 0.5 + circlePos*0.30;
        
    ctx.beginPath();
    ctx.arc(xPos, circleSlider.height*0.5, circleSlider.height*0.5*radiusMod, 0, Math.PI*2);
    ctx.fillStyle = "black";
    ctx.fill();
}
function drawSquareSlider(){
    let ctx = squareSlider.getContext("2d");
    drawSlider(squareSlider);
    
    let length = squareSlider.width*maxSize - squareSlider.width*minSize,
        xPos = length*squarePos + squareSlider.width*minSize,
        radiusMod = 0.75 + squarePos*0.5;
    
    ctx.beginPath();
    ctx.rect(xPos - squareSlider.height*0.25*radiusMod, squareSlider.height*0.5 - squareSlider.height*0.25*radiusMod, squareSlider.height*0.5*radiusMod, squareSlider.height*0.5*radiusMod);
    ctx.fillStyle = "black";
    ctx.fill();
}
function drawDiamondSlider(){
    let ctx = diamondSlider.getContext("2d");
    drawSlider(diamondSlider);
    
    let length = diamondSlider.width*maxSize - diamondSlider.width*minSize,
        xPos = length*diamondPos + diamondSlider.width*minSize,
        radiusMod = 0.5 + diamondPos*0.30;
        
    ctx.beginPath();
    ctx.moveTo(xPos - diamondSlider.height*0.5*radiusMod, diamondSlider.height*0.5);
    ctx.lineTo(xPos, diamondSlider.height*0.5 - diamondSlider.height*0.5*radiusMod);
    ctx.lineTo(xPos + diamondSlider.height*0.5*radiusMod, diamondSlider.height*0.5);
    ctx.lineTo(xPos, diamondSlider.height*0.5 + diamondSlider.height*0.5*radiusMod);
    ctx.lineTo(xPos - diamondSlider.height*0.5*radiusMod, diamondSlider.height*0.5);
    ctx.fillStyle = "black";
    ctx.fill();
}

// 4. CLICK EVENTS
function updatePos(mouseX, canvas){
    let pos = (mouseX - canvas.width*minSize)/(canvas.width*maxSize - canvas.width*minSize);
    pos = Math.min(1, Math.max(0, pos));
    return pos;
}
function selectShapeActive(canvas){
    let shapers = document.getElementsByClassName("shaper");
    
    for (let shaper of shapers){
        shaper.classList.remove("active");
    }
    canvas.parentElement.classList.add("active");
}

let circleSliding = false;
circleSlider.addEventListener("mousedown", (e) => {
    let mouseX = e.clientX - circleSlider.getBoundingClientRect().left,
        mouseY = e.clientY - circleSlider.getBoundingClientRect().top;
    
    circleSliding = true;
    circlePos = updatePos(mouseX, circleSlider);
    drawCircleSlider();
    pencil.shape = drawCircle;
    selectShapeActive(circleSlider);
});
circleSlider.addEventListener("mousemove", (e) => {
    let mouseX = e.clientX - circleSlider.getBoundingClientRect().left,
        mouseY = e.clientY - circleSlider.getBoundingClientRect().top;
    
    if (circleSliding){
        circlePos = updatePos(mouseX, circleSlider);
        drawCircleSlider();
    }
});

let squareSliding = false;
squareSlider.addEventListener("mousedown", (e) => {
    let mouseX = e.clientX - squareSlider.getBoundingClientRect().left,
        mouseY = e.clientY - squareSlider.getBoundingClientRect().top;
    
    squareSliding = true;
    squarePos = updatePos(mouseX, squareSlider);
    drawSquareSlider();
    selectShapeActive(squareSlider);
    pencil.shape = drawSquare;
});
squareSlider.addEventListener("mousemove", (e) => {
    let mouseX = e.clientX - squareSlider.getBoundingClientRect().left,
        mouseY = e.clientY - squareSlider.getBoundingClientRect().top;
    
    if (squareSliding){
        squarePos = updatePos(mouseX, squareSlider);
        drawSquareSlider();
    }
});        
let diamondSliding = false;
diamondSlider.addEventListener("mousedown", (e) => {
    let mouseX = e.clientX - diamondSlider.getBoundingClientRect().left,
        mouseY = e.clientY - diamondSlider.getBoundingClientRect().top;
    
    diamondSliding = true;
    diamondPos = updatePos(mouseX, diamondSlider);
    drawDiamondSlider();
    selectShapeActive(diamondSlider);
    pencil.shape = drawDiamond;
});
diamondSlider.addEventListener("mousemove", (e) => {
    let mouseX = e.clientX - diamondSlider.getBoundingClientRect().left,
        mouseY = e.clientY - diamondSlider.getBoundingClientRect().top;
    
    if (diamondSliding){
        diamondPos = updatePos(mouseX, squareSlider);
        drawDiamondSlider();
    }
});        

document.addEventListener('mouseup', (e) => {
    circleSliding = false;
    squareSliding = false;
    diamondSliding = false;
});