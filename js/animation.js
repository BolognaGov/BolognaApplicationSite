// login-page.html
// swapping images during animation
let imgs = ["mohe.jpg", "bauc.jpg"];
let index = 0;

function startSwapAnimation() {
    setInterval(() => {
        let imgElement = document.querySelector(".icon-container img");
        
        // Change the image when opacity is 0 (25% and 75% of the animation cycle)
        setTimeout(() => {
            index = (index + 1) % imgs.length;
            if (index == 0) {
                imgElement.src = imgElement.src.replace("bauc.jpg", imgs[index]);
            } else {
                imgElement.src = imgElement.src.replace("mohe.jpg", imgs[index]);
            }
        }, 2500);
    }, 5000);
}

window.onload = function() {
    startSwapAnimation();
}