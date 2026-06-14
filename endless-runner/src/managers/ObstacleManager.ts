import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';
import { StaticObstacle } from '../objects/StaticObstacle';
import { MovingObstacle } from '../objects/MovingObstacle';
import { ProjectileObstacle } from '../objects/ProjectileObstacle';
import type { Obstacle } from '../objects/Obstacle';

const PROJECTILE_LANES = [
  GameConfig.PROJECTILE_Y_GROUND,
  GameConfig.PROJECTILE_Y_MID,
  GameConfig.PROJECTILE_Y_HIGH,
] as const;

export class ObstacleManager {
  private staticPool: StaticObstacle[] = [];
  private movingPool: MovingObstacle[] = [];
  private projectilePool: ProjectileObstacle[] = [];
  private spawnTimer = 0;
  private projectileTimer = 0;
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
    for (let i = 0; i < GameConfig.PROJECTILE_POOL_SIZE; i++) {
      const p = new ProjectileObstacle(scene);
      p.setActive(false).setVisible(false);
      this.projectilePool.push(p);
    }
  }

  update(deltaMs: number, gameSpeed: number, difficultyLevel: number, obstacleInterval: number): void {
    this.spawnTimer += deltaMs;
    if (this.spawnTimer >= obstacleInterval) {
      this.spawnTimer = 0;
      this.spawn(gameSpeed, difficultyLevel);
    }

    if (difficultyLevel >= 2) {
      this.projectileTimer += deltaMs;
      if (this.projectileTimer >= GameConfig.PROJECTILE_SPAWN_INTERVAL) {
        this.projectileTimer = 0;
        this.spawnProjectile(gameSpeed);
      }
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

  private spawnProjectile(gameSpeed: number): void {
    const obs = this.projectilePool.find(o => !o.active);
    if (!obs) return;
    const laneY = PROJECTILE_LANES[Math.floor(Math.random() * PROJECTILE_LANES.length)];
    obs.activate(GameConfig.WIDTH + 50, laneY, 25, 18, gameSpeed);
  }

  getActive(): Obstacle[] {
    return [
      ...this.staticPool.filter(o => o.active),
      ...this.movingPool.filter(o => o.active),
      ...this.projectilePool.filter(o => o.active),
    ];
  }

  reset(): void {
    this.spawnTimer = 0;
    this.projectileTimer = 0;
    [...this.staticPool, ...this.movingPool, ...this.projectilePool].forEach(o => o.deactivate());
  }
}
