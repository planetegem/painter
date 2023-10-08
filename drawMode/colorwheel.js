let baseCanvas = document.getElementById("rgbwheel");
    wheel = {x: baseCanvas.width/2, 
             y: baseCanvas.width/2, 
             r: baseCanvas.width*0.5,
             outsideRgb: 0.95, insideRgb: 0.65,
             outsideEgal: 0.55, insideEgal: 0.30,
             finalColorRadius: 0.20
    };

function returnRGB(angle){
    let red = Math.min(1, Math.max(0, Math.cos(angle) + 0.5))*255,
        blue = Math.min(1, Math.max(0, Math.cos(angle - 2*Math.PI/3) + 0.5))*255,
        green = Math.min(1, Math.max(0, Math.cos(angle - 4*Math.PI/3) + 0.5))*255,
        rgb = {red: red, green: green, blue: blue,
               rgb: "rgb(" + red + ", " + green + ", " + blue + ")"};
    
    return rgb;
}
function buildRgbWheel(){
    let ctx = baseCanvas.getContext("2d"),
        resolution = 20; // higher = better
        interval = Math.PI/(3*resolution),
        maxColors = resolution*6;
    
    for (let i = 0; i < maxColors; i++){
        let currentAngle = interval*i,
            nextAngle = interval*(i+1),
            rgb = returnRGB(currentAngle);

            ctx.fillStyle = rgb.rgb;
            ctx.beginPath();
            ctx.arc(wheel.x, wheel.y, wheel.r*wheel.outsideRgb, currentAngle, nextAngle);
            ctx.lineTo(wheel.x, wheel.y);
            ctx.fill();
    }
    ctx.save();
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y, wheel.r*wheel.insideRgb, 0, 2*Math.PI);
    ctx.clip();
    ctx.clearRect(0, 0, baseCanvas.width, baseCanvas.width);
    ctx.restore();

}

let baseColor;
function selectColor(mouseX, mouseY){
    let trMouseX = wheel.x - mouseX,
        trMouseY = wheel.y - mouseY,
        angle;
    
    if (mouseX <= wheel.x){
        angle = Math.atan(trMouseY/trMouseX) - Math.PI;
    } else {
        angle = Math.atan(trMouseY/trMouseX);
    }
    baseColor = returnRGB(angle);

    let ctx = document.getElementById("secondwheel").getContext("2d"),
        angleMargin = 6*Math.PI/180;
    
    ctx.clearRect(0, 0, baseCanvas.width, baseCanvas.width);
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y, wheel.r*(wheel.outsideRgb + 0.01), angle - angleMargin, angle + angleMargin);
    ctx.arc(wheel.x, wheel.y, wheel.r*(wheel.insideRgb - 0.01), angle + angleMargin, angle - angleMargin, true);
    ctx.closePath();
    ctx.lineWidth = 5*baseCanvas.width/500;
    ctx.strokeStyle = "#5d5d5d";
    ctx.stroke();
    buildSecondWheel();
    selectFinalColor(finalAngle);
}
function buildSecondWheel(){
    let ctx = document.getElementById("secondwheel").getContext("2d"),
        resolution = 20; // higher = better
        interval = Math.PI/(3*resolution),
        maxColors = resolution*6;
    
    for (let i = 0; i < maxColors; i++){
        let currentAngle = interval*i,
            nextAngle = interval*(i+1),
            rgb = returnEgalizedRGB(currentAngle);
        
        ctx.fillStyle = rgb;
        ctx.beginPath();
        ctx.arc(wheel.x, wheel.y, wheel.r*wheel.outsideEgal, currentAngle, nextAngle);
        ctx.lineTo(wheel.x, wheel.y);
        ctx.fill();
    }
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y, wheel.r*(wheel.insideEgal), 0, 2*Math.PI);
    ctx.clip();
    ctx.clearRect(0, 0, baseCanvas.width, baseCanvas.width);
    ctx.restore();
}

let finalAngle = 0; // TO SAVE POSITION OF SECOND WHEEL

function determineFinalAngle(mouseX, mouseY){
    let trMouseX = wheel.x - mouseX,
        trMouseY = wheel.y - mouseY;
    
    if (mouseX <= wheel.x){
        finalAngle = Math.atan(trMouseY/trMouseX) - Math.PI;
    } else {
        finalAngle = Math.atan(trMouseY/trMouseX);
    }
    if (finalAngle < 0){
        finalAngle += 2*Math.PI;
    }
    selectFinalColor(finalAngle);
}
function returnEgalizedRGB(angle){
    let red, green, blue,
        lightMod = Math.abs(Math.sin(angle)*0.95);
        
    if (angle < Math.PI){
        // RGB GOES TO 255, 255, 255
        red = baseColor.red + (255 - baseColor.red)*lightMod;
        blue = baseColor.blue + (255 - baseColor.blue)*lightMod;
        green = baseColor.green + (255 - baseColor.green)*lightMod;
    } else {
        // RGB GOES TO 0, 0, 0
        red = baseColor.red - baseColor.red*lightMod;
        blue = baseColor.blue - baseColor.blue*lightMod;
        green = baseColor.green - baseColor.green*lightMod;
    }
    let rgb = "rgb(" + red + ", " + green + ", " + blue + ")";
    return rgb;
}
function selectFinalColor(angle){
    pencil.color = returnEgalizedRGB(angle);
    
    let ctx = document.getElementById("finalcolor").getContext("2d"),
        angleMargin = 6*Math.PI/180;
    
    ctx.clearRect(0, 0, baseCanvas.width, baseCanvas.width);
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y, wheel.r*(wheel.outsideEgal + 0.01), angle - angleMargin, angle + angleMargin);
    ctx.arc(wheel.x, wheel.y, wheel.r*(wheel.insideEgal - 0.01), angle + angleMargin, angle - angleMargin, true);
    ctx.closePath();
    ctx.lineWidth = 5*baseCanvas.width/500;
    ctx.strokeStyle = "#5d5d5d";
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y, wheel.r*(wheel.finalColorRadius), 0, 2*Math.PI);
    ctx.fillStyle = pencil.color;
    ctx.fill();
}


// MAKE CANVAS REACTIVE
function resizeWheel(){
    let parent = document.getElementById("colorwheel"),
        canvas = parent.querySelectorAll("canvas");
    
    for (let element of canvas){
        element.setAttribute("width", parent.offsetWidth);
        element.setAttribute("height", parent.offsetHeight);
    }
    wheel.x = baseCanvas.width/2;
    wheel.y = baseCanvas.width/2;
    wheel.r = baseCanvas.width*0.5;
}
function loadWheel(){
    resizeWheel();
    buildRgbWheel();
    selectColor(baseCanvas.width, baseCanvas.width/2);
}
window.addEventListener("resize", loadWheel);
window.addEventListener("load", loadWheel);

// CLICK EVENTS
let pickingColor = false,
    egalizingColor = false;

function distanceToCenter(mouseX, mouseY){
    diffX = Math.abs(wheel.x - mouseX),
    diffY = Math.abs(wheel.y - mouseY),
    distance = Math.sqrt(diffX*diffX + diffY*diffY);
    
    return distance;
}
document.getElementById("colorwheel").addEventListener('mousedown', (e) => {
    let mouseX = e.clientX - baseCanvas.getBoundingClientRect().left,
        mouseY = e.clientY - baseCanvas.getBoundingClientRect().top,
        dist = distanceToCenter(mouseX, mouseY);
        
    if (dist < wheel.r*wheel.outsideRgb && dist > wheel.r*wheel.insideRgb){
        selectColor(mouseX, mouseY);
        pickingColor = true;
    } else if (dist < wheel.r*wheel.outsideEgal && dist > wheel.r*wheel.insideEgal){
        determineFinalAngle(mouseX, mouseY);
        egalizingColor = true;
    }
});
document.getElementById("colorwheel").addEventListener('mousemove', (e) => {
    let mouseX = e.clientX - baseCanvas.getBoundingClientRect().left,
        mouseY = e.clientY - baseCanvas.getBoundingClientRect().top,
        dist = distanceToCenter(mouseX, mouseY);
    
    if (dist < wheel.r*wheel.outsideRgb && dist > wheel.r*wheel.insideRgb){
        if (pickingColor){
            selectColor(mouseX, mouseY);
        }
    } else if (dist < wheel.r*wheel.outsideEgal && dist > wheel.r*wheel.insideEgal){
        if (egalizingColor){
            determineFinalAngle(mouseX, mouseY);
        }
    }
});
document.addEventListener('mouseup', (e) => {
    pickingColor = false;
    egalizingColor = false;
});