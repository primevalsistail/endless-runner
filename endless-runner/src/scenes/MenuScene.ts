import Phaser from 'phaser';
import { StorageService } from '../services/StorageService';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const { width, height } = this.scale;
    const cx = width / 2;
    const storage = new StorageService();
    const highScore = storage.loadHighScore();

    this.add.text(cx, 130, 'ENDLESS RUNNER', {
      fontSize: '48px', color: '#ffffff', fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.add.text(cx, 240, `BEST: ${highScore}`, {
      fontSize: '24px', color: '#aaaaaa', fontFamily: 'monospace',
    }).setOrigin(0.5);

    const startBtn = this.add.text(cx, 330, '▶  TAP TO START', {
      fontSize: '32px', color: '#44ff88', fontFamily: 'monospace',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    startBtn.setInteractive(
      new Phaser.Geom.Rectangle(-160, -28, 320, 56),
      Phaser.Geom.Rectangle.Contains
    );

    startBtn.on('pointerdown', () => this.scene.start('GameScene'));
    startBtn.on('pointerover', () => startBtn.setColor('#ffffff'));
    startBtn.on('pointerout', () => startBtn.setColor('#44ff88'));
  }
}
