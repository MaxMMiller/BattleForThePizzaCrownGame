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

//How many words the user has guessed correctly
let totalWords = 0;

//sprites
loadSprite("background", "sprites/pizzaplace.webp");

//Scene that holds the true gameplay
scene("game", () => {
  // The background image
  const background = add([
    sprite("background"),
    pos(width() / 2, height() / 2),
    anchor("center"),
    scale(0.7),
    fixed(),
    "background",
  ]);
  //Counts of each word bank for what words are left
  var wordCount = [0,0,0,0];
  //word banks
  var threeBank = [
    "tea",
    "max",
    "pep",
    "rye",
    "cod",
    "pet",
    "own",
    "egg",
    "pie",
  ];
  var fourBank = [
    "evil",
    "good",
    "grub",
    "flop",
    "dart", 
    "goat",
    "food",
    "frog",
    "owen",
  ];
  var fiveBank = [
    "apple",
    "grape",
    "lemon",
    "melon",
    "peach",
    "berry",
    "chair",
    "table",
    "pizza",
    "chips",
    "fries",
    "onion",
    "magic",
    "zebra",
    "sauce",
  ];
  var sixBank = [
    "banana",
    "orange",
    "pepper",
    "squash",
    "tomato",
    "carrot",
    "garlic",
    "potato",
    "wizard",
    "escape",
    "cheese",
  ];
  //The word the player is currently on
  let cWord;
  //The string of the letter the player is currently on
  let cLetter;
  //The int of the letter the player is currently on
  let cLetNum = 0;
  //The previous word typed
  let prevWord;
  
  //creates boxes for each letter of word(string) parameter. CurrentLet takes an int of which letter (starting from 0) is the user on. wrong holds whether the player has guessed the letter wrong(null = not answered, true = incorrect).
  function letterBox(word, currentLet, wrong) {
    let boxHeight = 50;
    let boxWidth = 40;
    let outlineColor = black;
    //Centers the boxes with the width of the game screen
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
        if (wrong) {outlineColor = red;} else {outlineColor = black;}
        
      }else if (currentLet>i){ //To be on a letter past 0, previous letters must be correct
        outlineColor = green;
      }else {outlineColor = black;} // CurrentLet < i, are later than current so default outline
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

  function nextWordPreview() {
    //Displays the next word as a preview
    
  }

  //shuffles an entered array (Fisher-Yates Algorithm)
  function shuffleBank(bank){
    for(let i = bank.length - 1; i > 0; i--){
      const r = Math.floor(Math.random() * (i + 1))
      const temp = bank[i];
      bank[i] = bank[r];
      bank[r] = temp;
    }
  }

  //Sets the current word to a new word. If all words in the bank have been used, shuffle the bank and reset the banks word count
  function cycleBank(bank){
    if(totalWords > 0){
      if(wordCount[1] < bank.length-1){wordCount[1]++;}else{
        //When all words in bank are used, shuffle the bank and reset the word count
        wordCount[1] = 0;
        shuffleBank(bank);
      }
      cWord = bank[wordCount[1]];

    }
  }
  
  //selects a word
  function pickWord(){
    let chance = Math.floor(Math.random() *5);
    if(chance <= 1){
      cycleBank(fourBank);
    }else if (chance <= 2){
      cycleBank(fiveBank);
    }else if (chance <= 3){
      cycleBank(sixBank);
    }else {
      cycleBank(threeBank);
    }
  }

  
  //Repalces the current word with a new word
  function nextWord(){
    pickWord();
    while(cWord == prevWord){pickWord();}
    cLetNum = 0; //resets to the first letter
    letterBox(cWord, cLetNum, null);
    cLetter = cWord[cLetNum]; //sets the current letter to the first letter
  }
  
  function startTimer(seconds) {
    //yellow circle behind timer
    add([
      pos(vec2(100,95)),
      circle(50),
      color(rgb(250,250,0)),
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
      if(timer.seconds <= 0) {
        go("end");
      }
    });
  }

  function startGame() {
    //shuffles the values of the word banks
    shuffleBank(threeBank);
    shuffleBank(fourBank);
    shuffleBank(fiveBank);
    shuffleBank(sixBank);
    nextWord();
    startTimer(30);
  }
  
  onKeyPress(()=>{
    //If the correct letter is pressed, turn outline green and move on to next letter
    if (isKeyPressed(cLetter)){
      cLetNum++;
      cLetter = cWord[cLetNum];
      destroyAll("wordbox");
      letterBox(cWord, cLetNum, null);
      if(cWord.length == cLetNum){
        totalWords++;
        prevWord = cWord;
        destroyAll("wordbox");
        nextWord();
      }
    }else { //If the incorrect letter is pressed, turn outline red and shake screen
      shake(30);
      letterBox(cWord, cLetNum, true);
    }
  });
  startGame(); // starts the game
}); //End of Game Scene

//Scene after time runs out
scene("end", ()=>{
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
    pos(width()/2, height()/2.4),
    anchor("center"),
  ]);
  let againBtn, againBtn1; // placeholders for play again box to allow change of color

  //spawns the pizza box button to play again
  function pizzaBox() {
    againBtn = add([
      pos(vec2(width()/2, (height()/1.4))),
      rect(180,180),
      color(boxColor),
      anchor("center"),
      "againBtn",
      area(),
    ]);
    add([
      pos(vec2(width()/2, (height()/1.4))),
      rect(160,160),
      color(white),
      anchor("center"),
      area(),
    ]);
    againBtn1 = add([
      pos(vec2(width()/2, (height()/1.4))),
      rect(140,140),
      color(boxColor),
      anchor("center"),
      "againBtn",
      area(),
    ]);
    add([
      text("EAT"),
      pos(vec2(width()/2, (height()/1.5))),
      anchor("center"),
    ]);
    add([
      text("AGAIN"),
      pos(vec2(width()/2, (height()/1.3))),
      anchor("center"),
    ]);
  }
  
  //Changes play again button color on hover
  onHover("againBtn", () => {
    againBtn.color = boxColorPressed;
    againBtn1.color = boxColorPressed;
  });
  onHoverEnd("againBtn", () => {
    againBtn.color = boxColor;
    againBtn1.color = boxColor;
  });

  //resets score and starts game when play again button is pressed
  onClick("againBtn", () => {
    totalWords = 0;
    go("game");
  });
  onKeyPress("space", () => {
    totalWords = 0;
    go("game");
  });

  //BACK BUTTON
  add([
    text("BACK"),
    pos(vec2(width()-100, (height()/1.1))),
    anchor("center"),
    area(),
    "backBtn",
  ]);
  onClick("backBtn", () => {
    totalWords = 0;
    go("mainmenu");
  });
  
  pizzaBox();
  
});//End of End Scene

scene("mainmenu", ()=>{
  const background = add([
    sprite("background"),
    pos(width() / 2, height() / 2),
    anchor("center"),
    scale(0.7),
    fixed(),
    "background",
  ]);
  add([
    text("PRESS SPACE TO START"),
    pos(width()/2, height()/1.5),
    anchor("center"),
  ]);
  onKeyPress("space", () => {
    go("game");
  });
  onClick(()=> {
    go("game");
  });
});
go("mainmenu");