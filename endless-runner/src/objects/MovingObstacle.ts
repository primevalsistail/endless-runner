import Phaser from 'phaser';
import { Obstacle } from './Obstacle';

export class MovingObstacle extends Obstacle {
  private amplitude = 60;
  private frequency = 0.002;
  private phaseOffset = 0;
  private baseY = 0;
  private elapsed = 0;

  activateMoving(
    x: number, y: number, width: number, height: number,
    speed: number, amplitude: number, frequency: number, phaseOffset: number
  ): void {
    super.activate(x, y, width, height, speed);
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.phaseOffset = phaseOffset;
    this.baseY = y;
    this.elapsed = 0;
    this.setFillStyle(0xff8800);
  }

  update(deltaMs: number): void {
    this.elapsed += deltaMs;
    const deltaSeconds = deltaMs / 1000;
    this.x -= this.scrollSpeed * deltaSeconds;
    this.y = this.baseY + Math.sin(this.elapsed * this.frequency + this.phaseOffset) * this.amplitude;
    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.reset(this.x, this.y);
  }
}
