// 1. CREATE IMAGE ARRAY
let imageArray = ["imageMode/images/bear.png", "imageMode/images/deer.png", "imageMode/images/fox.png", "imageMode/images/rabbit.png", "imageMode/images/raccoon.png",
                  "imageMode/images/parrot.png", "imageMode/images/mean_bird.png", "imageMode/images/small_bird.png",
                  "imageMode/images/oak_branch.png", "imageMode/images/red_leaf.png", "imageMode/images/yellow_leaf.png",
                  "imageMode/images/citrus.png", "imageMode/images/citrus_bunch.png",
                  "imageMode/images/orange_flower.png", "imageMode/images/pink_flower.png", "imageMode/images/white_flower.png", "imageMode/images/red_flower.png",
                  "imageMode/images/red_fish.png", "imageMode/images/evil_fish.png", "imageMode/images/frog.png"],
    currentIndex = 0;

// 2. CYCLE PREVIEW IMAGES
document.getElementById("leftCycle").addEventListener("click", () => {
    if (currentIndex === 0){
        currentIndex = imageArray.length - 1;
    } else {
        currentIndex--;
    }
    document.getElementById("imagePreview").setAttribute("src", imageArray[currentIndex]);
});
document.getElementById("rightCycle").addEventListener("click", () => {
    if (currentIndex === imageArray.length - 1){
        currentIndex = 0;
    } else {
        currentIndex++;
    }
    document.getElementById("imagePreview").setAttribute("src", imageArray[currentIndex]);
});

// 3. IMPORT IMAGE
document.getElementById("importImage").addEventListener("click", () => {
    // IF MAX ELEMENT NOT EXCEEDED
    let newImg = document.createElement("img");
    newImg.classList.add("image");
    newImg.setAttribute("src", imageArray[currentIndex]);
    document.getElementById("mainPage").appendChild(newImg);
    
    // MOVE NEW IMAGE TO FRONT
    images.unshift(newImg);
    sortImages();
    
    // RESET MODE TO TRANSLATE
    disableAllTransforms();
    translating = true;
    document.getElementById("translate").classList.add("active");
});



