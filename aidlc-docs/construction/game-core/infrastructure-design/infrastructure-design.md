# Infrastructure Design — Unit 1: game-core

## ディレクトリ構成

```
endless-runner/
├── src/
│   ├── main.ts                        # Phaser.Game 初期化エントリーポイント
│   ├── config/
│   │   └── GameConfig.ts              # ゲーム定数（重力・速度・スコア係数など）
│   ├── scenes/
│   │   └── GameScene.ts               # ゲームループ管理・入力処理
│   ├── objects/
│   │   ├── Player.ts
│   │   ├── Obstacle.ts                # abstract
│   │   ├── StaticObstacle.ts
│   │   ├── MovingObstacle.ts
│   │   └── PowerUpItem.ts
│   ├── powerups/
│   │   ├── PowerUp.ts                 # abstract
│   │   └── DoubleJumpPowerUp.ts
│   ├── managers/
│   │   ├── ObstacleManager.ts
│   │   ├── PowerUpManager.ts
│   │   ├── ScoreManager.ts
│   │   ├── DifficultyManager.ts
│   │   └── GameStateManager.ts
│   ├── hud/
│   │   └── GameHUD.ts
│   └── services/
│       └── IPersistenceService.ts     # DIP インターフェース定義
├── tests/
│   ├── ScoreManager.test.ts
│   └── DifficultyManager.test.ts
├── package.json
├── tsconfig.json
└── vite.config.ts
```

> Unit 2 で追加されるファイル: `src/scenes/BootScene.ts`, `MenuScene.ts`, `GameOverScene.ts`, `src/services/StorageService.ts`, `index.html`, GitHub Pages 設定

---

## 依存パッケージ（package.json）

```json
{
  "dependencies": {
    "phaser": "^3.80.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "vite": "^5.2.0",
    "vitest": "^1.5.0",
    "@types/node": "^20.0.0"
  }
}
```

> `@types/phaser` は不要（Phaser 3.60+ はパッケージ内に型定義を同梱）

---

## TypeScript 設定（tsconfig.json）

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "lib": ["ES2020", "DOM"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Phaser ゲーム初期化（main.ts）

```typescript
import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  backgroundColor: '#1a1a2e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 800 }, debug: false },
  },
  scene: [GameScene],  // Unit 2 完了後: [BootScene, MenuScene, GameScene, GameOverScene]
};

new Phaser.Game(config);
```

> Unit 1 単独での動作確認のため、起動シーンを GameScene に直接設定する。Unit 2 完了後に BootScene へ切り替える。

---

## Vite 設定（vite.config.ts）

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,   // LAN 上の iPhone Safari からアクセス可能にする
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
  },
});
```

---

## テスト設定（vitest）

`vite.config.ts` に追記：

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  // ... 上記設定に追加
  test: {
    environment: 'node',  // Phaser（DOM）を使わないテスト対象のみ
    include: ['tests/**/*.test.ts'],
  },
});
```

テスト実行コマンド:

```bash
npx vitest run        # 1回実行
npx vitest            # ウォッチモード
```

---

## ゲーム定数（GameConfig.ts）

```typescript
export const GameConfig = {
  GRAVITY: 800,
  INITIAL_JUMP_FORCE: -500,
  HOLD_JUMP_FORCE: -300,
  MAX_JUMP_HOLD_TIME: 300,    // ms
  INITIAL_GAME_SPEED: 200,    // px/s
  SCORE_MULTIPLIER: 0.1,
  OBSTACLE_POOL_SIZE: 20,
  POWERUP_POOL_SIZE: 5,
  HIGH_SCORE_KEY: 'endless_runner_high_score',

  DIFFICULTY_LEVELS: [
    { level: 1, distanceThreshold: 0,   gameSpeed: 200, obstacleInterval: 2000 },
    { level: 2, distanceThreshold: 200, gameSpeed: 280, obstacleInterval: 1600 },
    { level: 3, distanceThreshold: 500, gameSpeed: 360, obstacleInterval: 1300 },
    { level: 4, distanceThreshold: 900, gameSpeed: 440, obstacleInterval: 1000 },
    { level: 5, distanceThreshold: 1400, gameSpeed: 500, obstacleInterval: 800 },
  ],
} as const;
```

---

## IPersistenceService インターフェース（Unit 1 側の境界定義）

```typescript
export interface IPersistenceService {
  saveHighScore(score: number): void;
  loadHighScore(): number;
}
```

Unit 1 開発中のスタブ実装（テスト用）:

```typescript
export class InMemoryPersistenceService implements IPersistenceService {
  private score = 0;
  saveHighScore(score: number): void { this.score = score; }
  loadHighScore(): number { return this.score; }
}
```

---

## 開発コマンド

| コマンド | 内容 |
|---------|------|
| `npm install` | 依存パッケージのインストール |
| `npm run dev` | Vite 開発サーバー起動（localhost:5173） |
| `npm run build` | プロダクションビルド（dist/） |
| `npx vitest run` | ユニットテスト実行 |
