const unitLength = 26;
const boxColor = 150;
const strokeColor = 50;
let columns; /* To be determined by window width */
let rows; /* To be determined by window height */
let currentBoard = [];
let nextBoard = [];
// const stop = document.querySelector("#stop");
let isPause = false;
let reset = false;
let r = Math.floor(Math.random() * 255);
let g = Math.floor(Math.random() * 255);
let b = Math.floor(Math.random() * 255);
let Color = false;
let canInit = true;
let dx = null;
let dy = null;

// button;

// document
//   .getElementById("gosper_glider_gun")
//   .addEventListener("click", (setGun) => {});

// document.getElementById("colorRGBA").addEventListener("click", () => {
//   colorRGBA();
// });
let directionIsActive = false;
document.getElementById("direction").addEventListener("click", () => {
  noLoop();
  directionIsActive = !directionIsActive;
  // directionPoint();
});

document.getElementById("drawColor").addEventListener("click", () => {
  Color = !Color;
});

document.getElementById("range").addEventListener("change", (event) => {
  frameRate(event.target.valueAsNumber);
});

document.getElementById("stop").addEventListener("click", () => {
  isPause = true;
  noLoop();
});
document.getElementById("start").addEventListener("click", () => {
  isPause = false;
  loop();
});
document.getElementById("resetGame").addEventListener("click", () => {
  init();
  draw();
});

document.getElementById("random").addEventListener("click", () => {
  if (isPause) {
    isPause = false;
    loop();
  }
  randomDrow();
});

// alway on
window.addEventListener("resize", (e) => {
  setup();
  init();
});

// function windowResized() {
//   if (windowWidth >= 2800) {
//     windowWidth = 2800;
//   }

//   if (windowHeight >= 1328) {
//     windowHeight = 1328;
//   }
//   //const canvas = createCanvas(windowWidth - 20, windowHeight - 208);
//   resizeCanvas(windowWidth - 20, windowHeight - 208);
//   columns = floor(width / unitLength);
//   rows = floor(height / unitLength);
//   const newCurrentBoard = [];
//   for (let i = 0; i < columns; i++) {
//     newCurrentBoard[i] = [];
//   }

//   for (let x = 0; x < columns; x++) {
//     for (let y = 0; y < rows; y++) {
//       newCurrentBoard[x][y] = currentBoard[x][y];
//       if ((currentBoard[x][y] = undefined)) {
//         currentBoard[x][y] = newCurrentBoard[x][y];
//       }
//     }
//   }
//   [currentBoard, newCurrentBoard] = [newCurrentBoard, currentBoard];
// }

//set up
function setup() {
  frameRate(5);

  if (windowWidth >= 1320) {
    windowWidth = 1320;
  }

  if (windowHeight >= 1328) {
    windowHeight = 1328;
  }
  const canvas = createCanvas(windowWidth - 20, windowHeight - 208);
  canvas.parent(document.querySelector("#canvas"));

  columns = floor(width / unitLength);
  rows = floor(height / unitLength);

  currentBoard = [];
  nextBoard = [];

  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
  }
  //window size change
  if (canInit) {
    init();
  }
  canInit = false;
}
//Draw Function
function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
}

function draw() {
  background(255);
  generate();
  // if ((document.getElementsById("stop").innerHTML = stop)) {
  // return stop;
  // } else {

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 1) {
        fill(color(r, g, b));
      } else {
        fill(color(240, 240, 240));
      }
      stroke(color(100, 100, 100));
      rect(i * unitLength, j * unitLength, unitLength, unitLength);
    }
  }
  //}
}
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
      if (currentBoard[x][y] == 1 && neighbors < 2) {
        // Die of Loneliness
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 1 && neighbors > 3) {
        // Die of Overpopulation
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 0 && neighbors == 3) {
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
let cur_x;
let cur_y;
function mouseDragged() {
  /**
   * If the mouse coordinate is outside the board
   */
  if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
    return;
  }
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);
  currentBoard[x][y] = 1;
  fill(boxColor);
  stroke(strokeColor);
  rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

/**
 * When mouse is pressed
 */
function mousePressed() {
  noLoop();

  mouseDragged();
  if (directionIsActive) {
    directionPoint();
  }

  cur_x = Math.floor(mouseX / unitLength);
  cur_y = Math.floor(mouseY / unitLength) - 1;
}

/**
 * When mouse is released
 */
function mouseReleased() {
  if (!isPause) {
    loop();
  }
}

// let range = document.querySelector("#range");

function randomDrow() {
  let x = 0;
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      x = Math.random();
      if (x >= 0.5) {
        currentBoard[i][j] = 1;
      } else {
        currentBoard[i][j] = 0;
      }
    }
  }
}

randomColor();
function randomColor() {
  let t = 0;
  setInterval(() => {
    t++;
    if (!Color) {
      r = 0;
      g = 0;
      b = 0;
      return;
    }
    r = Math.floor(Math.random() * 255 - 30);
    g = Math.floor(Math.random() * 255 - 30);
    b = Math.floor(Math.random() * 255 - 30);
  }, 500);
}

// function checkYDirection(y) {
//   let dy = parseInt(y);
//   if (dy > rows - 1) {
//     return 0;
//   } else if (dy < 0) {
//     return rows;
//   } else {
//     return dy;
//   }
// }
// function checkXDirection(x) {
//   let dx = parseInt(x);

//   if (dx > columns - 1) {
//     return 0;
//   } else if (dx < 0) {
//     return columns;
//   } else {
//     return dx;
//   }
// }

let pos_span = document.querySelector("#position");
function directionPoint() {
  noLoop();
  let x = Math.floor(mouseX / unitLength);
  let y = Math.floor(mouseY / unitLength);
  if (x > columns - 1 || y > rows - 1) {
    return;
  }

  isPause = false;
  //loop();
  if (dx === null) {
    dx = x;
  }
  if (dy === null) {
    dy = y;
  }

  // if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
  //   return;
  // }
  // const x = Math.floor(mouseX / unitLength);
  // const y = Math.floor(mouseY / unitLength);
  // fill(color(240, 0, 0));

  let previousX = -1;
  let previousY = -1;

  document.body.addEventListener("keydown", function (event) {
    noLoop();

    if (event.keyCode == 38) {
      //up

      if (previousX >= 0 && previousY >= 0) {
        currentBoard[previousX][previousY] = 0;
      } else {
        previousX = cur_x;
        previousY = cur_y;
        currentBoard[previousX][previousY] = 0;
      }
      dx = previousX; //checkXDirection(dx); 行的路線
      dy = previousY - 1; //checkYDirection(dy - 1);

      pos_span.innerHTML = `${dx} - ${dy}`; //睇下自己去咗邊(已數字表達)

      currentBoard[dx][dy] = 1;

      stroke(100, 100, 100);

      fill(240, 240, 240);
      //if (previousX >= 0 && previousX >= 0) {
      rect(
        previousX * unitLength,
        previousY * unitLength,
        unitLength,
        unitLength
      );
      //}

      fill("red");
      rect(dx * unitLength, dy * unitLength, unitLength, unitLength);

      previousX = dx;
      previousY = dy;
    } else if (event.keyCode == 40) {
      //down
      // dx = checkXDirection(dx);
      // dy = checkYDirection(dy + 1);
      // const x = Math.floor(mouseX / unitLength);
      // const y = Math.floor(mouseY / unitLength) + 1;

      if (previousX >= 0 && previousY >= 0) {
        currentBoard[previousX][previousY] = 0;
      } else {
        previousX = cur_x;
        previousY = cur_y;
        currentBoard[previousX][previousY] = 0;
      }
      pos_span.innerHTML = `${dx} - ${dy}`;
      dx = previousX;
      dy = previousY + 1;
      pos_span.innerHTML = `${dx} - ${dy}`;
      currentBoard[dx][dy] = 1;
      stroke(100, 100, 100);

      fill(240, 240, 240);
      rect(
        previousX * unitLength,
        previousY * unitLength,
        unitLength,
        unitLength
      );
      fill("red");
      rect(dx * unitLength, dy * unitLength, unitLength, unitLength);

      previousX = dx;
      previousY = dy;
    } else if (event.keyCode == 37) {
      //left
      // dx = checkXDirection(dx - 1);
      // dy = checkYDirection(dy);
      // pos_span.innerHTML = `${dx} - ${dy}`;
      // const x = Math.floor(mouseX / unitLength) - 1;
      // const y = Math.floor(mouseY / unitLength);

      if (previousX >= 0 && previousY >= 0) {
        currentBoard[previousX][previousY] = 0;
      } else {
        previousX = cur_x;
        previousY = cur_y;
        currentBoard[previousX][previousY] = 0;
      }
      pos_span.innerHTML = `${dx} - ${dy}`;
      dx = previousX - 1;
      dy = previousY;
      pos_span.innerHTML = `${dx} - ${dy}`;
      currentBoard[dx][dy] = 1;
      stroke(100, 100, 100);

      fill(240, 240, 240);
      rect(
        previousX * unitLength,
        previousY * unitLength,
        unitLength,
        unitLength
      );
      fill("red");
      rect(dx * unitLength, dy * unitLength, unitLength, unitLength);

      previousX = dx;
      previousY = dy;
    } else if (event.keyCode == 39) {
      //right
      // dx = checkXDirection(dx + 1);
      // dy = checkYDirection(dy);
      // const x = Math.floor(mouseX / unitLength) + 1;
      // const y = Math.floor(mouseY / unitLength);
      // pos_span.innerHTML = `${dx} - ${dy}`;

      // if (previousX >= 0 && previousY >= 0) {
      //   currentBoard[previousX][previousY] = 0;

      // if (previousX >= 0 && previousY >= 0) {
      //   currentBoard[previousX][previousY] = 0;
      // } else {
      //   previousX = cur_x;
      //   previousY = cur_y;
      //   currentBoard[previousX][previousY] = 0;
      // }
      // pos_span.innerHTML = `${dx} - ${dy}`;
      // dx = previousX + 1;
      // dy = previousY;
      // pos_span.innerHTML = `${dx} - ${dy}`;
      // currentBoard[dx][dy] = 1;
      // stroke(100, 100, 100);

      // fill(240, 240, 240);
      // rect(
      //   previousX * unitLength,
      //   previousY * unitLength,
      //   unitLength,
      //   unitLength
      // );
      // fill("red");
      // rect(dx * unitLength, dy * unitLength, unitLength, unitLength);

      // previousX = dx;
      // previousY = dy;

      if (previousX >= 0 && previousY >= 0) {
        currentBoard[previousX][previousY] = 0;
      } else {
        previousX = cur_x;
        previousY = cur_y;
        currentBoard[previousX][previousY] = 0;
      }
      pos_span.innerHTML = `${dx} - ${dy}`;
      dx = previousX + 1;
      dy = previousY;
      pos_span.innerHTML = `${dx} - ${dy}`;
      currentBoard[dx][dy] = 1;
      stroke(100, 100, 100);

      fill(240, 240, 240);
      rect(
        previousX * unitLength,
        previousY * unitLength,
        unitLength,
        unitLength
      );
      fill("red");
      rect(dx * unitLength, dy * unitLength, unitLength, unitLength);

      previousX = dx;
      previousY = dy;
    } else if (event.keyCode == 32) {
      // pos_span.innerHTML = `${dx} - ${dy}`;
      // currentBoard[dx][dy] = 1;

      //成功寫1,跟隨紅格寫1
      // currentBoard[dx][dy] = 1;
      fill(boxColor);
      stroke(strokeColor);
      rect(
        previousX * unitLength,
        previousY * unitLength,
        unitLength,
        unitLength
      );

      // previousX = dx;
      // previousY = dy;
      //1
      // currentBoard[x][y] = 1;
      // fill(boxColor);
      // stroke(strokeColor);
      // rect(x * unitLength, y * unitLength, unitLength, unitLength);
    } else if (event.keyCode == 13) {
      Loop();
    }
  });
}

// document.body.addEventListener("keydown", function (event) {
//   console.log(event.keyCode);
// });
// function colorRGBA() {
//   let t = 0;
//   let a = 0;
//   setInterval(() => {
//     t++;
//     a = a + 0.1;
//     if (currentBoard[i][j] == 1 || a>= 1) {
//       fill(color(r, g, b, a));
//     }
//     return;
//   }, 1000);
// }

// function softChange() {
//   if (xcolor) {
//     changeArr[6] = changeArr[6] + 0.05;
//     if (changeArr[6] >= 1) {
//       changeArr[6] = 0;
//       changeArr[0] = changeArr[3];
//       changeArr[1] = changeArr[4];
//       changeArr[2] = changeArr[5];
//       changeArr[3] = Math.floor(Math.random() * 255);
//       changeArr[4] = Math.floor(Math.random() * 255);
//       changeArr[5] = Math.floor(Math.random() * 255);
//     }
//   }
// }
