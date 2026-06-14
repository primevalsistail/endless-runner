import { GameConfig } from '../config/GameConfig';
import type { Player } from '../objects/Player';
import { PowerUp, type PowerUpType } from './PowerUp';

export class InvincibilityPowerUp extends PowerUp {
  readonly type: PowerUpType = 'invincibility';
  readonly duration = GameConfig.INVINCIBILITY_POWERUP_DURATION;

  apply(player: Player): void {
    player.isInvincibleFromPowerUp = true;
  }

  remove(player: Player): void {
    player.isInvincibleFromPowerUp = false;
  }
}
