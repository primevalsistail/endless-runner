import Phaser from 'phaser';

export abstract class Obstacle extends Phaser.GameObjects.Image {
  scrollSpeed = 0;

  constructor(scene: Phaser.Scene, textureKey: string) {
    super(scene, 0, 0, textureKey);
    scene.add.existing(this);
  }

  activate(x: number, y: number, width: number, height: number, speed: number): void {
    this.setPosition(x, y);
    this.setDisplaySize(width, height);
    this.scrollSpeed = speed;
    this.setActive(true).setVisible(true);
  }

  deactivate(): void {
    this.setActive(false).setVisible(false);
  }

  abstract update(deltaMs: number): void;
}
