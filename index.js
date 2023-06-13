// VARIABLE DECLARATIONS

let audioTurn = new Audio("sounds/first_player.wav");
let gameEndingMusic = new Audio("sounds/game-ending-sound.wav");
let firstPlayerMusicPath = "sounds/first_player.wav";
let secondPlayerMusicPath = "sounds/second_player.wav";

let boxes = document.getElementsByClassName("box");
let playerTurnInfo = document.getElementById("info");
let boxTexts = document.getElementsByClassName("boxText");
let reset = document.getElementById("reset");
let excitedGif = document.getElementById("excited_gif");
let animatedLine = document.querySelector('.line');

let insertionPossible = true;
let turn = "X";
let positionStart, positionEnd;
let count = 0;
let sizeOfGrid = 9;

// each element of wins have eight values. The first three values are the indices in a 3*3 grid which makes a win line. The other three values are translateX, translateY and rotation respectively for animation transform of full size window or tablets and last two values are translateX and translateY respectively for mobile or small devices. Below is the playing grid indices order for first three values in wins element
// [0 1 2]
// [3 4 5]
// [6 7 8]

// width = 23vw
let wins = [
  [0, 1, 2, 5, 5, 0, 10, 9],
  [3, 4, 5, 5, 17, 0, 10, 31],
  [6, 7, 8, 5, 28, 0, 10, 53],
  [0, 3, 6, -7, 16, 90, -12, 31],
  [1, 4, 7, 5, 16, 90, 10, 31], 
  [2, 5, 8, 17, 16, 90, 32, 31],  
  [0, 4, 8, 5, 17, 45, 10, 32], 
  [2, 4, 6, 5, 17, 135, 10, 32]
];

// FUNCTION DECLARATIONS

// play the music when someone plays their turn.
const playTurnMusic = () => {
  if (turn === "X") {
    audioTurn.src = firstPlayerMusicPath;
  } else {
    audioTurn.src = secondPlayerMusicPath;
  }

  audioTurn.currentTime = 0;
  audioTurn.play();
};

// this makes the turn alternative, i.e if now "X", then give to "0", and vice versa.
const changeTurn = () => {
  return turn === "X" ? "0" : "X";
};

// check if anyone won and stop from further clicks in the game
const checkWin = () => {
  // using 'for of' loop in place of 'forEach' as we cannot stop the forEach in between, so returning something as shown below will not work.
  for (let e of wins) {
    if (
      boxTexts[e[0]].innerText === boxTexts[e[1]].innerText &&
      boxTexts[e[1]].innerText === boxTexts[e[2]].innerText &&
      boxTexts[e[0]].innerText !== ""
    ) {
      // after someone wins, no more click events possible  
      insertionPossible = false;
      // translate the animate line with translate(e[3], e[4]) rotate(e[5]deg) based on window size due to responsiveness
      if(window.innerWidth > 600){
        animatedLine.style.transform = `translate(${e[3]}vw, ${e[4]}vw) rotate(${e[5]}deg)`;
        animatedLine.style.width = "23vw";
      }
      else{
        animatedLine.style.transform = `translate(${e[6]}vw, ${e[7]}vw) rotate(${e[5]}deg)`;
        animatedLine.style.width = "44vw";
      }
      
      return true;
    }
  }
  // if no one wins, then return false.
  return false;
};

// setting color to boxText based on turn
const setColorToBoxtextBasedOnTurn = (boxText) => {
    if(boxText.innerText === "X"){
        boxText.style.color = "#fd0707";
    }
    else if(boxText.innerText === "0"){
        boxText.style.color = "#07fd39";
    }
}

// MAIN LOGIC

// parsing all the div boxes and adding event listener for them based on turns and clicks made.
Array.from(boxes).forEach((element) => {
  element.addEventListener("click", () => {
    // this selects the span with class = 'boxTest' inside the particular element.
    let boxText = element.querySelector(".boxText");

    // will only make changes if not already done and if no one has won till now
    if (boxText.innerText === "" && insertionPossible) {
      boxText.innerText = turn;
      setColorToBoxtextBasedOnTurn(boxText);
      count++;
      // play music on based on which players turn 
      playTurnMusic();

      if (checkWin()) {
        playerTurnInfo.innerText = `${turn} won`;
        excitedGif.src = "images/excited_square_pants.gif";
        excitedGif.style.opacity = "1";
    
        gameEndingMusic.play();
      } else {
        turn = changeTurn();
        if (count === sizeOfGrid) {
          playerTurnInfo.innerText = "No one won";

          excitedGif.src = "images/draw_match.gif";
          excitedGif.style.opacity = "1";

          gameEndingMusic.play();
        } else {
          playerTurnInfo.innerText = `Turn for ${turn}`;
        }
      }
    }
  });
});

// click event listener for reset button
reset.addEventListener("click", () => {
  // animating back to normal in reverse direction

  // making all the boxes in the grid empty again for filling.
  Array.from(boxes).forEach((element) => {
    element.querySelector(".boxText").innerText = "";
  });

  // make insertionPossible true
  insertionPossible = true;

  // make turn "X"
  turn = "X";

  // make all boxText default to color "red"
  Array.from(boxTexts).forEach(element => {
    element.style.color = "#fd0707";
  });

  // make "turn for X" in span
  playerTurnInfo.innerText = "Turn for X";

  // making count to zero
  count = 0;

  // remove the excited gif
  excitedGif.style.opacity = "0";

  // remove the animated line
  animatedLine.style.width = "0";
});
