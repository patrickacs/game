const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;
gameEnded = false;
function rectangularColision(rect1, rect2) {
  return rect1.position.x + rect1.width >= rect2.position.x &&
    rect1.position.x <= rect2.position.x + rect2.width &&
    rect1.position.y + rect1.height > rect2.position.y &&
    rect1.position.y < rect2.position.y + rect2.height;
}

function endGame() {
  if (player1.health <= 0 || player2.health <= 0) {
    document.querySelector('#endGame').style.display = 'flex';
    document.querySelector('#endGame').innerHTML =
      player1.health <= 0 ? 'Player 2 Wins!' : 'Player 1 Wins!';
    gameEnded = true;
  }
}


class Sprite {
  width = 50
  height = 150
  jumpedTimes = 0;

  leftPressed = false;
  rightPressed = false;

  isAttacking = false;
  isAttackingInCooldown = false;
  
  constructor({ position, velocity, offset }) {
    this.position = position;
    this.velocity = velocity;
    this.offset = offset ?? 0;

    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      width: 100,
      height: 50,
    }
    this.health = 100;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    // draw attack box
    if(this.isAttacking) {
      c.fillStyle = "blue";
      c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
    }
  }

  handlePressedKeys() {
    if(this.leftPressed && this.rightPressed) {
      this.velocity.x = 0;
    } else {
      if (this.leftPressed) {
        this.velocity.x = -5;
        this.offset = -50;
      }
      else if (this.rightPressed) {
        this.velocity.x = 5;
        this.offset = 0;
      } else {
        this.velocity.x = 0;
      }
    }
  }
  
  attack() {
    if (!this.isAttackingInCooldown) {
      this.isAttacking = true;
      this.isAttackingInCooldown = true;
      setTimeout(() => {
        this.isAttacking = false;
      }, 100);
      setTimeout(() => {
        this.isAttackingInCooldown = false;
      }, 500)
    }
  }

  update() {
    this.handlePressedKeys();
    this.attackBox.position.x = this.position.x + this.offset;
    this.attackBox.position.y = this.position.y + 25;

    this.draw();
    this.velocity.y += gravity;
    if (this.velocity.y < 0) {
      if (this.position.y + this.velocity.y > 0) {
        this.position.y += this.velocity.y;
      } else {
        this.position.y = 0;
        this.velocity.y = 0;
      }
    } else {
      if (this.position.y + this.velocity.y < canvas.height - this.height) {
        this.position.y += this.velocity.y;
      } else {
        this.position.y = canvas.height - this.height;
        this.jumpedTimes = 0;
      }
    }
    
    if (this.velocity.x < 0) {
      if (this.position.x + this.velocity.x > 0) {
        this.position.x += this.velocity.x;
      } else {
        this.position.x = 0;
      }
    } else {
      if (this.position.x + this.velocity.x < canvas.width - this.width) {
        this.position.x += this.velocity.x;
      } else {
        this.position.x = canvas.width - this.width;
      }
    }
  }
}

const player1 = new Sprite({
  position: { x: 128, y: 0 }, 
  velocity: { x: 0, y: 0 }
});

const player2 = new Sprite({
  position: { x: 840, y: 100 }, 
  velocity: { x: 0, y: 0 },
  offset: -50
});

function animate() {
  if(gameEnded == false) {
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    player1.update();
    player2.update();

    // Detect Colisions
    if(rectangularColision(player1.attackBox, player2) && player1.isAttacking) {
      player1.isAttacking = false;
      player2.health -= 10;
      document.querySelector('#player2Health').style.width = player2.health + '%';
      endGame();
    }
    if(rectangularColision(player2.attackBox, player1) && player2.isAttacking) {
      player2.isAttacking = false;
      player1.health -= 10;
      document.querySelector('#player1Health').style.width= player1.health + '%';
      endGame();
    }
  } else {
    window.cancelAnimationFrame(animate);
  }
}

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
  // switch (event.key) {
  //   case "a":
  //     if(player1.velocity.x < 0) {
  //       player1.velocity.x = 0;
  //     }
  //   case "d":
  //     if(player1.velocity.x > 0) {
  //       player1.velocity.x = 0;
  //     }
  // }
  // if (event.key === "a" || event.key === "d") {
  //   player1.velocity.x = 0;
  // }
  // if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
  //   player2.velocity.x = 0;
  // }
});

