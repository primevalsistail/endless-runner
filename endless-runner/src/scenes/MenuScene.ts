import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';
import { StorageService } from '../services/StorageService';
import { AudioManager } from '../services/AudioManager';

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
    this.farLayer = this.add.tileSprite(cx, 210, width, 300, 'bg-far').setDepth(-2);
    this.midLayer = this.add.tileSprite(cx, 250, width, 230, 'bg-mid').setDepth(-1);
    this.add.rectangle(cx, 415, width, 110, 0x06030e);

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

    this.add.text(width - 8, 8, `v${__APP_VERSION__}`, {
      fontSize: '14px',
      color: '#88bbcc',
      fontFamily: 'monospace',
    }).setOrigin(1, 0);

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

    AudioManager.getInstance().playBGM('menu-bgm');
    this.createVolumeControls(cx, 420);
  }

  private createVolumeControls(cx: number, baseY: number): void {
    const audio = AudioManager.getInstance();
    const trackW = 160;
    const labelStyle = { fontSize: '11px', color: '#88aacc', fontFamily: 'monospace' };
    const pctStyle   = { fontSize: '11px', color: '#aaccdd', fontFamily: 'monospace' };

    this.add.text(cx, baseY - 14, 'AUDIO', {
      fontSize: '11px', color: '#445566', fontFamily: 'monospace', letterSpacing: 4,
    }).setOrigin(0.5);

    this.makeSlider(cx, baseY + 8,  trackW, 'BGM', audio.getBgmVolume(), labelStyle, pctStyle,
      (v) => audio.setBgmVolume(v));
    this.makeSlider(cx, baseY + 34, trackW, 'SFX', audio.getSfxVolume(), labelStyle, pctStyle,
      (v) => audio.setSfxVolume(v));
  }

  private makeSlider(
    cx: number, y: number, trackW: number,
    label: string, initial: number,
    labelStyle: object, pctStyle: object,
    onChange: (v: number) => void,
  ): void {
    const left = cx - trackW / 2;

    this.add.text(left - 6, y, label, labelStyle).setOrigin(1, 0.5);

    // Track
    this.add.rectangle(cx, y, trackW, 3, 0x223344);

    // Fill
    const fill = this.add.rectangle(
      left + (initial * trackW) / 2, y,
      initial * trackW, 3, 0x00ccff,
    );

    // Handle
    const handle = this.add.circle(left + initial * trackW, y, 7, 0x00ffff)
      .setInteractive({ useHandCursor: true });
    this.input.setDraggable(handle);

    // Percentage label
    const pct = this.add.text(left + trackW + 8, y, `${Math.round(initial * 100)}%`, pctStyle)
      .setOrigin(0, 0.5);

    handle.on('drag', (_ptr: Phaser.Input.Pointer, dragX: number) => {
      const clampedX = Phaser.Math.Clamp(dragX, left, left + trackW);
      handle.x = clampedX;
      const v = (clampedX - left) / trackW;
      fill.setSize(v * trackW || 1, 3);
      fill.x = left + (v * trackW) / 2;
      pct.setText(`${Math.round(v * 100)}%`);
      onChange(v);
    });
  }

  update(_time: number, delta: number): void {
    this.farLayer.tilePositionX += 40  * (delta / 1000);
    this.midLayer.tilePositionX += 100 * (delta / 1000);
  }
}
