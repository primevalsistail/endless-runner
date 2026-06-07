# NFR Design — Unit 1: game-core

## PERF-01: 60fps 安定動作

| 項目 | 設計方針 |
|------|---------|
| ループ | Phaser の `requestAnimationFrame` ベースゲームループをそのまま使用（デフォルト 60fps） |
| オブジェクト管理 | Obstacle・PowerUpItem は **オブジェクトプール**（Phaser.GameObjects.Group）で再利用。画面外に出たら非アクティブ化、必要時に再アクティブ化。生成・破棄のコストを排除 |
| update() の制約 | `GameScene.update()` 内で新規オブジェクト生成・DOM操作・重い計算を行わない。スポーンはプールからの取り出しのみ |

---

## PERF-02: 起動3秒以内

| 項目 | 設計方針 |
|------|---------|
| アセット | 画像・音声ファイルなし。すべて Phaser の図形描画（Rectangle/Ellipse）で生成するため BootScene のロード時間はほぼゼロ |
| バンドル | Vite のプロダクションビルドで JS を最小化・1ファイル化。初回ロードを最小限に |
| BootScene の役割 | アセットロードなし。設定値のセットアップのみ行い即座に MenuScene へ遷移 |

---

## PERF-03: メモリ 100MB 以下

| 項目 | 設計方針 |
|------|---------|
| プール上限 | ObstacleManager: 最大20オブジェクト。PowerUpManager: 最大5オブジェクト |
| 解放タイミング | 画面左端を超えた Obstacle・PowerUpItem をプールに返却。Destroy は行わない |
| テクスチャ | 図形のみのため生成コストが低い。ゲーム中にテクスチャ生成を行わない |

---

## COMPAT-01/02: ブラウザ・iPhone Safari 対応

| 項目 | 設計方針 |
|------|---------|
| レンダラー | Phaser AUTO（WebGL 優先・Canvas フォールバック）。Safari の WebGL 制限を自動回避 |
| ビルドターゲット | `vite.config.ts` の `target` を `'es2020'` に設定。iOS 16+ Safari は ES2020 対応済み |
| 入力 | `Phaser.Input.Pointer` を使用。マウスクリックとタッチを同一 API で処理 |
| 長押し判定 | `scene.input.on('pointerdown')` / `scene.input.on('pointerup')` でポインタ押下時間を計測。`update()` で経過時間を参照 |

---

## COMPAT-03: 横向き（Landscape）画面

| 項目 | 設計方針 |
|------|---------|
| ゲーム解像度 | `800 × 450`（16:9） |
| スケール設定 | `Phaser.Scale.FIT` + `autoCenter: CENTER_BOTH`。ブラウザウィンドウサイズに合わせてアスペクト比を保ちながらスケール |
| 縦向き時 | 崩れないが横向き推奨のメッセージを MenuScene に表示することを Unit 2 で検討 |

Phaser 設定例:
```typescript
scale: {
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  width: 800,
  height: 450,
}
```

---

## REL-01: オフライン動作

| 項目 | 設計方針 |
|------|---------|
| CDN 不使用 | Phaser を npm でインストールし Vite でバンドル。外部 CDN へのリクエストなし |
| 外部通信 | ゲームロジック内に HTTP リクエストなし。localStorage のみ使用 |

---

## REL-02: localStorage によるデータ保護

| 項目 | 設計方針 |
|------|---------|
| キー | `endless_runner_high_score`（固定文字列定数として定義） |
| 読み書き | `StorageService`（Unit 2）が `try/catch` でラップ。例外時は `0` を返す |
| スコープ | Unit 1 は `IPersistenceService` インターフェースのみ参照。localStorage の詳細は Unit 1 に漏れない |

---

## REL-03: 例外 → 安全なゲームオーバー

| 項目 | 設計方針 |
|------|---------|
| ガード範囲 | `GameScene.update()` を `try/catch` でラップ |
| 例外発生時 | `GameStateManager.endGame(currentScore)` を呼び出してゲームオーバー遷移。ゲームがフリーズしない |
| ログ | `console.error(e)` で開発時に把握できる状態にする |

```typescript
update(time: number, delta: number): void {
  try {
    this.gameLoop(time, delta);
  } catch (e) {
    console.error(e);
    this.gameStateManager.endGame(this.scoreManager.currentScore);
  }
}
```

---

## MAINT-01: TypeScript 型安全

| 項目 | 設計方針 |
|------|---------|
| `tsconfig.json` | `"strict": true`（strictNullChecks・noImplicitAny を含む） |
| `any` 禁止 | game-core ソース内で `any` 型を使用しない |
| インターフェース | `IPersistenceService` を明示的に型定義。StorageService は必ずこれを実装 |

---

## MAINT-02: ユニットテスト

| 項目 | 設計方針 |
|------|---------|
| テストフレームワーク | **Vitest**（Vite と同一エコシステム。設定ファイル共用） |
| テスト対象 | `ScoreManager`・`DifficultyManager`（純粋な計算ロジック。Phaser 依存なし） |
| テスト方針 | Phaser をモックしない。テスト対象クラスを Phaser 非依存に設計し、そのまま import してテスト |

テスト例（イメージ）:
```typescript
// ScoreManager.test.ts
describe('ScoreManager', () => {
  it('距離ベースでスコアを計算する', () => {
    const sm = new ScoreManager();
    sm.update(1000, 200); // dt=1000ms, gameSpeed=200
    expect(sm.currentScore).toBe(/* distance * SCORE_MULTIPLIER */);
  });
});

// DifficultyManager.test.ts
describe('DifficultyManager', () => {
  it('距離200mでLevel 2になる', () => {
    const dm = new DifficultyManager();
    expect(dm.getLevel(200)).toBe(2);
  });
});
```

---

## MAINT-03: OCP 拡張性

| 項目 | 設計方針 |
|------|---------|
| Obstacle 拡張 | `Obstacle` abstract class に `abstract update(dt: number): void` を定義。新障害物は継承するだけ |
| PowerUp 拡張 | `PowerUp` abstract class に `abstract apply(player: Player): void` / `abstract remove(player: Player): void` を定義 |
| 登録方式 | ObstacleManager・PowerUpManager に型と出現重みのテーブルを持たせ、新クラスをテーブルに追加するだけで既存コード変更不要 |
