import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';

export class GameHUD {
  private scoreText: Phaser.GameObjects.Text;
  private powerUpText: Phaser.GameObjects.Text;
  private livesText: Phaser.GameObjects.Text;
  private pauseButton: Phaser.GameObjects.Text;
  private pauseOverlay: Phaser.GameObjects.Text;
  private countdownText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, onPause: () => void) {
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

    // Pause overlay (center screen)
    this.pauseOverlay = scene.add.text(GameConfig.WIDTH / 2, GameConfig.HEIGHT / 2, 'PAUSED', {
      fontSize: '64px', color: '#ffffff', fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 6,
    }).setOrigin(0.5).setDepth(20).setVisible(false);

    // Countdown
    this.countdownText = scene.add.text(GameConfig.WIDTH / 2, GameConfig.HEIGHT / 2, '', {
      fontSize: '72px', color: '#ffffff', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(10);
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
    this.pauseOverlay.setVisible(paused);
    this.pauseButton.setText(paused ? '▶' : '⏸');
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
