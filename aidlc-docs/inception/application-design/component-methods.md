# Component Methods — メソッドシグネチャ

> 詳細なビジネスロジックは CONSTRUCTION フェーズの Functional Design で定義します。

## GameScene

```dart
class GameScene extends FlameGame with HasCollisionDetection {
  Future<void> onLoad()                    // コンポーネント初期化・登録
  void update(double dt)                   // ゲームループ（毎フレーム）
  void onTapDown(TapDownInfo info)         // タップ入力 → PlayerCharacter へ委譲
  void onGameOver()                        // ゲームオーバー処理・GameService 通知
  void _increaseSpeed()                    // 時間経過による速度増加
}
```

## PlayerCharacter

```dart
class PlayerCharacter extends SpriteComponent with CollisionCallbacks {
  void jump()                              // ジャンプ実行（地面 or ダブルジャンプ許可時）
  void applyPowerUp(PowerUp powerUp)       // パワーアップ効果を適用
  void removePowerUp(PowerUpType type)     // パワーアップ効果を解除
  void onCollisionStart(Set<Vector2> points, PositionComponent other) // 衝突イベント
  void update(double dt)                   // 重力・位置更新
  bool get canDoubleJump                   // ダブルジャンプ可能か判定
}
```

## ObstacleManager

```dart
class ObstacleManager extends Component {
  void spawnObstacle()                     // 障害物をランダムに生成（静止 or 動く）
  void removeOffscreen()                   // 画面外障害物を削除
  void setSpeed(double speed)              // ゲーム速度を反映
  void update(double dt)                   // スポーンタイマー管理
}
```

## PowerUp（抽象基底クラス）

```dart
abstract class PowerUp {
  PowerUpType get type                     // パワーアップ種別
  double get duration                      // 効果持続時間（秒）
  void apply(PlayerCharacter player)       // 効果を適用
  void remove(PlayerCharacter player)      // 効果を解除
}
```

## PowerUpManager

```dart
class PowerUpManager extends Component {
  void spawnPowerUp()                      // パワーアップアイテムをスポーン
  void activatePowerUp(PowerUp powerUp, PlayerCharacter player) // 取得・効果開始
  void update(double dt)                   // 効果タイマー管理・期限切れ解除
  void registerPowerUp(PowerUp powerUp)    // 新パワーアップ種別を登録（拡張用）
}
```

## ScoreManager

```dart
class ScoreManager extends Component {
  void update(double dt)                   // スコア加算（時間ベース）
  int get currentScore                     // 現在スコアを取得
  Future<int> loadHighScore()              // 保存済みハイスコアを読込
  Future<void> saveHighScore(int score)    // ハイスコアを保存
  void reset()                             // スコアをリセット
  bool get isNewHighScore                  // 現在スコアがハイスコアを超えているか
}
```

## GameHUD

```dart
class GameHUD extends PositionComponent {
  void updateScore(int score)              // スコア表示を更新
  void showPowerUpIndicator(PowerUpType type, double remaining) // パワーアップUI表示
  void hidePowerUpIndicator()              // パワーアップUI非表示
}
```

## ParallaxBackground

```dart
class ParallaxBackground extends ParallaxComponent {
  Future<void> onLoad()                    // レイヤー画像を読込・設定
  void setScrollSpeed(double speed)        // ゲーム速度に合わせてスクロール速度を調整
}
```

## AudioManager

```dart
class AudioManager {
  static AudioManager get instance         // シングルトンアクセス
  Future<void> initialize()               // オーディオリソースを事前読込
  void playBGM()                           // BGM をループ再生
  void stopBGM()                           // BGM を停止
  void playSFX(SoundEffect effect)         // 効果音を再生（jump/collision/powerup）
  void setMasterVolume(double volume)      // 音量設定（0.0〜1.0）
}

enum SoundEffect { jump, collision, powerUpCollect, powerUpExpire }
```

## GameService

```dart
class GameService {
  static GameService get instance          // シングルトンアクセス
  GameState get currentState               // 現在のゲーム状態
  void startGame(BuildContext context)     // ゲーム画面へ遷移
  void endGame(int score)                  // ゲームオーバー画面へ遷移
  void retryGame(BuildContext context)     // 再プレイ
  void goToMenu(BuildContext context)      // メニューへ戻る
}

enum GameState { menu, playing, gameOver }
```

## PersistenceService

```dart
class PersistenceService {
  static PersistenceService get instance   // シングルトンアクセス
  Future<void> initialize()               // shared_preferences 初期化
  Future<int> loadHighScore()             // ハイスコア読込（未保存時は 0）
  Future<void> saveHighScore(int score)   // ハイスコア保存
  Future<void> clearAll()                 // データ全削除（デバッグ用）
}
```
