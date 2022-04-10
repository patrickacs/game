const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;
gameEnded = false;

const player1 = new Fighter({
  position: { x: 128, y: 0 }, 
  velocity: { x: 0, y: 0 }
});

const player2 = new Fighter({
  position: { x: 840, y: 100 }, 
  velocity: { x: 0, y: 0 },
  offset: -50
});



animate();

const handleKeyDown = {
  "w": function () {
    if(player1.jumpedTimes < 2) {
      player1.velocity.y = -12;
      player1.jumpedTimes++;
    }
  },
  "a": () => {
    player1.leftPressed = true;
    // player1.velocity.x = -5;
  },
  "s": () => {
    player1.velocity.y = 10;
  },
  "d": () => {
    player1.rightPressed = true;
    // player1.velocity.x = 5;
  },
  " ": () => {
    player1.attack();
  },
  "ArrowUp": function () {
    if(player2.jumpedTimes < 2) {
      player2.velocity.y = -12;
      player2.jumpedTimes++;
    }
  },
  "ArrowLeft": () => {
    player2.leftPressed = true;
    // player2.velocity.x = -5;
  },
  "ArrowDown": () => {
    player2.velocity.y = 10;
  },
  "ArrowRight": () => {
    player2.rightPressed = true;
    // player2.velocity.x = 5;
  },
  "Control": () => {
    player2.attack();
  }
}

window.addEventListener("keydown", (event) => {
  if (handleKeyDown[event.key]) {
    handleKeyDown[event.key]();
  }
});


const handleKeyUp = {
  "a": () => {
    player1.leftPressed = false;
    // player1.velocity.x = -5;
  },
  "d": () => {
    player1.rightPressed = false;
    // player1.velocity.x = 5;
  },
  "ArrowLeft": () => {
    player2.leftPressed = false;
    // player2.velocity.x = -5;
  },
  "ArrowRight": () => {
    player2.rightPressed = false;
    // player2.velocity.x = 5;
  },
}

window.addEventListener("keyup", (event) => {
  if(handleKeyUp[event.key]) {
    handleKeyUp[event.key]();
  }
});

