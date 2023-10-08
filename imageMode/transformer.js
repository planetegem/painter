let images = Array.from(document.getElementsByClassName("image")),
    selected = {},
    startX, startY;
    
// 0. SORT IMAGES ALONG Z-INDEX AFTER EVERY SELECTION, IMPORT OR REMOVAL
function sortImages(){
    for (let i = 0; i < images.length; i++){
        images[i].style.zIndex = images.length - i;
    } 
}
window.addEventListener("load", () => {
    sortImages(); 
});


// 1. DETECT MOUSEDOWN ON IMAGE & SAVE DETAILS
function checkHit(mouseX, mouseY, target){
    if (mouseX >= target.getBoundingClientRect().left && mouseX <= target.getBoundingClientRect().right &&
        mouseY >= target.getBoundingClientRect().top && mouseY <= target.getBoundingClientRect().bottom){
            return true;
        }
}
function createSelectedItem(image){
    let transformMatrix = window.getComputedStyle(image).getPropertyValue("transform");
    if (transformMatrix === "none"){
        selected.x = 0;
        selected.y = 0;
        selected.rotate = 0;
        selected.scale = 1;
    } else {
        let matrix = transformMatrix.split("(")[1].split(")")[0].split(", ");
        matrix.forEach(element => parseInt(element));

        selected.x = matrix[4];
        selected.y = matrix[5];
        selected.scale = Math.sqrt(matrix[0]*matrix[0] + matrix[1]*matrix[1]);
        selected.rotate = Math.round(Math.atan2(matrix[1], matrix[0]) * (180/Math.PI));
    }
    selected.image = image;
} 

let draggingImage = false;

function detectImage(mouseX, mouseY){
    for (let i = 0; i < images.length; i++){
        if (checkHit(mouseX, mouseY, images[i])){
            if (deleting){
                images[i].remove();
                images.splice(i, 1);
            } else {
                createSelectedItem(images[i]);
                draggingImage = true;
                    
                startX = mouseX;
                startY = mouseY;
                    
                // MOVE SELECTED ITEM TO FRONT
                images.unshift(images[i]);
                images.splice(i+1, 1);
                sortImages();
            }
            break;
        }
    }
}
document.addEventListener("mousedown", (e) => {
    if (imageMode){
        let mouseX = e.clientX,
            mouseY = e.clientY;
        
        detectImage(mouseX, mouseY);
    }
});
//mobile support
document.addEventListener("touchstart", (e) => {
    if (imageMode){
        e.stopPropagation();
        e.preventDefault();
        
        let mouseX = e.touches[0].pageX,
            mouseY = e.touches[0].pageY;
        
        detectImage(mouseX, mouseY);
    }
});

// 2. TRANSFORMS
let translating = true,
    rotating = false,
    scaling = false,
    deleting = false;

function translateImage(distX, distY){
    distX += parseInt(selected.x);
    distY += parseInt(selected.y);
    let translate = "translate(" + distX + "px, " + distY + "px) rotate(" + selected.rotate + "deg) scale(" + selected.scale + ")";
    selected.image.style.transform = translate;
}
function rotateImage(mouseX, mouseY){
    // FIND CENTER OF IMAGE
    let cx = selected.image.getBoundingClientRect().left + selected.image.getBoundingClientRect().width*0.5,
        cy = selected.image.getBoundingClientRect().top + selected.image.getBoundingClientRect().height*0.5;
        
    // CALCULATE ANGLE BASED ON VECTOR
    mouseX -= cx;
    mouseY -= cy;
    let angle = Math.atan2(mouseY, mouseX)*180/Math.PI  + parseInt(selected.rotate);
    
    // SUBSTRACT STARTER ANGLE
    angle -= Math.atan2(startY - cy, startX - cx)*180/Math.PI;
    
    // APPLY
    let translate = "translate(" + selected.x + "px, " + selected.y + "px) rotate(" + angle + "deg) scale(" + selected.scale + ")"; 
    selected.image.style.transform = translate;
}
function scaleImage(mouseX, mouseY){ // MOVE AWAY FROM CENTER = LARGER
    // FIND CENTER OF IMAGE
    let cx = selected.image.getBoundingClientRect().left + selected.image.getBoundingClientRect().width*0.5,
        cy = selected.image.getBoundingClientRect().top + selected.image.getBoundingClientRect().height*0.5,
        mouseDist, startDist, scale;
    
    // CALCULATE DISTANCE TO CENTER AND COMPARE AGAINST START TO GET SCALE
    mouseDist = Math.sqrt((mouseX-cx)*(mouseX-cx) + (mouseY-cy)*(mouseY-cy));
    startDist = Math.sqrt((startX-cx)*(startX-cx) + (startY-cy)*(startY-cy));
    scale = (mouseDist*parseFloat(selected.scale))/startDist;
    scale = Math.max(0.35, Math.min(3, scale));
    
    // APPLY
    let translate = "translate(" + selected.x + "px, " + selected.y + "px) rotate(" + selected.rotate + "deg) scale(" + scale + ")"; 
    selected.image.style.transform = translate;    
}

// 3. MODE BUTTONS
function disableAllTransforms(){
    let transformButtons = document.getElementById("transformers").getElementsByTagName("button");
    for (let button of transformButtons){
        button.classList.remove("active");
    }
    translating = false; 
    rotating = false;
    scaling = false;
    deleting = false;
}
document.getElementById("translate").addEventListener("click", () => {
    disableAllTransforms();
    translating = true;
    document.getElementById("translate").classList.add("active");
});
document.getElementById("scale").addEventListener("click", () => {
    disableAllTransforms();
    scaling = true;
    document.getElementById("scale").classList.add("active");
});
document.getElementById("rotate").addEventListener("click", () => {
    disableAllTransforms();
    rotating = true;
    document.getElementById("rotate").classList.add("active");
});
document.getElementById("delete").addEventListener("click", () => {
    disableAllTransforms();
    deleting = true;
    document.getElementById("delete").classList.add("active");
});

// 4. MOUSE MOVE LISTENER

document.addEventListener("mousemove", (e) => {
    if (draggingImage){
        e.preventDefault();
        e.stopPropagation();
        
        let mouseX = e.clientX,
            mouseY = e.clientY;
        
        if (translating){
            translateImage(mouseX - startX, mouseY - startY);
        }
        if (rotating){
            rotateImage(mouseX, mouseY);
        }
        if (scaling){
            scaleImage(mouseX, mouseY);
        }
    }
});
document.addEventListener("touchmove", (e) => {
    if (draggingImage){
        e.stopPropagation();
        e.preventDefault();
        
        let mouseX = e.touches[0].pageX,
            mouseY = e.touches[0].pageY;
        
        if (translating){
            translateImage(mouseX - startX, mouseY - startY);
        }
        if (rotating){
            rotateImage(mouseX, mouseY);
        }
        if (scaling){
            scaleImage(mouseX, mouseY);
        }
    }
}, { passive: false });

document.addEventListener("mouseup", () => {
    draggingImage = false;
    selected = {};
});
document.addEventListener("touchend", () => {
    draggingImage = false;
    selected = {};
});