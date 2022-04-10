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