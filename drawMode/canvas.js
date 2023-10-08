let mainCanvas = document.getElementById("mainCanvas"),
    backCanvas = document.getElementById("backCanvas"),
    cursorCanvas = document.getElementById("cursorCanvas"),
    baseSize = Math.max(mainCanvas.width/25, mainCanvas.height/25);
    pencil = {shape: drawCircle, color: "black"};

// 1. KEEP CANVAS SAME SIZE AS PARENT
function resizeCanvas(){
    let parent = document.getElementById("mainPage");
    
    mainCanvas.setAttribute("width", parent.offsetWidth);
    mainCanvas.setAttribute("height", parent.offsetHeight);
    cursorCanvas.setAttribute("width", parent.offsetWidth);
    cursorCanvas.setAttribute("height", parent.offsetHeight);
    backCanvas.setAttribute("width", parent.offsetWidth);
    backCanvas.setAttribute("height", parent.offsetHeight);
    
    // RESET PENCIL SIZE
    baseSize = Math.max(mainCanvas.width/25, mainCanvas.height/25);
}
window.addEventListener("load", () => {
    resizeCanvas();
    document.documentElement.style.setProperty('--scrollbar', (window.innerWidth - document.documentElement.clientWidth) + "px"); // CALCULATE SCROLLBAR WIDTH
    resizeCanvas();
});
window.addEventListener("resize", () => {
    resizeCanvas();
    document.documentElement.style.setProperty('--scrollbar', (window.innerWidth - document.documentElement.clientWidth) + "px"); // CALCULATE SCROLLBAR WIDTH
});

// 2. DETECT MOUSECLICK ON CURSOR CANVAS
let drawing = false,
    currentCanvas = mainCanvas;

cursorCanvas.addEventListener("mousedown", (e) => {
    let mouseX = e.clientX - mainCanvas.getBoundingClientRect().left,
        mouseY = e.clientY - mainCanvas.getBoundingClientRect().top;
        
    if (drawMode){
        drawing = true;
        pencil.shape(currentCanvas, mouseX, mouseY);
    }
});
cursorCanvas.addEventListener("touchstart", (e) => {
    let mouseX = e.touches[0].pageX - mainCanvas.getBoundingClientRect().left,
        mouseY = e.touches[0].pageY - mainCanvas.getBoundingClientRect().top;
        
    if (drawMode){
        drawing = true;
        pencil.shape(currentCanvas, mouseX, mouseY);
    }
    console.log("touching");
    console.log(mouseX);
});
cursorCanvas.addEventListener('mousemove', (e) => {
    let mouseX = e.clientX - mainCanvas.getBoundingClientRect().left,
        mouseY = e.clientY - mainCanvas.getBoundingClientRect().top;
    
    if (drawing){
        pencil.shape(currentCanvas, mouseX, mouseY);
    }
});
cursorCanvas.addEventListener('touchmove', (e) => {
    let mouseX = e.touches[0].pageX - mainCanvas.getBoundingClientRect().left,
        mouseY = e.touches[0].pageY - mainCanvas.getBoundingClientRect().top;
    
    if (drawing){
        pencil.shape(currentCanvas, mouseX, mouseY);
        e.preventDefault();
        e.stopPropagation();
    }
});
document.addEventListener('mouseup', () => {
    drawing = false;
});
document.addEventListener('touchend', () => {
    drawing = false;
}, { passive: false });

// 3. DRAW FUNCTIONS
function drawPencil(mouseX, mouseY){
    let ctx = cursorCanvas.getContext("2d");
    
    ctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    pencil.shape(cursorCanvas, mouseX, mouseY);
}
document.addEventListener('mousemove', (e) => {
    let mouseX = e.clientX - mainCanvas.getBoundingClientRect().left,
        mouseY = e.clientY - mainCanvas.getBoundingClientRect().top;
    
    if(drawMode){
        drawPencil(mouseX, mouseY);
    }
});
function drawCircle(canvas, mouseX, mouseY){
    let ctx = canvas.getContext("2d"),
        radiusMod = 0.15 + circlePos*0.7;
    
    ctx.fillStyle = pencil.color;
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, baseSize*radiusMod, 0, Math.PI*2);
    ctx.fill();
}
function drawSquare(canvas, mouseX, mouseY){
    let ctx = canvas.getContext("2d"),
        radiusMod = 0.25 + squarePos*1.25;
    
    ctx.fillStyle = pencil.color;
    ctx.beginPath();
    ctx.rect(mouseX - baseSize*0.5*radiusMod, mouseY - baseSize*0.5*radiusMod, baseSize*radiusMod, baseSize*radiusMod);
    ctx.fill(); 
}
function drawDiamond(canvas, mouseX, mouseY){
    let ctx = canvas.getContext("2d"),
        radiusMod = 0.15 + diamondPos*0.7;
     
    ctx.fillStyle = pencil.color;
    ctx.beginPath();
    ctx.moveTo(mouseX - baseSize*radiusMod, mouseY);
    ctx.lineTo(mouseX, mouseY - baseSize*radiusMod);
    ctx.lineTo(mouseX + baseSize*radiusMod, mouseY);
    ctx.lineTo(mouseX, mouseY + baseSize*radiusMod);
    ctx.lineTo(mouseX - baseSize*radiusMod, mouseY);
    ctx.fill();
}

// 4. CLEAR CANVAS
document.getElementById("clearCanvas").onclick = () => {
    let ctx = mainCanvas.getContext("2d");
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    
    ctx = backCanvas.getContext("2d");
    ctx.clearRect(0, 0, backCanvas.width, backCanvas.height);
};

// 5. SWITCH CONTEXT
document.getElementById("switchContext").addEventListener("click", () => {
    if (currentCanvas === mainCanvas){
        currentCanvas = backCanvas;
        document.getElementById("switchContext").innerHTML = "switch to foreground";
    } else if (currentCanvas === backCanvas){
        currentCanvas = mainCanvas;
        document.getElementById("switchContext").innerHTML = "switch to background";
    }
    
});


