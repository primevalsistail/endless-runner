import { GameConfig } from '../config/GameConfig';
import type { IPersistenceService } from '../services/IPersistenceService';

export class ScoreManager {
  private _distanceTraveled = 0;
  private _currentScore = 0;
  private _bonusScore = 0;
  private _highScore = 0;
  private persistence: IPersistenceService;

  constructor(persistence: IPersistenceService) {
    this.persistence = persistence;
    this._highScore = persistence.loadHighScore();
  }

  update(deltaMs: number, gameSpeed: number): void {
    const deltaSeconds = deltaMs / 1000;
    this._distanceTraveled += gameSpeed * deltaSeconds;
    this._currentScore = Math.floor(this._distanceTraveled * GameConfig.SCORE_MULTIPLIER);
  }

  saveHighScore(): void {
    if (this.currentScore > this._highScore) {
      this._highScore = this.currentScore;
      this.persistence.saveHighScore(this._highScore);
    }
  }

  addBonus(amount: number): void {
    this._bonusScore += amount;
  }

  reset(): void {
    this._distanceTraveled = 0;
    this._currentScore = 0;
    this._bonusScore = 0;
  }

  get currentScore(): number { return this._currentScore + this._bonusScore; }
  get distanceTraveled(): number { return this._distanceTraveled; }
  get highScore(): number { return this._highScore; }
}
