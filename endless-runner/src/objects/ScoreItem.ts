import Phaser from 'phaser';

export class ScoreItem extends Phaser.GameObjects.Polygon {
  scrollSpeed = 0;

  constructor(scene: Phaser.Scene) {
    const diamond = [0, -18, 14, 0, 0, 18, -14, 0];
    super(scene, 0, 0, diamond, 0xffdd00);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.setActive(false).setVisible(false);
  }

  activate(x: number, y: number, speed: number): void {
    this.setPosition(x, y);
    this.scrollSpeed = speed;
    this.setActive(true).setVisible(true);
    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(28, 36);
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
