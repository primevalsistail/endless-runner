import { GameConfig } from '../config/GameConfig';

export class LifeManager {
  private _lives: number;
  private readonly _maxLives: number;
  private _damageInvincibleTimer = 0;

  constructor() {
    this._maxLives = GameConfig.MAX_LIVES;
    this._lives = this._maxLives;
  }

  get lives(): number { return this._lives; }
  get maxLives(): number { return this._maxLives; }
  get isDamageInvincible(): boolean { return this._damageInvincibleTimer > 0; }

  update(deltaMs: number): void {
    if (this._damageInvincibleTimer > 0) {
      this._damageInvincibleTimer = Math.max(0, this._damageInvincibleTimer - deltaMs);
    }
  }

  takeDamage(): boolean {
    if (this.isDamageInvincible) return false;
    this._lives--;
    this._damageInvincibleTimer = GameConfig.DAMAGE_INVINCIBILITY_DURATION;
    return true;
  }

  recover(): void {
    if (this._lives < this._maxLives) this._lives++;
  }

  isDead(): boolean { return this._lives <= 0; }

  reset(): void {
    this._lives = this._maxLives;
    this._damageInvincibleTimer = 0;
  }
}
