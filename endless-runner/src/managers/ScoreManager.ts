import { GameConfig } from '../config/GameConfig';
import type { IPersistenceService } from '../services/IPersistenceService';

export class ScoreManager {
  private _distanceTraveled = 0;
  private _currentScore = 0;
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
    if (this._currentScore > this._highScore) {
      this._highScore = this._currentScore;
      this.persistence.saveHighScore(this._highScore);
    }
  }

  reset(): void {
    this._distanceTraveled = 0;
    this._currentScore = 0;
  }

  get currentScore(): number { return this._currentScore; }
  get distanceTraveled(): number { return this._distanceTraveled; }
  get highScore(): number { return this._highScore; }
}
