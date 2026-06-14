import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';
import { StorageService } from '../services/StorageService';

export class MenuScene extends Phaser.Scene {
  private farLayer!: Phaser.GameObjects.TileSprite;
  private midLayer!: Phaser.GameObjects.TileSprite;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const { width, height } = this.scale;
    const cx = width / 2;
    const storage = new StorageService();
    const highScore = storage.loadHighScore();

    // ── Background ──────────────────────────────────────────────────────────
    this.add.image(cx, height / 2, 'bg-sky');
    this.farLayer = this.add.tileSprite(cx, 300, width, 300, 'bg-far').setDepth(-2);
    this.midLayer = this.add.tileSprite(cx, 335, width, 230, 'bg-mid').setDepth(-1);

    // Semi-transparent overlay to push background into "background"
    this.add.rectangle(cx, height / 2, width, height, 0x000000, 0.42);

    // Ground
    this.add.rectangle(cx, GameConfig.GROUND_Y + 10, width, 20, 0x1a1a3a);
    this.add.rectangle(cx, GameConfig.GROUND_Y,      width, 2,  0x00f5ff);

    // ── Title ────────────────────────────────────────────────────────────────
    // Horizontal neon lines framing the title
    this.add.rectangle(cx, 82,  width * 0.55, 2, 0x00f5ff, 0.55);
    this.add.rectangle(cx, 194, width * 0.55, 2, 0xff44aa, 0.55);

    this.add.text(cx, 96, 'ENDLESS', {
      fontSize: '64px',
      color: '#00ffff',
      fontFamily: 'monospace',
      stroke: '#003344',
      strokeThickness: 6,
      shadow: { offsetX: 0, offsetY: 0, color: '#00ffff', blur: 24, fill: true },
    }).setOrigin(0.5);

    this.add.text(cx, 162, 'RUNNER', {
      fontSize: '64px',
      color: '#ff44aa',
      fontFamily: 'monospace',
      stroke: '#330022',
      strokeThickness: 6,
      shadow: { offsetX: 0, offsetY: 0, color: '#ff44aa', blur: 24, fill: true },
    }).setOrigin(0.5);

    // ── High score ───────────────────────────────────────────────────────────
    const scoreText = highScore > 0
      ? `BEST  ${highScore.toLocaleString()}`
      : 'NO RECORD YET';
    this.add.text(cx, GameConfig.GROUND_Y - 128, scoreText, {
      fontSize: '20px',
      color: '#ffdd44',
      fontFamily: 'monospace',
      shadow: { offsetX: 0, offsetY: 0, color: '#ffdd44', blur: 8, fill: true },
    }).setOrigin(0.5);

    // ── Start button ─────────────────────────────────────────────────────────
    const startBtn = this.add.text(cx, 370, '▶  TAP TO START', {
      fontSize: '28px',
      color: '#44ff88',
      fontFamily: 'monospace',
      stroke: '#003322',
      strokeThickness: 3,
      shadow: { offsetX: 0, offsetY: 0, color: '#44ff88', blur: 12, fill: true },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: startBtn,
      alpha: 0.25,
      duration: 680,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    startBtn.on('pointerover', () => {
      this.tweens.killTweensOf(startBtn);
      startBtn.setAlpha(1).setColor('#ffffff');
    });
    startBtn.on('pointerout', () => {
      startBtn.setColor('#44ff88');
      this.tweens.add({ targets: startBtn, alpha: 0.25, duration: 680, yoyo: true, repeat: -1 });
    });

    let started = false;
    const goToGame = (): void => {
      if (started) return;
      started = true;
      this.scene.start('GameScene');
    };
    startBtn.on('pointerdown', goToGame);
    this.input.on('pointerdown', goToGame);
  }

  update(_time: number, delta: number): void {
    this.farLayer.tilePositionX += 40  * (delta / 1000);
    this.midLayer.tilePositionX += 100 * (delta / 1000);
  }
}
