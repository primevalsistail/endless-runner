export const GameConfig = {
  WIDTH: 800,
  HEIGHT: 450,
  GRAVITY: 1500,
  INITIAL_JUMP_FORCE: -650,
  HOLD_JUMP_FORCE: -200,
  MAX_JUMP_HOLD_TIME: 250,

  INITIAL_GAME_SPEED: 200,
  SCORE_MULTIPLIER: 0.1,

  GROUND_Y: 400,
  PLAYER_X: 100,

  OBSTACLE_POOL_SIZE: 20,
  POWERUP_POOL_SIZE: 5,
  POWERUP_DURATION: 8000,

  HIGH_SCORE_KEY: 'endless_runner_high_score',

  COUNTDOWN_DURATION: 3,

  MAX_LIVES: 3,
  DAMAGE_INVINCIBILITY_DURATION: 1500,
  INVINCIBILITY_POWERUP_DURATION: 5000,

  PROJECTILE_POOL_SIZE: 15,
  PROJECTILE_Y_GROUND: 375,
  PROJECTILE_Y_MID: 240,
  PROJECTILE_Y_HIGH: 120,
  PROJECTILE_SPAWN_INTERVAL: 4000,

  ITEM_POOL_SIZE: 5,
  SCORE_ITEM_BONUS_GOLD: 500,
  SCORE_ITEM_BONUS_SILVER: 200,
  SCORE_ITEM_BONUS_BRONZE: 100,
  SCORE_ITEM_SPAWN_INTERVAL: 6000,
  RECOVERY_ITEM_SPAWN_INTERVAL: 12000,

  DIFFICULTY_LEVELS: [
    { level: 1, distanceThreshold: 0,    gameSpeed: 200, obstacleInterval: 3500 },
    { level: 2, distanceThreshold: 200,  gameSpeed: 280, obstacleInterval: 2800 },
    { level: 3, distanceThreshold: 500,  gameSpeed: 360, obstacleInterval: 2200 },
    { level: 4, distanceThreshold: 900,  gameSpeed: 440, obstacleInterval: 1700 },
    { level: 5, distanceThreshold: 1400, gameSpeed: 500, obstacleInterval: 1300 },
  ],
} as const;
