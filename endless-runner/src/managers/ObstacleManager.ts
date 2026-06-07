import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';
import { StaticObstacle } from '../objects/StaticObstacle';
import { MovingObstacle } from '../objects/MovingObstacle';
import type { Obstacle } from '../objects/Obstacle';

export class ObstacleManager {
  private staticPool: StaticObstacle[] = [];
  private movingPool: MovingObstacle[] = [];
  private spawnTimer = 0;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    for (let i = 0; i < GameConfig.OBSTACLE_POOL_SIZE; i++) {
      const s = new StaticObstacle(scene);
      s.setActive(false).setVisible(false);
      this.staticPool.push(s);

      const m = new MovingObstacle(scene);
      m.setActive(false).setVisible(false);
      this.movingPool.push(m);
    }
  }

  update(deltaMs: number, gameSpeed: number, difficultyLevel: number, obstacleInterval: number): void {
    this.spawnTimer += deltaMs;
    if (this.spawnTimer >= obstacleInterval) {
      this.spawnTimer = 0;
      this.spawn(gameSpeed, difficultyLevel);
    }

    const active = this.getActive();
    for (const obs of active) {
      obs.update(deltaMs);
      if (obs.x < -100) obs.deactivate();
    }
  }

  private spawn(gameSpeed: number, difficultyLevel: number): void {
    const useMoving = difficultyLevel >= 3 && Math.random() < 0.4;

    if (useMoving) {
      const obs = this.movingPool.find(o => !o.active);
      if (!obs) return;
      const h = Phaser.Math.Between(30, 60);
      obs.activateMoving(
        GameConfig.WIDTH + 50,
        GameConfig.GROUND_Y - h / 2 - 50,
        30, h, gameSpeed,
        Phaser.Math.Between(40, 80),
        Phaser.Math.FloatBetween(0.001, 0.003),
        Phaser.Math.FloatBetween(0, Math.PI * 2)
      );
    } else {
      const obs = this.staticPool.find(o => !o.active);
      if (!obs) return;
      const h = Phaser.Math.Between(30, 70);
      obs.activate(
        GameConfig.WIDTH + 50,
        GameConfig.GROUND_Y - h / 2,
        Phaser.Math.Between(20, 40), h,
        gameSpeed
      );
    }
  }

  getActive(): Obstacle[] {
    return [
      ...this.staticPool.filter(o => o.active),
      ...this.movingPool.filter(o => o.active),
    ];
  }

  reset(): void {
    this.spawnTimer = 0;
    [...this.staticPool, ...this.movingPool].forEach(o => o.deactivate());
  }
}
