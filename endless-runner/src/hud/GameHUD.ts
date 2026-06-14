import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';

export class GameHUD {
  private scoreText: Phaser.GameObjects.Text;
  private powerUpText: Phaser.GameObjects.Text;
  private livesText: Phaser.GameObjects.Text;
  private countdownText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scoreText = scene.add.text(16, 16, 'SCORE: 0', {
      fontSize: '20px', color: '#ffffff', fontFamily: 'monospace'
    }).setDepth(10);

    this.powerUpText = scene.add.text(16, 44, '', {
      fontSize: '16px', color: '#ffee00', fontFamily: 'monospace'
    }).setDepth(10);

    this.livesText = scene.add.text(GameConfig.WIDTH - 16, 16, this.buildLivesString(GameConfig.MAX_LIVES), {
      fontSize: '20px', color: '#ff4444', fontFamily: 'monospace'
    }).setOrigin(1, 0).setDepth(10);

    this.countdownText = scene.add.text(400, 225, '', {
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
