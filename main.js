import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs"

// initialize context
kaboom({
  width: 700,
  height: 400,
  canvas: document.getElementById("canvas"),
  font: "Arial",
});




const black = rgb(0, 0, 0);
const white = rgb(255, 255, 255);
const gray = rgb(100, 100, 100);
const green = rgb(0, 255, 0);
const red = rgb(255, 0, 0);
const boxColor = rgb(128, 108, 81);
const boxColorPressed = rgb(108, 88, 61);

let againBtn, againBtn1;

var wordBank = [
  "pepperoni",
  "sausage",
  "pizza",
  "rye",
  "sauce",
  "tomato",
  "olive",
  "pepper",
  "cheese",
  "crust",
  "salad",
  "pinball",
  "pineapple",
  "mozzarella",
  "italy",
  "italiano",
  "pie",
  "bread",
  "calzone",
  "american",
  "garlic",
  "buffet",
  "dinners",
  "panini",
  "onion",
  "pesto",
  "flatbread",
  "stone",
  "brick",
  "entree",
  "basil",
  "oregano",
  "manicotti",
  "ziti",
  "chips",
  "marone",
  "meatball",
  "yeast",
  "margherita",
  "slice",
  "cutter",
  "saucepan",
  "oven",
  "furnace",
  "neapolitan",
  "nyc",
  "sicillian",
  "char",
  "deep",
  "dish",
  "chicago",
  "marinara"
];

//How many words the user has guessed correctly
let totalWords = 0;
//The word the user is currently on
let cWord = wordBank[0];
let cLetNum = 0;
let cWordArray = cWord.split("");
let cLetter = cWordArray[0];
let nextWord = wordBank[1];
let arrayPos = 0;

//sprites
loadSprite("background", "sprites/pizzaplace.webp");
loadSprite("pizza", "sprites/pizza.png");

//creates boxes for each letter of word(string) parameter. CurrentLet takes an int of which letter (starting from 0) is the user on. wrong holds whether the player has guessed the letter wrong(null = not answered, true = incorrect).
function letterBox(word, currentLet, wrong) {
  let boxHeight = 50;
  let boxWidth = 40;
  let outlineColor = black;
  //Centers the boxes with the width of the tlGame screen
  let x = (width() / 2) - (((word.length * boxWidth) + ((word.length - 1) * (boxWidth / 2))) / 2);
  let y = (height() - boxWidth) / 2;
  //For each letter in word parameter, create a box to hold that letter
  for (let i = 0; i < word.length; i++) {
    // amount of space between boxes
    let diff = (boxWidth + 20) * i;
    //creates a bar under the current letter
    if (currentLet == i) {
      add([
        rect(boxWidth, 3),
        color(gray),
        pos(x + diff, y + boxHeight + 10),
        outline(2, black),
        "wordbox",
      ]);
      //changes the color of the box outline based on wrong of answer
      if (wrong) { outlineColor = red; } else { outlineColor = black; }

    } else if (currentLet > i) { //To be on a letter past 0, previous letters must be correct
      outlineColor = green;
    } else { outlineColor = black; } // CurrentLet < i, are later than current so default outline
    add([
      rect(boxWidth, boxHeight),
      pos(x + diff, y),
      color(gray),
      outline(3, outlineColor),
      anchor("topleft"),
      "wordbox",
    ]);
    add([
      text(word[i]),
      pos((x + (boxWidth / 4)) + diff, y + (boxWidth / 4)),
      anchor("topleft"),
      "wordbox",
    ]);
  }
};

function wordPreviewBox(word) {
  let boxHeight = 25;
  let boxWidth = 20;
  let outlineColor = boxColorPressed;
  //Centers the boxes with the width of the tlGame screen
  let x = (width() / 2) - (((word.length * boxWidth) + ((word.length - 1) * (boxWidth / 2))) / 2);
  let y = ((height() + boxWidth) / 1.6);
  //For each letter in word parameter, create a box to hold that letter
  for (let i = 0; i < word.length; i++) {
    // amount of space between boxes
    let diff = (boxWidth + 7) * i;
    add([
      rect(boxWidth, boxHeight),
      pos(x + diff, y),
      color(boxColor),
      outline(3, outlineColor),
      anchor("topleft"),
      "wordbox",
    ]);
    add([
      text(word[i]),
      pos((x + (boxWidth / 4)) + diff, y + (boxWidth / 4)),
      anchor("topleft"),
      scale(0.5),
      "wordbox",
    ]);
  }
}

//creates a timer of parameter seconds in a yellow circle in the top left corner
function startTimer(seconds) {
  //yellow circle behind timer
  add([
    pos(vec2(100, 95)),
    circle(50),
    color(rgb(250, 250, 0)),
    anchor("center"),
  ]);
  //Timer
  let timer = add([
    text(seconds.toString()),
    pos(100, 100),
    scale(2),
    anchor("center"),
    color(black),
    { seconds: seconds },
  ]);
  loop(1, () => {
    timer.seconds--;
    timer.text = timer.seconds.toString();
    if (timer.seconds <= 0) {
      go("TLEnd");
    }
  });
}
//shuffles an entered array (Fisher-Yates Algorithm)
function shuffleBank(bank) {
  for (let i = bank.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1))
    const temp = bank[i];
    bank[i] = bank[r];
    bank[r] = temp;
  }
}

//Sets the current and next word. Shuffles bank if it is the first word
function pickWord() {
  if (totalWords == 0) {
    shuffleBank(wordBank);
  }
  if (arrayPos < wordBank.length) {
    cWord = wordBank[arrayPos];
    if (arrayPos + 1 >= wordBank.length) {
      shuffleBank(wordBank)
      arrayPos = 0;
    }
    nextWord = wordBank[arrayPos + 1];
    cWordArray = cWord.split("");
    cLetter = cWordArray[cLetNum];
  }
  letterBox(cWord, cLetNum, null);
  wordPreviewBox(nextWord);
}
//Checks if the correct lettert is pressed
function checkLetter() {
  if (isKeyPressed(cLetter)) { //if the user presses the correct letter, go to next letter
    cLetNum++;
    cLetter = cWordArray[cLetNum];
    destroyAll("wordbox");
    letterBox(cWord, cLetNum, null);
    wordPreviewBox(nextWord);
    if (cWord.length == cLetNum) {//If word has been fully typed, move to next word
      totalWords++;
      arrayPos++;
      destroyAll("wordbox");
      cLetNum = 0;
      pizzaFalling()
      pickWord();
    }
  } else { //If the incorrect letter is pressed, turn outline red and shake screen
    shake(30);
    letterBox(cWord, cLetNum, true);
    wordPreviewBox(nextWord);
  }
}

//spawns the pizza box button to play again
function playAgainBtn() {
  againBtn = add([
    pos(vec2(width() / 2, (height() / 1.4))),
    rect(180, 180),
    color(boxColor),
    anchor("center"),
    "againBtn",
    area(),
  ]);
  add([
    pos(vec2(width() / 2, (height() / 1.4))),
    rect(160, 160),
    color(white),
    anchor("center"),
    area(),
  ]);
  againBtn1 = add([
    pos(vec2(width() / 2, (height() / 1.4))),
    rect(140, 140),
    color(boxColor),
    anchor("center"),
    "againBtn",
    area(),
  ]);
  add([
    text("EAT"),
    pos(vec2(width() / 2, (height() / 1.5))),
    anchor("center"),
  ]);
  add([
    text("AGAIN"),
    pos(vec2(width() / 2, (height() / 1.3))),
    anchor("center"),
  ]);
}

function pizzaFalling() {
  setGravity(1600);
  console.log("pizza");
  let pizza = add([
    sprite("pizza"),
    pos(width() - (width() / (Math.floor(Math.random() * 10) + 1)), 0),
    anchor("center"),
    //scale(),
    area(),
    body(),
    "pizza",
  ]);

  if (pizza.pos.y > height()) {
    destroy(pizza);
  }
}


//Scene that holds the time limit Game
scene("tlGame", () => {
  // The background image
  const background = add([
    sprite("background"),
    pos(width() / 2, height() / 2),
    anchor("center"),
    scale(0.7),
    fixed(),
    "background",
  ]);

  onKeyPress(() => {
    checkLetter();
  });

  totalWords = 0;
  cWord = wordBank[0];
  cLetNum = 0;
  cWordArray = cWord.split("");
  cLetter = cWordArray[0];
  nextWord = wordBank[1];
  arrayPos = 0;
  pickWord();
  startTimer(31);
}); //End of tlGame Scene




//Scene after time runs out
scene("TLEnd", () => {
  const background = add([
    sprite("background"),
    pos(width() / 2, height() / 2),
    anchor("center"),
    scale(0.7),
    fixed(),
    "background",
  ]);
  add([
    text("YOU ATE " + totalWords + " SLICES!"),
    pos(width() / 2, height() / 2.4),
    anchor("center"),
  ]);



  //Changes play again button color on hover
  onHover("againBtn", () => {
    againBtn.color = boxColorPressed;
    againBtn1.color = boxColorPressed;
  });
  onHoverEnd("againBtn", () => {
    againBtn.color = boxColor;
    againBtn1.color = boxColor;
  });

  //resets score and starts tlGame when play again button is pressed
  onClick("againBtn", () => {
    go("tlGame");
  });
  onKeyPress("space", () => {
    go("tlGame");
  });

  //BACK BUTTON
  add([
    text("BACK"),
    pos(vec2(width() - 100, (height() / 1.1))),
    anchor("center"),
    area(),
    "backBtn",
  ]);
  onClick("backBtn", () => {
    go("mainmenu");
  });

  playAgainBtn();

});//End of End Scene

scene("mainmenu", ()=>{
  let boxHeight = 230;
  let boxWidth = 500;
  const background = add([
    sprite("background"),
    pos(width() / 2, height() / 2),
    anchor("center"),
    scale(0.7),
    fixed(),
    "background",
  ]);
  add([
    pos(vec2(width()/2, (height()/1.5))),
    rect(boxWidth + 10,boxHeight + 10),
    color(white),
    anchor("center"),
    area(),
  ]);
  add([
    pos(vec2(width()/2, (height()/1.5))),
    rect(boxWidth,boxHeight),
    color(boxColor),
    anchor("center"),
    area(),
  ]);
  add([
    text("PRESS SPACE TO START"),
    pos(width()/2, height()/1.5),
    anchor("center"),
  ]);
  onKeyPress("space", () => {
    go("tlGame");
  });
  onClick(()=> {
    go("tlGame");
  });
});

//WHEN WINDOW RUNS
go("mainmenu");
