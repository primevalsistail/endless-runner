import Phaser from 'phaser';
import type { PowerUpType } from '../powerups/PowerUp';

export class PowerUpItem extends Phaser.GameObjects.Polygon {
  type: PowerUpType = 'doubleJump';
  scrollSpeed = 0;

  constructor(scene: Phaser.Scene) {
    const diamond = [0, -20, 16, 0, 0, 20, -16, 0];
    super(scene, 0, 0, diamond, 0xffee00);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.setActive(false).setVisible(false);
  }

  activate(x: number, y: number, type: PowerUpType, speed: number): void {
    this.setPosition(x, y);
    this.type = type;
    this.scrollSpeed = speed;
    this.setActive(true).setVisible(true);
    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(32, 40);
    body.reset(x, y);
  }

  deactivate(): void {
    this.setActive(false).setVisible(false);
  }

  update(deltaMs: number): void {
    const deltaSeconds = deltaMs / 1000;
    this.x -= this.scrollSpeed * deltaSeconds;
    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.reset(this.x, this.y);
  }
}
