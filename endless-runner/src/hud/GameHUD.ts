import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';

interface PauseCallbacks {
  onPause: () => void;
  onRetry: () => void;
  onTitle: () => void;
}

export class GameHUD {
  private scoreText: Phaser.GameObjects.Text;
  private powerUpText: Phaser.GameObjects.Text;
  private livesText: Phaser.GameObjects.Text;
  private pauseButton: Phaser.GameObjects.Text;
  private pauseBg: Phaser.GameObjects.Rectangle;
  private pauseOverlay: Phaser.GameObjects.Text;
  private pauseMenuItems: Phaser.GameObjects.Text[] = [];
  private confirmGroup: Phaser.GameObjects.GameObject[] = [];
  private countdownText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, callbacks: PauseCallbacks) {
    const { onPause, onRetry, onTitle } = callbacks;

    // Pause button (top-left, leftmost)
    this.pauseButton = scene.add.text(14, 12, '⏸', {
      fontSize: '22px', color: '#cccccc', fontFamily: 'monospace'
    }).setDepth(10).setInteractive({ useHandCursor: true });
    this.pauseButton.on('pointerdown', onPause);
    this.pauseButton.on('pointerover', () => this.pauseButton.setColor('#ffffff'));
    this.pauseButton.on('pointerout', () => this.pauseButton.setColor('#cccccc'));

    // Lives (top-left, right of pause button)
    this.livesText = scene.add.text(50, 10, this.buildLivesString(GameConfig.MAX_LIVES), {
      fontSize: '28px', color: '#ff4444', fontFamily: 'monospace'
    }).setDepth(10);

    // PowerUp timers (below lives)
    this.powerUpText = scene.add.text(50, 46, '', {
      fontSize: '14px', color: '#ffee00', fontFamily: 'monospace'
    }).setDepth(10);

    // Score (top-right)
    this.scoreText = scene.add.text(GameConfig.WIDTH - 16, 16, 'SCORE: 0', {
      fontSize: '20px', color: '#ffffff', fontFamily: 'monospace'
    }).setOrigin(1, 0).setDepth(10);

    // Pause overlay background
    this.pauseBg = scene.add.rectangle(
      GameConfig.WIDTH / 2, GameConfig.HEIGHT / 2,
      GameConfig.WIDTH, GameConfig.HEIGHT, 0x000000, 0.75
    ).setDepth(19).setVisible(false);

    // PAUSED title
    this.pauseOverlay = scene.add.text(GameConfig.WIDTH / 2, 140, 'PAUSED', {
      fontSize: '56px', color: '#ffffff', fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(20).setVisible(false);

    // Pause menu buttons
    const cx = GameConfig.WIDTH / 2;
    const btnStyle = { fontSize: '28px', fontFamily: 'monospace', color: '#aaffaa' };

    const resumeBtn = scene.add.text(cx, 230, '▶  再開', btnStyle)
      .setOrigin(0.5).setDepth(20).setVisible(false)
      .setInteractive({ useHandCursor: true });
    resumeBtn.on('pointerover', () => resumeBtn.setColor('#ffffff'));
    resumeBtn.on('pointerout', () => resumeBtn.setColor('#aaffaa'));
    resumeBtn.on('pointerdown', onPause);

    const retryBtn = scene.add.text(cx, 295, '↺  リトライ', btnStyle)
      .setOrigin(0.5).setDepth(20).setVisible(false)
      .setInteractive({ useHandCursor: true });
    retryBtn.on('pointerover', () => retryBtn.setColor('#ffffff'));
    retryBtn.on('pointerout', () => retryBtn.setColor('#aaffaa'));
    retryBtn.on('pointerdown', () => this.showConfirm(scene, 'リトライしますか？', onRetry));

    const titleBtn = scene.add.text(cx, 360, '⌂  タイトルへ', btnStyle)
      .setOrigin(0.5).setDepth(20).setVisible(false)
      .setInteractive({ useHandCursor: true });
    titleBtn.on('pointerover', () => titleBtn.setColor('#ffffff'));
    titleBtn.on('pointerout', () => titleBtn.setColor('#aaffaa'));
    titleBtn.on('pointerdown', () => this.showConfirm(scene, 'タイトルに戻りますか？', onTitle));

    this.pauseMenuItems = [resumeBtn, retryBtn, titleBtn];

    // Countdown
    this.countdownText = scene.add.text(GameConfig.WIDTH / 2, GameConfig.HEIGHT / 2, '', {
      fontSize: '72px', color: '#ffffff', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(10);
  }

  private showConfirm(scene: Phaser.Scene, message: string, onYes: () => void): void {
    this.clearConfirm();
    this.pauseMenuItems.forEach(b => b.setVisible(false));

    const cx = GameConfig.WIDTH / 2;

    const msg = scene.add.text(cx, 270, message, {
      fontSize: '26px', color: '#ffffff', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(21);

    const yesBtn = scene.add.text(cx - 80, 340, 'はい', {
      fontSize: '30px', color: '#ff6666', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(21).setInteractive({ useHandCursor: true });
    yesBtn.on('pointerover', () => yesBtn.setColor('#ffffff'));
    yesBtn.on('pointerout', () => yesBtn.setColor('#ff6666'));
    yesBtn.on('pointerdown', onYes);

    const noBtn = scene.add.text(cx + 80, 340, 'いいえ', {
      fontSize: '30px', color: '#aaaaaa', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(21).setInteractive({ useHandCursor: true });
    noBtn.on('pointerover', () => noBtn.setColor('#ffffff'));
    noBtn.on('pointerout', () => noBtn.setColor('#aaaaaa'));
    noBtn.on('pointerdown', () => {
      this.clearConfirm();
      this.pauseMenuItems.forEach(b => b.setVisible(true));
    });

    this.confirmGroup = [msg, yesBtn, noBtn];
  }

  private clearConfirm(): void {
    this.confirmGroup.forEach(o => (o as Phaser.GameObjects.Text).destroy());
    this.confirmGroup = [];
  }

  updateScore(score: number): void {
    this.scoreText.setText(`SCORE: ${score}`);
  }

  updatePowerUp(djRemaining: number, invRemaining: number): void {
    const parts: string[] = [];
    if (djRemaining > 0) parts.push(`2x JUMP ${Math.ceil(djRemaining / 1000)}s`);
    if (invRemaining > 0) parts.push(`★ INVINCIBLE ${Math.ceil(invRemaining / 1000)}s`);
    this.powerUpText.setText(parts.join('  '));
  }

  updateLives(lives: number): void {
    this.livesText.setText(this.buildLivesString(lives));
  }

  setPaused(paused: boolean): void {
    this.pauseBg.setVisible(paused);
    this.pauseOverlay.setVisible(paused);
    this.pauseMenuItems.forEach(b => b.setVisible(paused));
    this.pauseButton.setText(paused ? '▶' : '⏸');
    if (!paused) this.clearConfirm();
  }

  showCountdown(value: string): void {
    this.countdownText.setText(value);
  }

  hideCountdown(): void {
    this.countdownText.setText('');
  }

  private buildLivesString(lives: number): string {
    return '♥ '.repeat(Math.max(0, lives)).trimEnd();
  }
}
