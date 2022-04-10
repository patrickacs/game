class Sprite {
  width = 50
  height = 150

  constructor({ position}) {
    this.position = position;

  }

  draw() {
  }

  update() {
    this.draw();
}
}
class Fighter {
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
