import Phaser from 'phaser';

export class RecoveryItem extends Phaser.GameObjects.Image {
  scrollSpeed = 0;
  private baseY = 0;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'bandaid');
    scene.add.existing(this);
    this.setActive(false).setVisible(false);
  }

  activate(x: number, y: number, speed: number): void {
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
