import Phaser from 'phaser';

export class GameHUD {
  private scoreText: Phaser.GameObjects.Text;
  private powerUpText: Phaser.GameObjects.Text;
  private countdownText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scoreText = scene.add.text(16, 16, 'SCORE: 0', {
      fontSize: '20px', color: '#ffffff', fontFamily: 'monospace'
    }).setDepth(10);

    this.powerUpText = scene.add.text(16, 44, '', {
      fontSize: '16px', color: '#ffee00', fontFamily: 'monospace'
    }).setDepth(10);

    this.countdownText = scene.add.text(400, 225, '', {
      fontSize: '72px', color: '#ffffff', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(10);
  }

  updateScore(score: number): void {
    this.scoreText.setText(`SCORE: ${score}`);
  }

  updatePowerUp(label: string): void {
    this.powerUpText.setText(label);
  }

  showCountdown(value: string): void {
    this.countdownText.setText(value);
  }

  hideCountdown(): void {
    this.countdownText.setText('');
  }
}
