class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
    this.speed = 5;
    this.dir = null;
  }

  draw(ctx, image) {
 
    if (this.dir) {
      this.movePlayer(this.dir, this.speed);
    }
    
    let x = this.x + 8;
    let y = this.y + 50;

    ctx.drawImage(image, x, y, 40, 40);
  }

  movePlayer(dir, speed) {
    switch (dir) {
      case 'up':
        this.y = this.y - speed >= 0 ? this.y - speed : 0;
        break;
      case 'down':
        this.y =
          this.y + speed <= 422 - 40
            ? this.y + speed
            : 422 - 40;
        break;
      case 'right':
        this.x =
          this.x + speed <= 624 - 40
            ? this.x + speed
            : 624 - 40;
        break;
      case 'left':
        this.x = this.x - speed >= 0 ? this.x - speed : 0;
      default:
        this.x = this.x;
        this.y = this.y;
    }
  }

  collision(collectible) {
      const l1 = {
      x: this.x,
      y: this.y,
    };

    const r1 = {
      x: this.x + 40,
      y: this.y + 40,
    };

    const l2 = {
      x: collectible.x,
      y: collectible.y,
    };

    const r2 = {
      x: collectible.x + 40,
      y: collectible.y + 40,
    };


    if (l1.x >= r2.x || l2.x >= r1.x) {
      return false;
    }

    if (r1.y <= l2.y || r2.y <= l1.y) {
      return false;
    }

    return true;
  }

  calculateRank(players) {
    const numOfPlayers = players.length;
    let rank;

    if (this.score === 0) {
      rank = numOfPlayers;
    } else {
      const sortedPlayers = players.sort(
        (playerA, playerB) => playerB.score - playerA.score
      );
      rank = sortedPlayers.findIndex((player) => player.id === this.id) + 1;
    }
    return `Rank: ${rank} / ${numOfPlayers}`;
  }
}


export default Player;
