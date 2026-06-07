# Infrastructure Design — Unit 2: ui-infrastructure

## 追加するファイル

```
endless-runner/
├── src/
│   ├── main.ts                  ← 更新: 全シーンを登録
│   ├── scenes/
│   │   ├── BootScene.ts         ← 新規
│   │   ├── MenuScene.ts         ← 新規
│   │   └── GameOverScene.ts     ← 新規
│   └── services/
│       └── StorageService.ts    ← 新規
├── .github/
│   └── workflows/
│       └── deploy.yml           ← 新規
└── vite.config.ts               ← 更新: base パス追加
```

---

## main.ts 更新（全シーン登録）

```typescript
scene: [BootScene, MenuScene, GameScene, GameOverScene],
```

起動シーンは BootScene → MenuScene → GameScene の順。

---

## vite.config.ts 更新（GitHub Pages 対応）

```typescript
base: '/endless-runner/',   // リポジトリ名に合わせる
```

ローカル開発時は `base: '/'` でも動作する。CI ビルド時のみ `base` が効く。

---

## GitHub Actions ワークフロー

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: endless-runner/package-lock.json
      - run: npm ci
        working-directory: endless-runner
      - run: npm run build
        working-directory: endless-runner
      - uses: actions/upload-pages-artifact@v3
        with:
          path: endless-runner/dist
      - uses: actions/deploy-pages@v4
        id: deployment
```
