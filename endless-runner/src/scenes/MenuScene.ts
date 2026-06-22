import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';
import { StorageService } from '../services/StorageService';
import { AudioManager } from '../services/AudioManager';

export class MenuScene extends Phaser.Scene {
  private farLayer!: Phaser.GameObjects.TileSprite;
  private midLayer!: Phaser.GameObjects.TileSprite;
  private settingsOpen = false;
  private settingsGroup: Phaser.GameObjects.GameObject[] = [];

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
      if (started || this.settingsOpen) return;
      started = true;
      this.scene.start('GameScene');
    };
    startBtn.on('pointerdown', goToGame);
    this.input.on('pointerdown', goToGame);

    // ── Gear icon (audio settings) ───────────────────────────────────────────
    const gearBtn = this.add.text(14, 14, '⚙', {
      fontSize: '22px',
      color: '#88aacc',
      fontFamily: 'monospace',
    }).setDepth(5).setInteractive({ useHandCursor: true });
    gearBtn.on('pointerover', () => gearBtn.setColor('#00ffff'));
    gearBtn.on('pointerout', () => gearBtn.setColor('#88aacc'));
    gearBtn.on('pointerdown', () => {
      if (!this.settingsOpen) this.openSettings(cx);
    });

    AudioManager.getInstance().playBGM('menu-bgm');
  }

  private openSettings(cx: number): void {
    this.settingsOpen = true;
    const audio = AudioManager.getInstance();
    const panelCy = 210;

    // Full-screen dim overlay — intercepts clicks to close the panel
    const overlay = this.add.rectangle(
      cx, GameConfig.HEIGHT / 2,
      GameConfig.WIDTH, GameConfig.HEIGHT,
      0x000000, 0.65,
    ).setDepth(9).setInteractive();
    overlay.on('pointerdown', () => this.closeSettings());

    // Panel box — absorbs clicks so they don't hit the overlay behind
    const panel = this.add.rectangle(cx, panelCy, 280, 110, 0x001a2e)
      .setDepth(10).setStrokeStyle(1, 0x004466).setInteractive();

    const audioLabel = this.add.text(cx, panelCy - 43, 'AUDIO', {
      fontSize: '11px', color: '#445566', fontFamily: 'monospace', letterSpacing: 4,
    }).setOrigin(0.5).setDepth(11);

    const trackW = 160;
    const bgmObjs = this.makeSliderObjects(
      cx, panelCy - 14, trackW, 'BGM',
      audio.getBgmVolume(), v => audio.setBgmVolume(v),
    );
    const sfxObjs = this.makeSliderObjects(
      cx, panelCy + 18, trackW, 'SFX',
      audio.getSfxVolume(), v => audio.setSfxVolume(v),
    );

    this.settingsGroup = [overlay, panel, audioLabel, ...bgmObjs, ...sfxObjs];
  }

  private closeSettings(): void {
    this.settingsGroup.forEach(o => o.destroy());
    this.settingsGroup = [];
    // Defer flag so this same pointerdown event doesn't also trigger goToGame
    this.time.delayedCall(0, () => { this.settingsOpen = false; });
  }

  private makeSliderObjects(
    cx: number, y: number, trackW: number,
    label: string, initial: number,
    onChange: (v: number) => void,
  ): Phaser.GameObjects.GameObject[] {
    const left = cx - trackW / 2;
    const labelStyle = { fontSize: '11px', color: '#88aacc', fontFamily: 'monospace' };
    const pctStyle   = { fontSize: '11px', color: '#aaccdd', fontFamily: 'monospace' };

    const labelObj = this.add.text(left - 6, y, label, labelStyle).setOrigin(1, 0.5).setDepth(11);
    const track = this.add.rectangle(cx, y, trackW, 3, 0x223344).setDepth(11);
    const fill  = this.add.rectangle(left + (initial * trackW) / 2, y, initial * trackW, 3, 0x00ccff).setDepth(11);
    const handle = this.add.circle(left + initial * trackW, y, 7, 0x00ffff)
      .setInteractive({ useHandCursor: true }).setDepth(12);
    this.input.setDraggable(handle);
    const pct = this.add.text(left + trackW + 8, y, `${Math.round(initial * 100)}%`, pctStyle)
      .setOrigin(0, 0.5).setDepth(11);

    handle.on('drag', (_ptr: Phaser.Input.Pointer, dragX: number) => {
      const clampedX = Phaser.Math.Clamp(dragX, left, left + trackW);
      handle.x = clampedX;
      const v = (clampedX - left) / trackW;
      fill.setSize(v * trackW || 1, 3);
      fill.x = left + (v * trackW) / 2;
      pct.setText(`${Math.round(v * 100)}%`);
      onChange(v);
    });

    return [labelObj, track, fill, handle, pct];
  }

  update(_time: number, delta: number): void {
    this.farLayer.tilePositionX += 40  * (delta / 1000);
    this.midLayer.tilePositionX += 100 * (delta / 1000);
  }
}
