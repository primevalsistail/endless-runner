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

  saveBgmVolume(volume: number): void {
    try {
      localStorage.setItem(GameConfig.BGM_VOLUME_KEY, String(volume));
    } catch { /* ignore */ }
  }

  loadBgmVolume(): number {
    try {
      const raw = localStorage.getItem(GameConfig.BGM_VOLUME_KEY);
      return raw !== null ? parseFloat(raw) : GameConfig.DEFAULT_BGM_VOLUME;
    } catch {
      return GameConfig.DEFAULT_BGM_VOLUME;
    }
  }

  saveSfxVolume(volume: number): void {
    try {
      localStorage.setItem(GameConfig.SFX_VOLUME_KEY, String(volume));
    } catch { /* ignore */ }
  }

  loadSfxVolume(): number {
    try {
      const raw = localStorage.getItem(GameConfig.SFX_VOLUME_KEY);
      return raw !== null ? parseFloat(raw) : GameConfig.DEFAULT_SFX_VOLUME;
    } catch {
      return GameConfig.DEFAULT_SFX_VOLUME;
    }
  }
}
