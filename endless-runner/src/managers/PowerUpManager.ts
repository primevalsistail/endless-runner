import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';
import { PowerUpItem } from '../objects/PowerUpItem';
import { DoubleJumpPowerUp } from '../powerups/DoubleJumpPowerUp';
import type { Player } from '../objects/Player';
import type { PowerUpType } from '../powerups/PowerUp';

interface ActiveEffect {
  type: PowerUpType;
  remaining: number;
}

export class PowerUpManager {
  private pool: PowerUpItem[] = [];
  private activeEffects = new Map<PowerUpType, ActiveEffect>();
  private spawnTimer = 0;
  private readonly SPAWN_INTERVAL = 8000;

  constructor(scene: Phaser.Scene) {
    for (let i = 0; i < GameConfig.POWERUP_POOL_SIZE; i++) {
      this.pool.push(new PowerUpItem(scene));
    }
  }

  update(deltaMs: number, gameSpeed: number, player: Player): void {
    this.spawnTimer += deltaMs;
    if (this.spawnTimer >= this.SPAWN_INTERVAL) {
      this.spawnTimer = 0;
      this.spawn(gameSpeed);
    }

    for (const item of this.pool.filter(p => p.active)) {
      item.update(deltaMs);
      if (item.x < -50) item.deactivate();
    }

    for (const [type, effect] of this.activeEffects) {
      effect.remaining -= deltaMs;
      if (effect.remaining <= 0) {
        player.removePowerUp(type);
        this.activeEffects.delete(type);
      }
    }
  }

  collect(item: PowerUpItem, player: Player): void {
    const powerUp = new DoubleJumpPowerUp();
    const existing = this.activeEffects.get(item.type);
    if (existing) {
      existing.remaining = powerUp.duration;
    } else {
      this.activeEffects.set(item.type, { type: item.type, remaining: powerUp.duration });
    }
    player.applyPowerUp(powerUp);
    item.deactivate();
  }

  getActiveItems(): PowerUpItem[] {
    return this.pool.filter(p => p.active);
  }

  getRemainingTime(type: PowerUpType): number {
    return this.activeEffects.get(type)?.remaining ?? 0;
  }

  private spawn(gameSpeed: number): void {
    const item = this.pool.find(p => !p.active);
    if (!item) return;
    const spawnY = Phaser.Math.Between(
      GameConfig.GROUND_Y - 150,
      GameConfig.GROUND_Y - 60
    );
    item.activate(GameConfig.WIDTH + 50, spawnY, 'doubleJump', gameSpeed);
  }

  reset(): void {
    this.spawnTimer = 0;
    this.activeEffects.clear();
    this.pool.forEach(p => p.deactivate());
  }
}
