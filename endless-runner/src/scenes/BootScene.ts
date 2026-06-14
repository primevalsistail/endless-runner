import Phaser from 'phaser';
import { TextureFactory } from '../graphics/TextureFactory';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    this.load.image('ninja-0', 'sprites/ninja-0.png');
    this.load.image('ninja-1', 'sprites/ninja-1.png');
    this.load.image('ninja-2', 'sprites/ninja-2.png');
    this.load.image('ninja-3', 'sprites/ninja-3.png');
  }

  create(): void {
    TextureFactory.createAll(this);
    this.scene.start('MenuScene');
  }
}
