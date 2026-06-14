import Phaser from 'phaser';
import type { PowerUpType } from '../powerups/PowerUp';

export class PowerUpItem extends Phaser.GameObjects.Image {
  type: PowerUpType = 'doubleJump';
  scrollSpeed = 0;
  private baseY = 0;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'boot');
    scene.add.existing(this);
    this.setActive(false).setVisible(false);
  }

  activate(x: number, y: number, type: PowerUpType, speed: number): void {
    this.type = type;
    this.setTexture(type === 'invincibility' ? 'shield' : 'boot');
    this.setPosition(x, y);
    this.baseY = y;
    this.scrollSpeed = speed;
    this.setActive(true).setVisible(true);
  }

  deactivate(): void {
    this.setActive(false).setVisible(false);
  }

  update(deltaMs: number): void {
    this.x -= this.scrollSpeed * (deltaMs / 1000);
    this.y = this.baseY + Math.sin(this.scene.time.now * 0.0025) * 6;
  }
}
