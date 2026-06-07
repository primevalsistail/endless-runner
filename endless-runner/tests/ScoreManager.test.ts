import { describe, it, expect, beforeEach } from 'vitest';
import { ScoreManager } from '../src/managers/ScoreManager';
import { InMemoryPersistenceService } from '../src/services/IPersistenceService';
import { GameConfig } from '../src/config/GameConfig';

describe('ScoreManager', () => {
  let sm: ScoreManager;
  let persistence: InMemoryPersistenceService;

  beforeEach(() => {
    persistence = new InMemoryPersistenceService();
    sm = new ScoreManager(persistence);
  });

  it('初期スコアは0', () => {
    expect(sm.currentScore).toBe(0);
    expect(sm.distanceTraveled).toBe(0);
  });

  it('距離ベースでスコアを計算する', () => {
    sm.update(1000, 200);
    expect(sm.distanceTraveled).toBeCloseTo(200);
    expect(sm.currentScore).toBe(Math.floor(200 * GameConfig.SCORE_MULTIPLIER));
  });

  it('複数フレーム更新で距離が加算される', () => {
    sm.update(500, 200);
    sm.update(500, 200);
    expect(sm.distanceTraveled).toBeCloseTo(200);
  });

  it('ハイスコアを保存する', () => {
    sm.update(5000, 200);
    sm.saveHighScore();
    expect(persistence.loadHighScore()).toBe(sm.currentScore);
  });

  it('現在スコアが低い場合はハイスコアを上書きしない', () => {
    persistence.saveHighScore(9999);
    const sm2 = new ScoreManager(persistence);
    sm2.update(100, 100);
    sm2.saveHighScore();
    expect(persistence.loadHighScore()).toBe(9999);
  });

  it('reset後はスコアが0に戻る', () => {
    sm.update(1000, 200);
    sm.reset();
    expect(sm.currentScore).toBe(0);
    expect(sm.distanceTraveled).toBe(0);
  });
});
