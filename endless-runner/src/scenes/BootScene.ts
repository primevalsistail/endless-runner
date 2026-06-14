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

    this.load.audio('menu-bgm',    'audio/bgm/menu-bgm.ogg');
    this.load.audio('game-bgm',    'audio/bgm/game-bgm.ogg');
    this.load.audio('jump',        'audio/sfx/jump.ogg');
    this.load.audio('double-jump', 'audio/sfx/double-jump.ogg');
    this.load.audio('hit',         'audio/sfx/hit.ogg');
    this.load.audio('coin',        'audio/sfx/coin.ogg');
    this.load.audio('heal',        'audio/sfx/heal.ogg');
    this.load.audio('powerup',     'audio/sfx/powerup.ogg');
    this.load.audio('gameover',    'audio/sfx/gameover.ogg');
  }

  create(): void {
    TextureFactory.createAll(this);
    AudioManager.getInstance().init(this.game);
    this.scene.start('MenuScene');
  }
}
