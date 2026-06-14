import { Obstacle } from './Obstacle';
import type Phaser from 'phaser';

export class ProjectileObstacle extends Obstacle {
  constructor(scene: Phaser.Scene) {
    super(scene, 'shuriken');
  }

  update(deltaMs: number): void {
    this.x -= this.scrollSpeed * (deltaMs / 1000);
    this.angle += deltaMs * 0.36; // 360°/秒で回転
  }
}
