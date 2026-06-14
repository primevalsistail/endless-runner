import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';
import { ScoreItem } from '../objects/ScoreItem';
import { RecoveryItem } from '../objects/RecoveryItem';

const ITEM_LANES = [
  GameConfig.PROJECTILE_Y_GROUND,
  GameConfig.PROJECTILE_Y_MID,
  GameConfig.PROJECTILE_Y_HIGH,
] as const;

export class ItemManager {
  private scorePool: ScoreItem[] = [];
  private recoveryPool: RecoveryItem[] = [];
  private scoreTimer = 0;
  private recoveryTimer = 0;

  constructor(scene: Phaser.Scene) {
    for (let i = 0; i < GameConfig.ITEM_POOL_SIZE; i++) {
      this.scorePool.push(new ScoreItem(scene));
      this.recoveryPool.push(new RecoveryItem(scene));
    }
  }

  update(deltaMs: number, gameSpeed: number): void {
    this.scoreTimer += deltaMs;
    this.recoveryTimer += deltaMs;

    if (this.scoreTimer >= GameConfig.SCORE_ITEM_SPAWN_INTERVAL) {
      this.scoreTimer = 0;
      this.spawnScore(gameSpeed);
    }
    if (this.recoveryTimer >= GameConfig.RECOVERY_ITEM_SPAWN_INTERVAL) {
      this.recoveryTimer = 0;
      this.spawnRecovery(gameSpeed);
    }

    for (const item of this.scorePool.filter(i => i.active)) {
      item.update(deltaMs);
      if (item.x < -50) item.deactivate();
    }
    for (const item of this.recoveryPool.filter(i => i.active)) {
      item.update(deltaMs);
      if (item.x < -50) item.deactivate();
    }
  }

  private spawnScore(gameSpeed: number): void {
    const item = this.scorePool.find(i => !i.active);
    if (!item) return;
    const y = ITEM_LANES[Math.floor(Math.random() * ITEM_LANES.length)];
    item.activate(GameConfig.WIDTH + 50, y, gameSpeed);
  }

  private spawnRecovery(gameSpeed: number): void {
    const item = this.recoveryPool.find(i => !i.active);
    if (!item) return;
    const y = ITEM_LANES[Math.floor(Math.random() * ITEM_LANES.length)];
    item.activate(GameConfig.WIDTH + 50, y, gameSpeed);
  }

  getActiveScoreItems(): ScoreItem[] {
    return this.scorePool.filter(i => i.active);
  }

  getActiveRecoveryItems(): RecoveryItem[] {
    return this.recoveryPool.filter(i => i.active);
  }

  reset(): void {
    this.scoreTimer = 0;
    this.recoveryTimer = 0;
    this.scorePool.forEach(i => i.deactivate());
    this.recoveryPool.forEach(i => i.deactivate());
  }
}
