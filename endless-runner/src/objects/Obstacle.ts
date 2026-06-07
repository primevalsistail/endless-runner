import Phaser from 'phaser';

export abstract class Obstacle extends Phaser.GameObjects.Rectangle {
  scrollSpeed = 0;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 0, 0);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
  }

  activate(x: number, y: number, width: number, height: number, speed: number): void {
    this.setPosition(x, y);
    this.setSize(width, height);
    this.scrollSpeed = speed;
    this.setActive(true);
    this.setVisible(true);
    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(width, height);
    body.reset(x, y);
  }

  deactivate(): void {
    this.setActive(false);
    this.setVisible(false);
  }

  abstract update(deltaMs: number): void;
}
