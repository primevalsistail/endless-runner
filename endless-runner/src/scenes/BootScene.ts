import Phaser from 'phaser';
import { TextureFactory } from '../graphics/TextureFactory';
import { AudioManager } from '../services/AudioManager';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    for (let i = 0; i < 8; i++) {
      this.load.image(`ninja-${i}`, `sprites/ninja-${i}.png`);
      this.load.image(`jump-${i}`, `sprites/jump-${i}.png`);
    }

    this.load.audio('menu-bgm',    'audio/bgm/menu-bgm.mp3');
    this.load.audio('game-bgm',    'audio/bgm/game-bgm.mp3');
    this.load.audio('jump',        'audio/sfx/jump.mp3');
    this.load.audio('double-jump', 'audio/sfx/double-jump.mp3');
    this.load.audio('hit',         'audio/sfx/hit.mp3');
    this.load.audio('coin',        'audio/sfx/coin.mp3');
    this.load.audio('heal',        'audio/sfx/heal.mp3');
    this.load.audio('powerup',     'audio/sfx/powerup.mp3');
    this.load.audio('gameover',    'audio/sfx/gameover.mp3');
  }

  create(): void {
    TextureFactory.createAll(this);
    AudioManager.getInstance().init(this.game);
    this.scene.start('MenuScene');
  }
}
