

const playFieldOffsetLeft = 8;
const playFieldOffsetTop = 50;

const collectibleSprite =  {
    width: 38,
    height: 18,
    srcs: '/images/Rahmen.png'
  }
const spriteWidth = collectibleSprite.width;
const spriteHeight = collectibleSprite.height;

class Collectible {
  constructor({ x, y, value = 1 }) {
    this.x = x;
    this.y = y;
    this.value = value;
 
  }

  setState({ x, y, value = 1 }) {
    this.x = x;
    this.y = y;
    this.value = value;
  }

  draw(ctx, sprites) {
    const x = this.x + playFieldOffsetLeft;
    const y = this.y + playFieldOffsetTop;
    ctx.drawImage(sprites, x, y, spriteWidth, spriteHeight);
  }
}

export default Collectible;
