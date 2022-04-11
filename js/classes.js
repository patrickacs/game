class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 }
  }) {
    this.position = position
    this.width = 50
    this.height = 150
    this.image = new Image()
    this.image.src = imageSrc
    this.scale = scale
    this.framesMax = framesMax
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5
    this.offset = offset
  }

  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    )
  }

  animateFrames() {
    this.framesElapsed++

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++
      } else {
        this.switchSprite('idle')
        this.framesCurrent = 0
      }
    }
  }

  update() {
    this.draw()
    this.animateFrames()
  }
}

class Fighter extends Sprite {
  width = 50
  height = 150
  jumpedTimes = 0;

  leftPressed = false;
  rightPressed = false;

  isAttacking = false;
  isAttackingInCooldown = false;
  
  constructor({
    position,
    velocity,
    color = 'red',
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset,
    sprites,
  }) {
    super({
      imageSrc,
      scale,
      framesMax,
    })
    this.position = position;
    this.velocity = velocity;
    this.offset = offset ?? {
      x: 0,
      y: 0,
    };

    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      width: 250,
      height: 50,
    }
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5
    this.sprites = sprites
    this.health = 100;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSrc
    }
  }

  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - 225,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    )

    // c.fillStyle = "red";
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);

    // draw attack box
    // if(this.isAttacking) {
      // c.fillStyle = "blue";
      // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
    // }
  }

  handlePressedKeys() {
    if(this.leftPressed && this.rightPressed) {
      this.velocity.x = 0;
      this.switchSprite("idle")

    } else {
      if (this.leftPressed) {
        this.velocity.x = -5;
        this.switchSprite("run")
        // this.offset.x = this.width - this.attackBox.width;
      }
      else if (this.rightPressed) {
        this.velocity.x = 5;
        this.switchSprite("run")
        // this.offset.x = 0;
      } else {
        this.velocity.x = 0;
        this.switchSprite("idle")
      }
    }

    if(this.velocity.y < 0) {
      this.switchSprite("jump")
    }
    if(this.position.y < canvas.height - this.height && this.velocity.y >= 0) {
      console.log(this.velocity.y)
      this.switchSprite("fall")
    }
  }
  
  attack() {
    if (!this.isAttackingInCooldown) {
      this.switchSprite('attack1');
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
    this.attackBox.position.x = this.position.x + this.offset.x;
    this.attackBox.position.y = this.position.y + 25;

    this.draw();
    this.animateFrames();
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

  switchSprite(sprite) {
    // overriding all other animations with the attack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return

    // override when fighter gets hit
    // if (
    //   this.image === this.sprites.takeHit.image &&
    //   this.framesCurrent < this.sprites.takeHit.framesMax - 1
    // )
    //   return

    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image
          this.framesMax = this.sprites.idle.framesMax
          this.framesCurrent = 0
        }
        break
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image
          this.framesMax = this.sprites.run.framesMax
          this.framesCurrent = 0
        }
        break
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image
          this.framesMax = this.sprites.jump.framesMax
          this.framesCurrent = 0
        }
        break
      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image
          this.framesMax = this.sprites.fall.framesMax
          this.framesCurrent = 0
        }
        break

      case 'attack1':
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image
          this.framesMax = this.sprites.attack1.framesMax
          this.framesCurrent = 0
        }
        break

    }
  }
}
