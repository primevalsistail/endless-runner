import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';
import { StorageService } from '../services/StorageService';

interface GameOverData {
  score: number;
}

export class GameOverScene extends Phaser.Scene {
  private score = 0;
  private farLayer!: Phaser.GameObjects.TileSprite;
  private midLayer!: Phaser.GameObjects.TileSprite;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: GameOverData): void {
    this.score = data.score ?? 0;
  }

  create(): void {
    const { width, height } = this.scale;
    const cx = width / 2;
    const storage = new StorageService();
    const highScore = storage.loadHighScore();
    const isNewRecord = this.score > 0 && this.score >= highScore;

    // ── Background ──────────────────────────────────────────────────────────
    this.add.image(cx, height / 2, 'bg-sky');
    this.farLayer = this.add.tileSprite(cx, 210, width, 300, 'bg-far').setDepth(-2);
    this.midLayer = this.add.tileSprite(cx, 250, width, 230, 'bg-mid').setDepth(-1);
    this.add.rectangle(cx, 415, width, 110, 0x06030e);

    // 暗めのオーバーレイ（ゲームオーバーらしく少し重く）
    this.add.rectangle(cx, height / 2, width, height, 0x000000, 0.62);

    // Ground
    this.add.rectangle(cx, GameConfig.GROUND_Y + 10, width, 20, 0x1a1a3a);
    this.add.rectangle(cx, GameConfig.GROUND_Y,      width, 2,  0xff2244);

    // ── GAME OVER タイトル ───────────────────────────────────────────────────
    this.add.rectangle(cx, 82,  width * 0.6, 2, 0xff2244, 0.7);
    this.add.rectangle(cx, 178, width * 0.6, 2, 0xff2244, 0.7);

    this.add.text(cx, 96, 'GAME', {
      fontSize: '64px',
      color: '#ff2244',
      fontFamily: 'monospace',
      stroke: '#440011',
      strokeThickness: 6,
      shadow: { offsetX: 0, offsetY: 0, color: '#ff2244', blur: 28, fill: true },
    }).setOrigin(0.5);

    this.add.text(cx, 158, 'OVER', {
      fontSize: '64px',
      color: '#ff2244',
      fontFamily: 'monospace',
      stroke: '#440011',
      strokeThickness: 6,
      shadow: { offsetX: 0, offsetY: 0, color: '#ff2244', blur: 28, fill: true },
    }).setOrigin(0.5);

    // ── スコア ───────────────────────────────────────────────────────────────
    const scoreY = 220;
    this.add.text(cx, scoreY, `SCORE`, {
      fontSize: '16px',
      color: '#aabbcc',
      fontFamily: 'monospace',
      letterSpacing: 6,
    }).setOrigin(0.5);

    this.add.text(cx, scoreY + 34, this.score.toLocaleString(), {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: 'monospace',
      stroke: '#223344',
      strokeThickness: 4,
      shadow: { offsetX: 0, offsetY: 0, color: '#ffffff', blur: 12, fill: true },
    }).setOrigin(0.5);

    // ── NEW RECORD or BEST ──────────────────────────────────────────────────
    if (isNewRecord) {
      const newRec = this.add.text(cx, scoreY + 90, '★  NEW RECORD  ★', {
        fontSize: '20px',
        color: '#ffdd00',
        fontFamily: 'monospace',
        shadow: { offsetX: 0, offsetY: 0, color: '#ffaa00', blur: 14, fill: true },
      }).setOrigin(0.5);

      this.tweens.add({
        targets: newRec,
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    } else if (highScore > 0) {
      this.add.text(cx, scoreY + 90, `BEST  ${highScore.toLocaleString()}`, {
        fontSize: '18px',
        color: '#ffdd44',
        fontFamily: 'monospace',
        shadow: { offsetX: 0, offsetY: 0, color: '#ffdd44', blur: 8, fill: true },
      }).setOrigin(0.5);
    }

    // ── ボタン ───────────────────────────────────────────────────────────────
    const retryBtn = this.makeButton(cx, 345, '▶  RETRY', '#44ff88');
    retryBtn.on('pointerdown', () => this.scene.start('GameScene'));

    const menuBtn = this.makeButton(cx, 400, '⌂  MENU', '#88aaff');
    menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));

    this.tweens.add({
      targets: retryBtn,
      alpha: 0.3,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  update(_time: number, delta: number): void {
    this.farLayer.tilePositionX += 20  * (delta / 1000);
    this.midLayer.tilePositionX += 50  * (delta / 1000);
  }

  private makeButton(x: number, y: number, label: string, color: string): Phaser.GameObjects.Text {
    const btn = this.add.text(x, y, label, {
      fontSize: '28px',
      color,
      fontFamily: 'monospace',
      stroke: '#001122',
      strokeThickness: 3,
      shadow: { offsetX: 0, offsetY: 0, color, blur: 10, fill: true },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => {
      this.tweens.killTweensOf(btn);
      btn.setAlpha(1).setColor('#ffffff');
    });
    btn.on('pointerout', () => {
      btn.setColor(color);
      if (label.includes('RETRY')) {
        this.tweens.add({ targets: btn, alpha: 0.3, duration: 700, yoyo: true, repeat: -1 });
      }
    });
    return btn;
  }
}
