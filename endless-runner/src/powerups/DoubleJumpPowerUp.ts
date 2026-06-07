import { GameConfig } from '../config/GameConfig';
import type { Player } from '../objects/Player';
import { PowerUp, type PowerUpType } from './PowerUp';

export class DoubleJumpPowerUp extends PowerUp {
  readonly type: PowerUpType = 'doubleJump';
  readonly duration = GameConfig.POWERUP_DURATION;

  apply(player: Player): void {
    player.hasDoubleJump = true;
  }

  remove(player: Player): void {
    player.hasDoubleJump = false;
    player.airJumpUsed = false;
  }
}
