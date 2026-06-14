import { Obstacle } from './Obstacle';
import type Phaser from 'phaser';

export class MovingObstacle extends Obstacle {
  private amplitude = 60;
  private frequency = 0.002;
  private phaseOffset = 0;
  private baseY = 0;
  private elapsed = 0;

  constructor(scene: Phaser.Scene) {
    super(scene, 'drone');
  }

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
  }

  update(deltaMs: number): void {
    this.elapsed += deltaMs;
    this.x -= this.scrollSpeed * (deltaMs / 1000);
    this.y = this.baseY + Math.sin(this.elapsed * this.frequency + this.phaseOffset) * this.amplitude;
  }
}
