import Phaser from 'phaser';
import { TextureFactory } from '../graphics/TextureFactory';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    for (let i = 0; i < 8; i++) {
      this.load.image(`ninja-${i}`, `sprites/ninja-${i}.png`);
      this.load.image(`jump-${i}`, `sprites/jump-${i}.png`);
    }
  }

  create(): void {
    TextureFactory.createAll(this);
    this.scene.start('MenuScene');
  }
}
