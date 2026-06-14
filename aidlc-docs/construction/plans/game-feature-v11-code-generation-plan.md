# Code Generation Plan - game-feature-v1.1

## ユニット概要
- **ユニット名**: game-feature-v1.1
- **実装内容**: ライフシステム・直線飛来障害物・得点/回復アイテム・無敵パワーアップ
- **対象要件**: FR-01〜FR-14
- **依存**: 既存 endless-runner コードベース（Phaser.js + TypeScript）

---

# PART 1 - PLAN（承認待ち）

## Step 1: GameConfig.ts - 定数追加
- [x] `MAX_LIVES: 3`
- [x] `DAMAGE_INVINCIBILITY_DURATION: 1500`（被弾後の無敵時間 ms）
- [x] `INVINCIBILITY_POWERUP_DURATION: 5000`（パワーアップ無敵時間 ms）
- [x] `PROJECTILE_POOL_SIZE: 15`
- [x] `PROJECTILE_Y_GROUND: 375`（地上レーン Y 座標）
- [x] `PROJECTILE_Y_MID: 240`（1段ジャンプレーン Y 座標）
- [x] `PROJECTILE_Y_HIGH: 120`（2段ジャンプレーン Y 座標）
- [x] `PROJECTILE_SPAWN_INTERVAL: 4000`（飛来障害物スポーン間隔 ms）
- [x] `ITEM_POOL_SIZE: 5`
- [x] `SCORE_ITEM_BONUS: 100`
- [x] `SCORE_ITEM_SPAWN_INTERVAL: 6000`
- [x] `RECOVERY_ITEM_SPAWN_INTERVAL: 12000`

## Step 2: PowerUp.ts - 型定義拡張
- [x] `PowerUpType = 'doubleJump' | 'invincibility'` へ変更

## Step 3: Player.ts - 無敵フラグ追加
- [x] `isInvincibleFromPowerUp = false` プロパティ追加
- [x] `reset()` で `isInvincibleFromPowerUp = false` に追加

## Step 4: LifeManager.ts - 新規作成
- [x] `lives` / `maxLives` / `isDamageInvincible` プロパティ
- [x] `update(deltaMs)` - 被弾後無敵タイマーを減算
- [x] `takeDamage()` - 無敵中は false を返却、そうでなければライフ減・無敵タイマー開始
- [x] `recover()` - ライフ上限以下なら +1
- [x] `isDead()` - ライフ 0 判定
- [x] `reset()` - ライフとタイマーをリセット

## Step 5: InvincibilityPowerUp.ts - 新規作成
- [x] `PowerUp` 抽象クラスを継承
- [x] `type = 'invincibility'`
- [x] `duration = GameConfig.INVINCIBILITY_POWERUP_DURATION`
- [x] `apply(player)` → `player.isInvincibleFromPowerUp = true`
- [x] `remove(player)` → `player.isInvincibleFromPowerUp = false`

## Step 6: PowerUpItem.ts - 色分け対応
- [x] `activate()` 内でタイプ別に `setFillStyle()` を呼び出す
  - `doubleJump`: `0xffee00`（金）
  - `invincibility`: `0xcc44ff`（紫）

## Step 7: PowerUpManager.ts - invincibility スポーン追加
- [x] `InvincibilityPowerUp` をインポート
- [x] `collect()` 内でタイプ別にパワーアップインスタンスを生成
- [x] `spawn()` 内でランダムに `doubleJump` / `invincibility` を選択

## Step 8: ProjectileObstacle.ts - 新規作成
- [x] `Obstacle` を継承（StaticBody + Rectangle）
- [x] 色 `0xff6600`（オレンジ、地上障害物の赤と区別）
- [x] `update(deltaMs)` で左方向に移動・`body.reset()`

## Step 9: ObstacleManager.ts - ProjectileObstacle 追加
- [x] `projectilePool: ProjectileObstacle[]` をプールサイズ分生成
- [x] `projectileTimer` と `PROJECTILE_SPAWN_INTERVAL` を追加
- [x] `update()` 内で `difficultyLevel >= 2` の場合にスポーン
- [x] `spawn` ロジック: 3レーン（Ground/Mid/High）からランダム選択、幅 25 × 高さ 18
- [x] `getActive()` に `projectilePool` を追加
- [x] `reset()` に `projectilePool` のデアクティベートを追加

## Step 10: ScoreItem.ts - 新規作成
- [x] `Phaser.GameObjects.Polygon` を継承（ダイヤ形状、`0xffdd00` 金色）
- [x] StaticBody で `body.reset()` パターンを使用
- [x] `activate(x, y, speed)` / `deactivate()` / `update(deltaMs)`

## Step 11: RecoveryItem.ts - 新規作成
- [x] `Phaser.GameObjects.Polygon` を継承（ダイヤ形状、`0x44ff88` 緑色）
- [x] ScoreItem と同様のパターン

## Step 12: ItemManager.ts - 新規作成
- [x] `ScoreItem` / `RecoveryItem` プール各 `ITEM_POOL_SIZE` 分生成
- [x] 個別タイマーで各スポーン間隔管理
- [x] `update(deltaMs, gameSpeed)` でスポーン・移動・画面外デアクティベート
- [x] `getActiveScoreItems()` / `getActiveRecoveryItems()` を公開
- [x] `reset()`

## Step 13: ScoreManager.ts - addBonus 追加
- [x] `_bonusScore = 0` フィールド追加
- [x] `addBonus(amount)` メソッド追加
- [x] `currentScore` getter を `_currentScore + _bonusScore` に変更
- [x] `reset()` で `_bonusScore = 0` を追加

## Step 14: GameHUD.ts - ライフ表示追加
- [x] `livesText: Phaser.GameObjects.Text` 追加（右上、`LIFE: 3`）
- [x] `updateLives(lives, maxLives)` メソッド追加
- [x] `updatePowerUp()` を拡張して doubleJump と invincibility 両方を表示

## Step 15: GameScene.ts - 全統合
- [x] `LifeManager` / `ItemManager` をインポート・インスタンス化（`create()` 内）
- [x] `gameLoop()` に `lifeManager.update(deltaMs)` と `itemManager.update()` を追加
- [x] 無敵フラッシュ演出（`player.setAlpha()` を `time.now` ベースで切替）
- [x] `checkCollisions()` を以下のように更新:
  - 障害物衝突: 無敵中はスキップ → `lifeManager.takeDamage()` → `lifeManager.isDead()` ならゲームオーバー
  - 得点アイテム収集: `scoreManager.addBonus()` → デアクティベート
  - 回復アイテム収集: `lifeManager.recover()` → HUD更新 → デアクティベート
  - パワーアップ収集: 既存ロジック（変更なし）
- [x] HUD の `updateLives()` 呼び出しを追加
- [x] invincibility の残り時間表示を追加

## Step 16: テスト追加
- [x] `LifeManager` のユニットテスト
  - 初期ライフ確認
  - 被弾でライフ減少
  - 無敵中は被弾しない
  - `recover()` でライフ増加（上限チェック）
  - `isDead()` 判定
- [x] `ScoreManager.addBonus()` のテスト
- [x] 既存テスト 13 件が全て通ることを確認

---

## 実装順序の根拠
1. 定数・型定義（Step 1〜3）→ 全ファイルが依存
2. LifeManager（Step 4）→ GameScene が依存
3. パワーアップ系（Step 5〜7）→ 既存拡張
4. 障害物系（Step 8〜9）→ ObstacleManager 拡張
5. アイテム系（Step 10〜12）→ 新規追加
6. ScoreManager（Step 13）→ GameScene が依存
7. HUD（Step 14）→ GameScene が依存
8. GameScene（Step 15）→ 全統合
9. テスト（Step 16）→ 実装後に検証
