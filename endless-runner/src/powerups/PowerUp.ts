import type { Player } from '../objects/Player';

export type PowerUpType = 'doubleJump' | 'invincibility';

export abstract class PowerUp {
  abstract readonly type: PowerUpType;
  abstract readonly duration: number;

  abstract apply(player: Player): void;
  abstract remove(player: Player): void;
}
