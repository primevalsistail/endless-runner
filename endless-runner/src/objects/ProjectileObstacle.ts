import { Obstacle } from './Obstacle';

export class ProjectileObstacle extends Obstacle {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.setFillStyle(0xff6600);
  }

  update(deltaMs: number): void {
    const deltaSeconds = deltaMs / 1000;
    this.x -= this.scrollSpeed * deltaSeconds;
    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.reset(this.x, this.y);
  }
}
