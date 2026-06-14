import { describe, it, expect, beforeEach } from 'vitest';
import { LifeManager } from '../src/managers/LifeManager';
import { GameConfig } from '../src/config/GameConfig';

describe('LifeManager', () => {
  let lm: LifeManager;

  beforeEach(() => {
    lm = new LifeManager();
  });

  it('初期ライフは MAX_LIVES', () => {
    expect(lm.lives).toBe(GameConfig.MAX_LIVES);
    expect(lm.maxLives).toBe(GameConfig.MAX_LIVES);
  });

  it('初期状態は無敵でない', () => {
    expect(lm.isDamageInvincible).toBe(false);
  });

  it('takeDamage でライフが 1 減る', () => {
    lm.takeDamage();
    expect(lm.lives).toBe(GameConfig.MAX_LIVES - 1);
  });

  it('takeDamage 後は無敵になる', () => {
    lm.takeDamage();
    expect(lm.isDamageInvincible).toBe(true);
  });

  it('無敵中は takeDamage が false を返す', () => {
    lm.takeDamage();
    const result = lm.takeDamage();
    expect(result).toBe(false);
    expect(lm.lives).toBe(GameConfig.MAX_LIVES - 1);
  });

  it('無敵時間が経過すると無敵が解除される', () => {
    lm.takeDamage();
    lm.update(GameConfig.DAMAGE_INVINCIBILITY_DURATION + 1);
    expect(lm.isDamageInvincible).toBe(false);
  });

  it('ライフ 0 で isDead が true', () => {
    lm.takeDamage();
    lm.update(GameConfig.DAMAGE_INVINCIBILITY_DURATION + 1);
    lm.takeDamage();
    lm.update(GameConfig.DAMAGE_INVINCIBILITY_DURATION + 1);
    lm.takeDamage();
    expect(lm.isDead()).toBe(true);
  });

  it('recover でライフが 1 増える', () => {
    lm.takeDamage();
    lm.update(GameConfig.DAMAGE_INVINCIBILITY_DURATION + 1);
    lm.recover();
    expect(lm.lives).toBe(GameConfig.MAX_LIVES);
  });

  it('recover は MAX_LIVES を超えない', () => {
    lm.recover();
    expect(lm.lives).toBe(GameConfig.MAX_LIVES);
  });

  it('reset でライフと無敵タイマーが初期化される', () => {
    lm.takeDamage();
    lm.reset();
    expect(lm.lives).toBe(GameConfig.MAX_LIVES);
    expect(lm.isDamageInvincible).toBe(false);
  });
});
