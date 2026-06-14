import { Obstacle } from './Obstacle';
import type Phaser from 'phaser';

export class StaticObstacle extends Obstacle {
  constructor(scene: Phaser.Scene) {
    super(scene, 'barricade');
  }

  update(deltaMs: number): void {
    this.x -= this.scrollSpeed * (deltaMs / 1000);
  }
}
