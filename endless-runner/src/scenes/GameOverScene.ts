import Phaser from 'phaser';
import { StorageService } from '../services/StorageService';

interface GameOverData {
  score: number;
}

export class GameOverScene extends Phaser.Scene {
  private score = 0;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: GameOverData): void {
    this.score = data.score ?? 0;
  }

  create(): void {
    const { width } = this.scale;
    const cx = width / 2;
    const storage = new StorageService();
    const highScore = storage.loadHighScore();

    this.add.text(cx, 120, 'GAME OVER', {
      fontSize: '52px', color: '#ff4444', fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.add.text(cx, 200, `SCORE: ${this.score}`, {
      fontSize: '36px', color: '#ffffff', fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.add.text(cx, 250, `BEST: ${highScore}`, {
      fontSize: '24px', color: '#ffee00', fontFamily: 'monospace',
    }).setOrigin(0.5);

    const retryBtn = this.makeButton(cx, 330, '▶  RETRY', '#44ff88');
    retryBtn.on('pointerdown', () => this.scene.start('GameScene'));

    const menuBtn = this.makeButton(cx, 395, '⌂  MENU', '#88aaff');
    menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));
  }

  private makeButton(x: number, y: number, label: string, color: string): Phaser.GameObjects.Text {
    const btn = this.add.text(x, y, label, {
      fontSize: '28px', color, fontFamily: 'monospace',
    }).setOrigin(0.5);

    btn.setInteractive(
      new Phaser.Geom.Rectangle(-120, -22, 240, 44),
      Phaser.Geom.Rectangle.Contains
    );
    btn.on('pointerover', () => btn.setColor('#ffffff'));
    btn.on('pointerout', () => btn.setColor(color));
    return btn;
  }
}
