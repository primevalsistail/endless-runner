import { describe, it, expect, beforeEach } from 'vitest';
import { DifficultyManager } from '../src/managers/DifficultyManager';
import { GameConfig } from '../src/config/GameConfig';

describe('DifficultyManager', () => {
  let dm: DifficultyManager;

  beforeEach(() => {
    dm = new DifficultyManager();
  });

  it('初期はLevel 1', () => {
    expect(dm.level).toBe(1);
    expect(dm.gameSpeed).toBe(200);
  });

  it('距離200mでLevel 2になる', () => {
    dm.update(200);
    expect(dm.level).toBe(2);
    expect(dm.gameSpeed).toBe(280);
  });

  it('距離500mでLevel 3になる', () => {
    dm.update(500);
    expect(dm.level).toBe(3);
  });

  it('距離1400mでLevel 5（最高）になる', () => {
    dm.update(1400);
    expect(dm.level).toBe(5);
    expect(dm.gameSpeed).toBe(500);
  });

  it('距離が閾値未満ではレベルが上がらない', () => {
    dm.update(199);
    expect(dm.level).toBe(1);
  });

  it('GameConfig の DIFFICULTY_LEVELS と整合する', () => {
    for (const config of GameConfig.DIFFICULTY_LEVELS) {
      dm.update(config.distanceThreshold);
      expect(dm.level).toBe(config.level);
      expect(dm.gameSpeed).toBe(config.gameSpeed);
    }
  });

  it('reset後はLevel 1に戻る', () => {
    dm.update(1000);
    dm.reset();
    expect(dm.level).toBe(1);
  });
});
