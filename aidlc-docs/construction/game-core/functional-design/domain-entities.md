# Domain Entities — Unit 1: game-core

## Player（プレイヤー）

| 属性 | 型 | 説明 |
|-----|-----|------|
| position | Vector2 | 現在位置 |
| velocity | Vector2 | 速度ベクトル |
| isOnGround | bool | 地面接地フラグ |
| jumpHoldTime | double | ジャンプ長押し経過時間（秒） |
| airJumpUsed | bool | 空中ジャンプ使用済みフラグ |
| activePowerUps | Map\<PowerUpType, double\> | 有効中パワーアップと残り時間 |

---

## Obstacle（障害物 — 抽象）

| 属性 | 型 | 説明 |
|-----|-----|------|
| position | Vector2 | 現在位置 |
| size | Vector2 | 衝突判定サイズ |
| scrollSpeed | double | 左スクロール速度（ゲーム速度と同期） |

### StaticObstacle
- 追加属性なし。一定速度で左に移動するのみ

### MovingObstacle

| 追加属性 | 型 | 説明 |
|---------|-----|------|
| movementPattern | MovementPattern | 動きのパターン（UP_DOWN / DIAGONAL など） |
| amplitude | double | 移動幅 |
| frequency | double | 往復周期（秒） |
| phaseOffset | double | 動き開始タイミングのオフセット |

---

## PowerUpItem（フィールド上のアイテム）

| 属性 | 型 | 説明 |
|-----|-----|------|
| position | Vector2 | ワールド座標 |
| type | PowerUpType | パワーアップ種別 |

---

## PowerUp（有効中の効果 — 抽象）

| 属性 | 型 | 説明 |
|-----|-----|------|
| type | PowerUpType | 種別 |
| duration | double | 効果持続時間（秒） |

### DoubleJumpPowerUp
- 追加属性なし。有効中は `Player.airJumpUsed = false` にリセットしてジャンプ可能にする

### PowerUpType（列挙）
```
DOUBLE_JUMP
（将来追加分もここに列挙）
```

---

## DifficultyLevel（難易度段階）

| 属性 | 型 | 説明 |
|-----|-----|------|
| level | int | 現在レベル（1〜） |
| gameSpeed | double | このレベルでのスクロール速度 |
| obstacleInterval | double | 障害物スポーン間隔（秒） |
| distanceThreshold | double | 次レベルへ進む走行距離 |

---

## Score（スコア）

| 属性 | 型 | 説明 |
|-----|-----|------|
| currentScore | int | 現在スコア（表示用） |
| distanceTraveled | double | 走行距離（スコア計算の元値） |

---

## GameConfig（定数群）

| 定数 | 説明 |
|-----|------|
| GRAVITY | 重力加速度 |
| INITIAL_JUMP_FORCE | ジャンプ初速 |
| MAX_JUMP_HOLD_TIME | 長押し最大時間（秒） |
| HOLD_JUMP_EXTRA_FORCE | 長押し中に毎フレーム加える上向き力 |
| INITIAL_SPEED | 初期スクロール速度 |
| MAX_SPEED | 最高速度の上限 |
| SCORE_MULTIPLIER | 距離→スコア変換係数 |
