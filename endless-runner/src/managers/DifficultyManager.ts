import { GameConfig } from '../config/GameConfig';

type DifficultyLevel = typeof GameConfig.DIFFICULTY_LEVELS[number];

export class DifficultyManager {
  private _currentLevel: DifficultyLevel = GameConfig.DIFFICULTY_LEVELS[0];

  update(distanceTraveled: number): void {
    const levels = [...GameConfig.DIFFICULTY_LEVELS].reverse();
    const matched = levels.find(l => distanceTraveled >= l.distanceThreshold);
    if (matched) this._currentLevel = matched;
  }

  get gameSpeed(): number { return this._currentLevel.gameSpeed; }
  get obstacleInterval(): number { return this._currentLevel.obstacleInterval; }
  get level(): number { return this._currentLevel.level; }

  reset(): void {
    this._currentLevel = GameConfig.DIFFICULTY_LEVELS[0];
  }
}
