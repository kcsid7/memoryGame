const gameContainer = document.getElementById("game");
const gameWin = document.querySelector("#gamewin");
const restart = document.querySelector("#restart");
const score = document.querySelector("#score");
const level = document.querySelector("#level");

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter--;
    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

let shuffledColors = shuffle(COLORS);

// when the DOM loads
createDivsForColors(shuffledColors);

sessionStorage.clear();
sessionStorage.setItem("score", "0");


function restartGame(){
  let gameDivs = document.querySelectorAll(".gamecard");
  let newColors = shuffle(COLORS);
  gameDivs.forEach( function(el) {
    el.remove();
  });
  createDivsForColors(newColors);
  score.innerText = "0";
  sessionStorage.setItem("score", "0");
  clickedCards = 0;

  gameContainer.style.display = "block";
  gameWin.style.display = "none";

}

restart.addEventListener("click", function(e){
  restartGame();
})

level.addEventListener("change", function(e){
  restartGame();
});


// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");
    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
    newDiv.classList.add("gamecard");
    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);
    // append the div to the element with an id of game
    gameContainer.appendChild(newDiv);
  }
}

let cardOne, cardTwo;
let clickedCards = 0;

function handleCardClick(e) {
  if (e.target.classList.contains("clicked")) return;
  // console.dir(e.target);
  // Reveal the card when clicked
  e.target.style.backgroundColor = e.target.classList[0];
  e.target.classList.add("clicked")

  // UpdateScore
  sessionStorage.setItem("score", JSON.stringify(+JSON.parse(sessionStorage.score) + 1));
  score.innerText = sessionStorage.score;

  // Access localStorage: store two values for card1 & card2
  if (!sessionStorage.cardOne) { 
    sessionStorage.setItem("cardOne", e.target.classList[0])
    cardOne = e.target;
  } else {
    if (e.target === cardOne ) {
      return;
    } 
    sessionStorage.setItem("cardTwo", e.target.classList[0])
    cardTwo = e.target;
  }
  
  if (sessionStorage.cardOne && sessionStorage.cardTwo) {
    // class twoCards sets the pointer-events on the gameContainer
    // to none which disables the user to click on more than two cards at once
    gameContainer.classList.add("twoCards");  

    if (sessionStorage.cardOne === sessionStorage.cardTwo) {
      gameContainer.classList.remove("twoCards");  
      sessionStorage.removeItem("cardOne");
      sessionStorage.removeItem("cardTwo");
      clickedCards = clickedCards + 2;

    } else {
      setTimeout(function(){
        cardOne.style.backgroundColor = "";
        cardTwo.style.backgroundColor = "";
        gameContainer.classList.remove("twoCards"); 
        sessionStorage.removeItem("cardOne");
        sessionStorage.removeItem("cardTwo");
        cardOne.classList.remove("clicked");
        cardTwo.classList.remove("clicked");
        if (level.value === "hard") {
          for (let c of gameContainer.children) {
          c.style.backgroundColor = "";
          c.classList.remove("clicked");
          }
          clickedCards = 0;
        }
      }, 1000)
    }
  }

  // Check for game win
  if (clickedCards === COLORS.length) {
    gameContainer.style.display = "none";
    gameWin.style.display = "block";
  } 
}