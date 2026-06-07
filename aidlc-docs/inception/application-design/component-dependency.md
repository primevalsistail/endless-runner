# Component Dependency — 依存関係・通信パターン

> **v2 更新**: Phaser.js + TypeScript 向けに更新

## 依存関係マトリクス

| コンポーネント | 依存先 |
|--------------|--------|
| `GameScene` | Player, ObstacleManager, PowerUpManager, ScoreManager, DifficultyManager, GameStateManager, GameHUD |
| `Player` | （GameScene から入力・物理を受け取る） |
| `ObstacleManager` | （GameScene から速度を受け取る） |
| `StaticObstacle` | Obstacle（基底クラス） |
| `MovingObstacle` | Obstacle（基底クラス） |
| `PowerUpManager` | Player（効果適用） |
| `DoubleJumpPowerUp` | PowerUp（基底クラス） |
| `ScoreManager` | IPersistenceService（ハイスコア保存・読み込み） |
| `DifficultyManager` | （ScoreManager から距離を受け取る） |
| `GameStateManager` | （Phaser.scene.start() でシーン遷移） |
| `GameHUD` | （GameScene から通知を受け取る） |
| `IPersistenceService` | （抽象インターフェース。Unit 2 の StorageService が実装） |
| `MenuScene` | IPersistenceService（ハイスコア表示）, GameStateManager |
| `GameOverScene` | GameStateManager（リトライ） |
| `StorageService` | localStorage（ブラウザ標準 API） |

---

## データフロー図

```
タップ / クリック入力
    │
    ▼
GameScene.onPointerDown()
    │
    ▼
Player.jump()
    │
    ├─── 地面にいる → シングルジャンプ実行
    ├─── DoubleJumpPowerUp 有効 AND airJumpUsed=false → ダブルジャンプ実行
    └─── それ以外 → 無視

衝突（障害物）
    │
Phaser.Physics.Arcade overlap イベント
    │
    ├─── Obstacle → GameStateManager.endGame(score)
    │                  └─ GameOverScene へ遷移
    └─── PowerUpItem → PowerUpManager.activate(type)
                            └─ Player.applyPowerUp(powerUp)

毎フレーム（update）
    │
    ├─── DifficultyManager.update(distance) → gameSpeed, obstacleInterval
    ├─── ObstacleManager.update(dt, gameSpeed)
    ├─── PowerUpManager.update(dt) → 期限切れ → Player.removePowerUp()
    ├─── ScoreManager.update(dt, gameSpeed) → currentScore
    └─── GameHUD.refresh(score, powerUpStatus)
```

---

## 通信パターン

| パターン | 使用箇所 |
|---------|---------|
| 直接メソッド呼び出し | GameScene → 各コンポーネント |
| Phaser イベント / overlap | Phaser.Physics.Arcade による衝突検出 |
| DIP インターフェース | IPersistenceService（Unit 1 定義 → Unit 2 実装） |
| 抽象基底クラス | PowerUp → DoubleJumpPowerUp（拡張ポイント） |
| 抽象基底クラス | Obstacle → StaticObstacle / MovingObstacle（拡張ポイント） |

---

## パワーアップ拡張ポイント

新しいパワーアップを追加する場合は以下の手順のみで対応可能：

```
1. PowerUp を継承した新クラスを作成
   例: InvinciblePowerUp extends PowerUp

2. apply() と remove() を実装

3. PowerUpManager.registerPowerUp() で登録
```

既存コンポーネントへの変更は不要。

## 障害物拡張ポイント

新しい障害物を追加する場合：

```
1. Obstacle を継承した新クラスを作成
   例: FlyingObstacle extends Obstacle

2. update() を実装（移動パターンを定義）

3. ObstacleManager のスポーン重みに追加
```
