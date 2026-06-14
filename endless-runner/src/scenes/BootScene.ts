import Phaser from 'phaser';
import { TextureFactory } from '../graphics/TextureFactory';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    TextureFactory.createAll(this);
    this.scene.start('MenuScene');
  }
}
