import { GameConfig } from '../config/GameConfig';
import type { IPersistenceService } from './IPersistenceService';

export class StorageService implements IPersistenceService {
  saveHighScore(score: number): void {
    try {
      localStorage.setItem(GameConfig.HIGH_SCORE_KEY, String(score));
    } catch {
      // プライベートブラウジング等でも動作継続
    }
  }

  loadHighScore(): number {
    try {
      const raw = localStorage.getItem(GameConfig.HIGH_SCORE_KEY);
      return raw ? parseInt(raw, 10) : 0;
    } catch {
      return 0;
    }
  }
}
