const gameConfig = {
  title: 'Secure Multiplayer Game',
  controlInfo: 'Controls: WASD',
  gameWindowWidth: 640,
  gameWindowHeight: 480,
  padding: 8,
  infoFieldHeight: 50,
  get playField() {
    return {
      width: this.gameWindowWidth - 2 * this.padding,
      height: this.gameWindowHeight - this.padding - this.infoFieldHeight,
    };
  }
};

export default function createGameBoard(ctx, playerRank) {
  // Play field border
  ctx.beginPath();
  ctx.rect(gameConfig.padding, gameConfig.infoFieldHeight, gameConfig.playField.width, gameConfig.playField.height);
  ctx.strokeStyle = '#a8a8ac';
  ctx.stroke();
  ctx.closePath();

  // Game info text y position
  const infoTextPosY = gameConfig.infoFieldHeight / 1.5;

  // Game control
   ctx.font = 'italic 15 pt Calibri';
  ctx.fillStyle = "white";
  ctx.textAlign = 'start';
  ctx.fillText(gameConfig.controlInfo, 100, 30);

  // Game title
   ctx.font = 'italic 15 pt Calibri';
  ctx.fillStyle = "white";
  ctx.textAlign = 'center';
  ctx.fillText(gameConfig.title,  300, 30);


  // Player's rank
   ctx.font = 'italic 15 pt Calibri';
  ctx.fillStyle = "white";
  ctx.textAlign = 'end';
  ctx.fillText(playerRank, 500, 30);

}