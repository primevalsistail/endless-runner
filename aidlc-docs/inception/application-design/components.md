# Components — コンポーネント定義

> **v2 更新**: Flutter + Flame → Phaser.js + TypeScript に変更

## シーン（Phaser.Scene）

### BootScene
- **責務**: ゲームアセット（画像・音声）の事前読み込み。完了後 MenuScene へ自動遷移

### MenuScene
- **責務**: タイトル表示、ハイスコア表示、ゲーム開始ボタン。StorageService からハイスコードを読み込む

### GameScene
- **責務**: ゲームループ管理・全ゲームオブジェクトの統括・入力処理
- **SRP**: ゲーム状態（playing/gameOver）は GameStateManager に委譲。衝突発生時は GameStateManager.endGame() を呼ぶだけ

### GameOverScene
- **責務**: ゲームオーバー表示、スコア・ハイスコード表示、リトライ／メニューボタン

---

## ゲームオブジェクト（Phaser.GameObjects）

### Player
- **種別**: Phaser.Physics.Arcade.Sprite
- **責務**: プレイヤー描画・物理挙動（重力・ジャンプ）・長押しジャンプ・空中ジャンプ状態管理・パワーアップ状態保持

### Obstacle（抽象基底クラス）
- **種別**: Abstract class（OCP + LSP 対応）
- **責務**: 全障害物共通インターフェース（スクロール速度・移動・衝突判定）
- **拡張**: 新障害物タイプは Obstacle を継承するだけで追加可能

### StaticObstacle
- **種別**: Obstacle 継承
- **責務**: 静止した障害物。一定速度で左スクロール

### MovingObstacle
- **種別**: Obstacle 継承
- **責務**: 動く障害物。左スクロールに加えて上下など独自の動きを持つ

### PowerUpItem
- **種別**: Phaser.GameObjects.Shape（図形で表現）
- **責務**: フィールド上のパワーアップアイテム表示・衝突判定

---

## マネージャー（TypeScript クラス、GameScene 内で使用）

### ObstacleManager
- **責務**: 静止・動く障害物のスポーン、画面外削除、難易度に応じた出現頻度・種類調整

### PowerUpManager
- **責務**: パワーアップアイテムのスポーン、取得時の効果適用・タイマー管理
- **拡張**: PowerUp 抽象クラスを継承するだけで新パワーアップを追加可能

### PowerUp（抽象基底クラス）
- **種別**: Abstract class
- **責務**: 全パワーアップ共通インターフェース（種別・持続時間・適用・解除）

### DoubleJumpPowerUp
- **種別**: PowerUp 継承
- **責務**: 有効期間中、Player に空中ジャンプ 1 回を追加で許可

### ScoreManager
- **責務**: 走行距離ベースのスコア計算・ハイスコード更新判定・StorageService 経由での保存

### DifficultyManager
- **責務**: ステップ式難易度管理（走行距離に応じた速度・障害物頻度の段階的増加）

### GameStateManager
- **責務**: ゲーム状態マシン（countdown → playing → gameOver）・シーン遷移のトリガー
- **DIP**: GameScene が直接状態を持たないようにする単一の状態管理者

### GameHUD
- **責務**: Phaser の DOM/Graphics でスコア・パワーアップ残り時間をリアルタイム表示

---

## サービス

### IPersistenceService（抽象インターフェース、Unit 1 側で定義）
- **責務**: 永続化操作の抽象化（saveHighScore / loadHighScore）
- **DIP**: ScoreManager は具体クラスではなくこのインターフェースに依存

### StorageService（IPersistenceService 実装）
- **責務**: localStorage を使ったハイスコア永続化（shared_preferences から変更）

---

## BackgroundManager（v1.2 新規追加）

- **種別**: TypeScript クラス（Phaser.Scene に依存）
- **責務**: パララックス多層背景の生成・スクロール管理
- **レイヤー**: スカイ（固定）・遠景ビル・中景ビル・地面装飾の4層
- **実装**: TileSprite または Graphics × 2枚ループ方式

---

## グラフィック方針（v1.2 — ネオン都市×忍者）

詳細は [graphics-design.md](./graphics-design.md) を参照。

| ゲームオブジェクト | 表現 |
|-----------------|------|
| Player | 忍者（黒ボディ・シアンスカーフ・赤い目）|
| StaticObstacle | ネオンバリケード（ダーク地にオレンジ縞） |
| MovingObstacle | ドローン（灰色ボディ・緑センサー目） |
| ProjectileObstacle | 手裏剣（4頂点星・回転アニメ） |
| ScoreItem（金） | 古銭コイン・大（金色、500pts） |
| ScoreItem（銀） | 古銭コイン・中（銀色、200pts） |
| ScoreItem（銅） | 古銭コイン・小（銅色、100pts） |
| RecoveryItem | 絆創膏（ピンク端・白ガーゼ） |
| PowerUpItem（ダブルジャンプ） | 靴 + モーションライン（飛んでいる表現） |
| PowerUpItem（無敵） | 盾（鋼青・金縁） |
| 背景 | パララックス4層（ネオン都市夜景） |
| 地面 | ダーク地 + シアンネオンライン |
