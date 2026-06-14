# Code Generation Plan — graphics-v1.2（ネオン都市×忍者グラフィック）

## 概要

- **対象**: endless-runner グラフィック全面刷新
- **テーマ**: ネオン都市（サイバーパンク夜景）× 忍者プレイヤー
- **方針**: Phaser.GameObjects.Graphics.generateTexture() でコードのみ描画（画像ファイル不要）
- **新規ファイル**: 2ファイル（TextureFactory, BackgroundManager）
- **変更ファイル**: 11ファイル

## 実装ステップ

### Step 1: GameConfig.ts — 3段階スコアボーナス追加
- [x] `SCORE_ITEM_BONUS: 100` を削除
- [x] `SCORE_ITEM_BONUS_GOLD: 500` を追加
- [x] `SCORE_ITEM_BONUS_SILVER: 200` を追加
- [x] `SCORE_ITEM_BONUS_BRONZE: 100` を追加

### Step 2: src/graphics/TextureFactory.ts — 新規作成（全テクスチャ生成）

生成するテクスチャ一覧:

| キー | サイズ | 内容 |
|-----|-------|------|
| `'ninja'` | 40×50 | 忍者プレイヤー |
| `'barricade'` | 40×60 | ネオンバリケード |
| `'drone'` | 50×30 | ドローン |
| `'shuriken'` | 28×28 | 手裏剣（4頂点星） |
| `'coin-gold'` | 36×36 | 金古銭 |
| `'coin-silver'` | 30×30 | 銀古銭 |
| `'coin-bronze'` | 26×26 | 銅古銭 |
| `'bandaid'` | 36×16 | 絆創膏 |
| `'shield'` | 32×36 | 盾（無敵） |
| `'boot'` | 32×36 | 靴+モーションライン（2段ジャンプ） |
| `'bg-sky'` | 800×450 | 夜空（グラデーション+星） |
| `'bg-far'` | 400×300 | 遠景ビルシルエット（タイリング） |
| `'bg-mid'` | 300×200 | 中景ビル（タイリング） |

- [x] `src/graphics/` ディレクトリ作成
- [x] `TextureFactory.ts` 作成
- [x] 各テクスチャ生成メソッドを実装

### Step 3: src/managers/BackgroundManager.ts — 新規作成

- [x] `BackgroundManager.ts` 作成
- [x] sky: 800×450 Image（固定）
- [x] farLayer: TileSprite (400高さ, bg-far テクスチャ, scrollX = 0.15×gameSpeed)
- [x] midLayer: TileSprite (250高さ, bg-mid テクスチャ, scrollX = 0.40×gameSpeed)
- [x] `create(scene)` メソッド
- [x] `update(deltaMs, gameSpeed)` で各レイヤーの tilePositionX を更新

### Step 4: src/objects/Obstacle.ts — Rectangle から Sprite に変更

- [x] `extends Phaser.GameObjects.Rectangle` → `extends Phaser.Physics.Arcade.Sprite`
- [x] コンストラクタに `textureKey: string` 引数追加
- [x] `setFillStyle` 削除、テクスチャ使用に変更
- [x] `activate()` で `setDisplaySize()` を使用してサイズ調整
- [x] 物理ボディは `(this.body as Phaser.Physics.Arcade.StaticBody)` のまま

### Step 5: src/objects/StaticObstacle.ts — テクスチャ対応

- [x] コンストラクタで `'barricade'` テクスチャを使用
- [x] `setFillStyle` 削除

### Step 6: src/objects/MovingObstacle.ts — テクスチャ対応

- [x] コンストラクタで `'drone'` テクスチャを使用
- [x] `setFillStyle` 削除

### Step 7: src/objects/ProjectileObstacle.ts — テクスチャ対応 + 回転

- [x] コンストラクタで `'shuriken'` テクスチャを使用
- [x] `setFillStyle` 削除
- [x] `update()` で `this.angle += deltaMs * 0.36` を追加（360°/秒で回転）

### Step 8: src/objects/ScoreItem.ts — 3段階古銭コイン

- [x] `extends Phaser.GameObjects.Polygon` → `extends Phaser.GameObjects.Image`
- [x] `tier: 'gold' | 'silver' | 'bronze'` プロパティ追加
- [x] `get bonusValue()` getter 実装（GameConfig参照）
- [x] `activate(x, y, speed, tier)` に tier 引数追加
- [x] tier に応じてテクスチャキー切り替え (`setTexture()`)
- [x] `scene.physics.add.existing(this, true)` で静的物理ボディ追加（変更なし）

### Step 9: src/managers/ItemManager.ts — 重み付きtierスポーン

- [x] `spawnScore()` で重み付きランダム tier 決定
  - bronze: 50%, silver: 30%, gold: 20%
- [x] `item.activate(x, y, gameSpeed, tier)` に tier 渡す

### Step 10: src/objects/RecoveryItem.ts — 絆創膏

- [x] `extends Phaser.GameObjects.Polygon` → `extends Phaser.GameObjects.Image`
- [x] `'bandaid'` テクスチャを使用
- [x] `scene.physics.add.existing(this, true)` で静的物理ボディ追加

### Step 11: src/objects/PowerUpItem.ts — 靴・盾テクスチャ

- [x] `extends Phaser.GameObjects.Polygon` → `extends Phaser.GameObjects.Image`
- [x] `activate()` で `'boot'`（doubleJump）/ `'shield'`（invincibility）を `setTexture()` で切り替え
- [x] `setFillStyle` 削除

### Step 12: src/objects/Player.ts — 忍者テクスチャ

- [x] コンストラクタで `''` → `'ninja'` に変更
- [x] `setTint(0x4488ff)` 削除
- [x] `setDisplaySize(40, 50)` は維持

### Step 13: src/scenes/BootScene.ts — TextureFactory 呼び出し

- [x] `import { TextureFactory }` を追加
- [x] `create()` で TextureFactory.createAll(graphics) を呼ぶ
- [x] Graphics オブジェクトを生成・使用・破棄

### Step 14: src/scenes/GameScene.ts — BackgroundManager 組み込み・修正

- [x] `BackgroundManager` import 追加
- [x] `private backgroundManager!: BackgroundManager`
- [x] `create()` で BackgroundManager.create(this) 呼び出し（最初に）
- [x] 地面 Rectangle の色を `0x1a1a3a` に変更 + ネオンライン追加
- [x] `gameLoop()` で `backgroundManager.update(deltaMs, speed)` 呼び出し
- [x] 衝突処理の `scoreManager.addBonus(GameConfig.SCORE_ITEM_BONUS)` → `scoreManager.addBonus(item.bonusValue)` に変更

### Step 15: テスト実行・ビルド確認

- [x] `npm test` 実行（既存26件テストパス確認）
- [x] `npm run build` 実行（プロダクションビルド成功確認）
- [x] ブラウザで動作確認

## 変更ファイル一覧

| ファイル | 種別 | 変更内容 |
|---------|------|---------|
| `src/config/GameConfig.ts` | 変更 | 3段階スコアボーナス |
| `src/graphics/TextureFactory.ts` | **新規** | 全テクスチャ生成 |
| `src/managers/BackgroundManager.ts` | **新規** | パララックス背景 |
| `src/scenes/BootScene.ts` | 変更 | TextureFactory呼び出し |
| `src/scenes/GameScene.ts` | 変更 | BG組み込み・addBonus修正 |
| `src/objects/Obstacle.ts` | 変更 | Sprite化 |
| `src/objects/StaticObstacle.ts` | 変更 | テクスチャ対応 |
| `src/objects/MovingObstacle.ts` | 変更 | テクスチャ対応 |
| `src/objects/ProjectileObstacle.ts` | 変更 | テクスチャ対応・回転追加 |
| `src/objects/ScoreItem.ts` | 変更 | 3段階古銭・tier追加 |
| `src/managers/ItemManager.ts` | 変更 | 重み付きtierスポーン |
| `src/objects/RecoveryItem.ts` | 変更 | 絆創膏テクスチャ |
| `src/objects/PowerUpItem.ts` | 変更 | 靴・盾テクスチャ |
| `src/objects/Player.ts` | 変更 | 忍者テクスチャ |
