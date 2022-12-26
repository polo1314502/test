let unitLength = 30;
let boxColor = 150;
const strokeColor = 255;
let columns; /* To be determined by window width */
let rows; /* To be determined by window height */
let currentBoard;
let nextBoard;
let fr = 30; /*to control the speed */
let speedValue = document.querySelector("#speed-value");
let dieOfLoneliness = 2; //default value is 2
let dieOfLonelinessText = document.querySelector("#loneliness-value");
let dieOfOverpopulation = 3; //default value is 3
let dieOfOverpopulationText = document.querySelector("#overpopulation-value");
let newLifeDueToReproduction = 3; //default value is 3
let newLifeRuleText = document.querySelector("#new-life-value");
let boxSizingValue = document.querySelector("#box-sizing-value");
let boxColor2X = Math.floor(Math.random() * 255);
let boxColor2Y = Math.floor(Math.random() * 255);
let boxColor2Z = Math.floor(Math.random() * 255);
let randomNum = Math.random();
let objMark = {};
let colorStyle = "random";
let rubberOrPen = true;

document
  .querySelector("#myRange-speed")
  .addEventListener("mouseup", function () {
    fr = parseInt(document.querySelector("#myRange-speed").value);
    speedValue.innerHTML = fr;
  });

document
  .querySelector("#new-life-rule")
  .addEventListener("mouseup", function () {
    newLifeDueToReproduction = parseInt(
      document.querySelector("#new-life-rule").value
    );
    newLifeRuleText.innerHTML = newLifeDueToReproduction;
  });

document
  .querySelector("#rule-of-overpopulation")
  .addEventListener("mouseup", function () {
    dieOfOverpopulation = parseInt(
      document.querySelector("#rule-of-overpopulation").value
    );
    dieOfOverpopulationText.innerHTML = dieOfOverpopulation;
  });

document
  .querySelector("#rule-of-loneliness")
  .addEventListener("mouseup", function () {
    dieOfLoneliness = parseInt(
      document.querySelector("#rule-of-loneliness").value
    );
    dieOfLonelinessText.innerHTML = dieOfLoneliness;
  });

document
  .querySelector("#rule-of-box-sizing")
  .addEventListener("click", function () {
    unitLength = parseInt(document.querySelector("#rule-of-box-sizing").value);
    boxSizingValue.innerHTML = unitLength;
    setup();
    paint();
  });

function mouseDragged() {
  // If the mouse coordinate is outside the board

  if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
    return;
  }
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);
  if (rubberOrPen == true) {
    currentBoard[x][y] = 1;
    if (colorStyle == "random") {
      boxColor2X = Math.floor(Math.random() * 255);
      boxColor2Y = Math.floor(Math.random() * 255);
      boxColor2Z = Math.floor(Math.random() * 255);
      boxColor2 = color(boxColor2X, boxColor2Y, boxColor2Z);
      fill(boxColor2);
    } else if (colorStyle == "blue") {
      fill(0, 0, 255);
    } else if (colorStyle == "red") {
      fill(255, 0, 0);
    } else if (colorStyle == "green") {
      fill(0, 255, 0);
    } else if (colorStyle == "purple") {
      fill(255, 0, 255);
    } else if (colorStyle == "yellow") {
      fill(255, 255, 0);
    }
  } else {
    currentBoard[x][y] = 0;
    fill(208, 210, 214);
  }

  stroke(strokeColor);
  rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

//When mouse is pressed
function mousePressed() {
  noLoop();
  mouseDragged();
}

document.querySelector("#stop-game").addEventListener("click", function () {
  noLoop();
});

document.querySelector("#start-game").addEventListener("click", function () {
  loop();
});

// When mouse is released
/*
function mouseReleased() {
    loop();
}
*/

function generate() {
  //Loop over every single box on the board
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      // Count all living members in the Moore neighborhood(8 boxes surrounding)
      let neighbors = 0;
      for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
          if (i == 0 && j == 0) {
            // the cell itself is not its own neighbor
            continue;
          }
          // The modulo operator is crucial for wrapping on the edge
          neighbors +=
            currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
        }
      }

      // Rules of Life
      if (currentBoard[x][y] == 1 && neighbors < dieOfLoneliness) {
        // Die of Loneliness
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 1 && neighbors > dieOfOverpopulation) {
        // Die of Overpopulation
        nextBoard[x][y] = 0;
      } else if (
        currentBoard[x][y] == 0 &&
        neighbors == newLifeDueToReproduction
      ) {
        // New life due to Reproduction
        nextBoard[x][y] = 1;
      } else {
        // Stasis
        nextBoard[x][y] = currentBoard[x][y];
      }
    }
  }

  // Swap the nextBoard to be the current Board
  [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = random() > 0.8 ? 1 : 0;
      nextBoard[i][j] = 0;
    }
  }
}

function setup() {
  /* Set the canvas to be under the element #canvas*/
  const canvas = createCanvas(windowWidth, windowHeight - 100);
  canvas.parent(document.querySelector("#canvas"));

  /*Calculate the number of columns and rows */
  columns = floor(width / unitLength);
  rows = floor(height / unitLength);

  /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
  currentBoard = [];
  nextBoard = [];
  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
  }
  // Now both currentBoard and nextBoard are array of array of undefined values.
  init(); // Set the initial values of the currentBoard and nextBoard

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      objMark[`${i},${j}`] = 0;
    }
  }

  if (columns < 63 || rows < 27) {
    document.querySelector("#pattern-game5").innerHTML = "Disabled";
    document.querySelector("#pattern-game7").innerHTML = "Disabled";
  } else {
    document.querySelector("#pattern-game5").innerHTML = "119P4H1V0";
    document.querySelector("#pattern-game7").innerHTML = "Gosper glider gun";
  }
}

function paint() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 1 && objMark[`${i},${j}`] > 10) {
        if (colorStyle == "random") {
          fill(0);
        } else if (colorStyle == "blue") {
          fill(0, 0, 255);
        } else if (colorStyle == "red") {
          fill(255, 0, 0);
        } else if (colorStyle == "green") {
          fill(0, 255, 0);
        } else if (colorStyle == "purple") {
          fill(255, 0, 255);
        } else if (colorStyle == "yellow") {
          fill(255, 255, 0);
        }
      } else if (currentBoard[i][j] == 1) {
        if (colorStyle == "random") {
          boxColor2X = Math.floor(Math.random() * 255);
          boxColor2Y = Math.floor(Math.random() * 255);
          boxColor2Z = Math.floor(Math.random() * 255);
          boxColor2 = color(boxColor2X, boxColor2Y, boxColor2Z);
        } else if (colorStyle == "blue") {
          boxColor2X = Math.floor(Math.random() * 255);
          boxColor2Y = Math.floor(Math.random() * 255);
          boxColor2Z = 255;
          boxColor2 = color(boxColor2X, boxColor2Y, boxColor2Z);
        } else if (colorStyle == "red") {
          boxColor2X = 255;
          boxColor2Y = Math.floor(Math.random() * 255);
          boxColor2Z = Math.floor(Math.random() * 255);
          boxColor2 = color(boxColor2X, boxColor2Y, boxColor2Z);
        } else if (colorStyle == "green") {
          boxColor2X = Math.floor(Math.random() * 255);
          boxColor2Y = 255;
          boxColor2Z = Math.floor(Math.random() * 255);
          boxColor2 = color(boxColor2X, boxColor2Y, boxColor2Z);
        } else if (colorStyle == "purple") {
          boxColor2X = 255;
          boxColor2Y = Math.floor(Math.random() * 255);
          boxColor2Z = 255;
          boxColor2 = color(boxColor2X, boxColor2Y, boxColor2Z);
        } else if (colorStyle == "yellow") {
          boxColor2X = 255;
          boxColor2Y = 255;
          boxColor2Z = Math.floor(Math.random() * 255);
          boxColor2 = color(boxColor2X, boxColor2Y, boxColor2Z);
        }

        fill(boxColor2);
      } else if (currentBoard[i][j] == 2) {
        boxColor2 = color(243, 247, 5);
        fill(boxColor2);
      } else if (currentBoard[i][j] == 3) {
        fill(0);
      } else {
        fill(208, 210, 214);
      }
      stroke(strokeColor);
      rect(i * unitLength, j * unitLength, unitLength, unitLength);
    }
  }
}

function draw() {
  //background(0);
  frameRate(fr);
  generate();
  stableLife();
  paint();
}

document.querySelector("#reset-game").addEventListener("click", function () {
  init();
  loop();
});

document.querySelector("#clear-game").addEventListener("click", function () {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
  loop();
});

document.querySelector("#pattern-game1").addEventListener("click", function () {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
  let x = Math.floor(columns / 4);
  let y = Math.floor(rows / 4);

  currentBoard[0 + x][0 + y] = 1;
  currentBoard[1 + x][0 + y] = 1;
  currentBoard[1 + x][2 + y] = 1;
  currentBoard[2 + x][0 + y] = 1;
  currentBoard[2 + x][1 + y] = 1;
  paint();
});

document.querySelector("#pattern-game2").addEventListener("click", function () {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
  let x = Math.floor(columns / 4);
  let y = Math.floor(rows / 4);

  currentBoard[1 + x][1 + y] = 1;
  currentBoard[2 + x][0 + y] = 1;
  currentBoard[3 + x][1 + y] = 1;
  currentBoard[2 + x][1 + y] = 1;
  currentBoard[0 + x][1 + y] = 1;
  currentBoard[1 + x][2 + y] = 1;
  currentBoard[1 + x][3 + y] = 1;
  currentBoard[3 + x][2 + y] = 1;
  paint();
});

document.querySelector("#pattern-game3").addEventListener("click", function () {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
  let x = Math.floor(columns / 4);
  let y = Math.floor(rows / 4);

  currentBoard[0 + x][1 + y] = 1;
  currentBoard[1 + x][1 + y] = 1;
  currentBoard[1 + x][2 + y] = 1;
  currentBoard[5 + x][2 + y] = 1;
  currentBoard[6 + x][2 + y] = 1;
  currentBoard[7 + x][2 + y] = 1;
  currentBoard[6 + x][0 + y] = 1;
  paint();
});

document.querySelector("#pattern-game4").addEventListener("click", function () {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
  let x = Math.floor(columns / 4);
  let y = Math.floor(rows / 4);

  let patternArr = [];

  let pattern = `....xx......xx....
...x.x......x.x...
...x..........x...
xx.x..........x.xx
xx.x.x..xx..x.x.xx
...x.x.x..x.x.x...
...x.x.x..x.x.x...
xx.x.x..xx..x.x.xx
xx.x..........x.xx
...x..........x...
...x.x......x.x...
....xx......xx....`;

  pattern
    .split("\n")
    .map((line) => line.split("").map((c) => (c == "x" ? 1 : 0)))
    .forEach((xs, y) =>
      xs.forEach((value, x) =>
        patternArr.push({
          x,
          y,
          value,
        })
      )
    );

  for (let i = 0; i < patternArr.length; i++) {
    currentBoard[patternArr[i]["x"] + x][patternArr[i]["y"] + y] =
      patternArr[i]["value"];
  }
  paint();
});

document.querySelector("#pattern-game5").addEventListener("click", function () {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
  let x = Math.floor(columns / 4);
  let y = Math.floor(rows / 4);

  let patternArr = [];

  let pattern = `
        .................................x.
        ................x...............x.x
        ......x.x......x.....xx........x...
        ......x....x....x.xxxxxx....xx.....
        ......x.xxxxxxxx..........x..x.xxx.
        .........x.....x.......xxxx....xxx.
        ....xx.................xxx.x.......
        .x..xx.......xx........xx..........
        .x..x..............................
        x..................................
        .x..x..............................
        .x..xx.......xx........xx..........
        ....xx.................xxx.x.......
        .........x.....x.......xxxx....xxx.
        ......x.xxxxxxxx..........x..x.xxx.
        ......x....x....x.xxxxxx....xx.....
        ......x.x......x.....xx........x...
        ................x...............x.x
        .................................x.`;

  pattern
    .split("\n")
    .map((line) => line.split("").map((c) => (c == "x" ? 1 : 0)))
    .forEach((xs, y) =>
      xs.forEach((value, x) =>
        patternArr.push({
          x,
          y,
          value,
        })
      )
    );

  for (let i = 0; i < patternArr.length; i++) {
    currentBoard[patternArr[i]["x"] + x][patternArr[i]["y"] + y] =
      patternArr[i]["value"];
  }
  paint();
});

document.querySelector("#pattern-game6").addEventListener("click", function () {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
  let x = Math.floor(columns / 4);
  let y = Math.floor(rows / 4);

  let patternArr = [];

  function addDot(num) {
    let dot = "";
    for (let i = 0; i < num; i++) {
      dot += ".";
    }
    return dot;
  }

  function addX(num) {
    let x = "";
    for (let i = 0; i < num; i++) {
      x += "x";
    }
    return x;
  }

  function addComma(num) {
    let comma = ",";
    for (let i = 0; i < num; i++) {
      comma += ",";
    }
    return comma;
  }

  let pattern = `
        ${addDot(5)}${addX(6)}${addDot(5)}
        ${addDot(4)}${addX(1)}${addComma(5)}${addX(2)}${addDot(3)}
        ${addDot(3)}${addX(2)}${addComma(1)}${addX(2)}${addComma(3)}${addX(
    1
  )}${addDot(3)}
        ${addDot(1)}${addX(2)}${addComma(4)}${addX(2)}${addComma(2)}${addX(
    1
  )}${addDot(3)}
        ${addX(1)}${addComma(5)}${addX(3)}${addComma(3)}${addX(1)}${addDot(2)}
        ${addX(4)}${addComma(8)}${addX(1)}${addDot(2)}
        ${addDot(1)}${addX(1)}${addComma(10)}${addX(1)}${addDot(2)}
        ${addDot(2)}${addX(5)}${addComma(4)}${addX(1)}${addDot(3)}
        ${addDot(3)}${addX(2)}${addComma(4)}${addX(1)}${addComma(1)}${addX(
    2
  )}${addDot(3)}
        ${addDot(2)}${addX(1)}${addComma(1)}${addX(1)}${addComma(3)}${addX(
    1
  )}${addComma(3)}${addX(1)}${addDot(2)}
        ${addDot(2)}${addX(3)}${addComma(3)}${addX(4)}${addComma(1)}${addX(
    1
  )}${addDot(2)}
        ${addDot(4)}${addX(2)}${addComma(4)}${addX(1)}${addComma(2)}${addX(
    1
  )}${addDot(1)}
        ${addDot(2)}${addX(2)}${addComma(2)}${addX(4)}${addComma(3)}${addX(
    1
  )}${addDot(1)}
        ${addDot(1)}${addX(1)}${addComma(1)}${addX(1)}${addComma(1)}${addX(
    2
  )}${addDot(1)}${addX(1)}${addComma(1)}${addX(1)}${addX(1)}
        ${addDot(1)}${addX(6)}${addDot(1)}${addX(7)}`;

  pattern
    .split("\n")
    .map((line) => line.split("").map((c) => (c == "x" ? 3 : c == "," ? 2 : 0)))
    .forEach((xs, y) =>
      xs.forEach((value, x) =>
        patternArr.push({
          x,
          y,
          value,
        })
      )
    );

  for (let i = 0; i < patternArr.length; i++) {
    currentBoard[patternArr[i]["x"] + x][patternArr[i]["y"] + y] =
      patternArr[i]["value"];
  }

  paint();
});

document.querySelector("#pattern-game7").addEventListener("click", function () {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
  let x = Math.floor(columns / 4);
  let y = Math.floor(rows / 4);

  let patternArr = [];

  function addDot(num) {
    let dot = "";
    for (let i = 0; i < num; i++) {
      dot += ".";
    }
    return dot;
  }

  function addX(num) {
    let x = "";
    for (let i = 0; i < num; i++) {
      x += "x";
    }
    return x;
  }

  let pattern = `
${addDot(28)}${addX(1)}${addDot(11)}
${addDot(26)}${addX(1)}${addDot(1)}${addX(1)}${addDot(11)}
${addDot(16)}${addX(2)}${addDot(6)}${addX(2)}${addDot(12)}${addX(2)}
${addDot(15)}${addX(1)}${addDot(3)}${addX(1)}${addDot(4)}${addX(2)}${addDot(
    12
  )}${addX(2)}
${addDot(4)}${addX(2)}${addDot(8)}${addX(1)}${addDot(5)}${addX(1)}${addDot(
    3
  )}${addX(2)}${addDot(14)}
${addDot(4)}${addX(2)}${addDot(8)}${addX(1)}${addDot(3)}${addX(1)}${addDot(
    1
  )}${addX(2)}${addDot(4)}${addX(1)}${addDot(1)}${addX(1)}${addDot(11)}
${addDot(14)}${addX(1)}${addDot(5)}${addX(1)}${addDot(7)}${addX(1)}${addDot(11)}
${addDot(15)}${addX(1)}${addDot(3)}${addX(1)}${addDot(20)}
${addDot(16)}${addX(2)}${addDot(22)}`;

  pattern
    .split("\n")
    .map((line) => line.split("").map((c) => (c == "x" ? 1 : 0)))
    .forEach((xs, y) =>
      xs.forEach((value, x) =>
        patternArr.push({
          x,
          y,
          value,
        })
      )
    );

  for (let i = 0; i < patternArr.length; i++) {
    currentBoard[patternArr[i]["x"] + x][patternArr[i]["y"] + y] =
      patternArr[i]["value"];
  }
  paint();
});

document.querySelector("#color-random").addEventListener("click", function () {
  colorStyle = "random";
  paint();
});

document.querySelector("#color-blue").addEventListener("click", function () {
  colorStyle = "blue";
  paint();
});

document.querySelector("#color-green").addEventListener("click", function () {
  colorStyle = "green";
  paint();
});

document.querySelector("#color-red").addEventListener("click", function () {
  colorStyle = "red";
  paint();
});

document.querySelector("#color-purple").addEventListener("click", function () {
  colorStyle = "purple";
  paint();
});

document.querySelector("#color-yellow").addEventListener("click", function () {
  colorStyle = "yellow";
  paint();
});

document.querySelector("#rubber").addEventListener("click", function () {
  rubberOrPen = false;
});

document.querySelector("#pen").addEventListener("click", function () {
  rubberOrPen = true;
});

function stableLife() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 1) {
        objMark[`${i},${j}`] += 1;
      } else if (currentBoard[i][j] == 0) {
        objMark[`${i},${j}`] = 0;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 100);
}
