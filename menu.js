let optionsVisible = false, drawMode = false, imageMode = false;

function toggleMode(){
    if (imageMode){
        document.getElementById("drawMenu").style.display = "none";
        document.getElementById("imageMenu").style.display = "flex";
        document.getElementById("cursorCanvas").style.display = "none";
        document.getElementById("imageMode").classList.add("active");
        document.getElementById("drawMode").classList.remove("active");
    } else if (drawMode) {
        document.getElementById("drawMenu").style.display = "flex";
        document.getElementById("imageMenu").style.display = "none";
        document.getElementById("cursorCanvas").style.display = "block";
        document.getElementById("imageMode").classList.remove("active");
        document.getElementById("drawMode").classList.add("active");
    }
    if (optionsVisible){
        document.getElementById("menuBody").style.display = "block";
        document.getElementById("optionsButton").innerHTML = "hide options";
        document.getElementById("optionsButton").classList.remove("closed");
    } else if (!optionsVisible){
        document.getElementById("menuBody").style.display = "none";
        document.getElementById("optionsButton").innerHTML = "show options";
        document.getElementById("optionsButton").classList.add("closed");
    }
    if (drawMode && optionsVisible && renderNeeded){
        loadWheel();
        resizeCanvas();
        assignSliderSizes();
        drawCircleSlider();
        drawSquareSlider();
        drawDiamondSlider();
        document.documentElement.style.setProperty('--scrollbar', (window.innerWidth - document.documentElement.clientWidth) + "px"); // CALCULATE SCROLLBAR WIDTH
        renderNeeded = false;
    }
}
window.addEventListener("load", () => {
    if (window.innerWidth < 800){
        optionsVisible = false;
    } else {
        optionsVisible = true;
    }
    console.log(window.innerWidth)
    imageMode = true;
    toggleMode();
});
document.getElementById("imageMode").addEventListener("click", () => {
   imageMode = true;
   drawMode = false;
   toggleMode();
});
document.getElementById("drawMode").addEventListener("click", () => {
   drawMode = true;
   imageMode = false;
   toggleMode();
});
document.getElementById("optionsButton").addEventListener("click", () => {
   if (optionsVisible){
       optionsVisible = false;
   } else if (!optionsVisible){
       optionsVisible = true;
   }
   toggleMode();
});

// TRIGGER RESIZE OF ELEMENTS WITH DISPLAY NONE
let renderNeeded = false;
window.addEventListener("resize", () => {
    if (imageMode || !optionsVisible){
        renderNeeded = true;
    }
});

// INTRO
function toggleIntro(){
    let intro = document.getElementsByTagName("header")[0];
    
    if (intro.classList.contains("active")){
        intro.classList.remove("active");
    } else {
        intro.classList.add("active");
    }
}
document.getElementById("infoButton").addEventListener("click", toggleIntro);
document.getElementById("continueButton").addEventListener("click", toggleIntro);



