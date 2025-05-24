const artistBoxes= document.querySelectorAll(".artist-box");
const playButton = document.querySelector(".play-button");
console.log(artistBoxes);
artistBoxes.forEach(artistBox => {
    artistBox.addEventListener("mouseover", ()=>{
        artistBoxes[0].classList.add("expand");
    });
    artistBox.addEventListener("mouseleave", ()=>{
        artistBoxes[0].classList.remove("expand");
    });
});

playButton.addEventListener("click", () => {
    for (let i = 1; i < artistBoxes.length; i++) {
        setTimeout(() => {
            if(artistBoxes[i].classList.contains("active")) artistBoxes[i].classList.toggle("inactive");
            else artistBoxes[i].classList.toggle("inactive");
            artistBoxes[i].classList.toggle("active");
        }, 50 * (i + 1));
    }
})

