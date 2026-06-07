# NFR Design — Unit 2: ui-infrastructure

## DEPLOY-01/02/03: GitHub Pages 自動デプロイ

| 項目 | 設計方針 |
|------|---------|
| 方式 | GitHub Actions ワークフロー（`.github/workflows/deploy.yml`） |
| トリガー | `main` ブランチへの push |
| ビルドコマンド | `npm ci && npm run build` |
| 公開対象 | `dist/` フォルダ |
| ベースパス | `vite.config.ts` に `base: '/<repo-name>/'` を追加（GitHub Pages のサブパス対応） |

GitHub Actions ワークフロー概要:
```
on: push (main)
jobs:
  deploy:
    - checkout
    - setup node 20
    - npm ci
    - npm run build
    - upload dist/ → GitHub Pages
```

---

## UI-01: シーン遷移 300ms 以内

| 項目 | 設計方針 |
|------|---------|
| 実装 | `pointerdown` イベントで即座に `scene.start()` を呼び出す。遅延なし |
| BootScene | アセットロードなしのため `create()` → `scene.start('MenuScene')` が 1 フレーム以内に完了 |

---

## UI-02: テキスト可読性

| 要素 | フォントサイズ | 位置 |
|------|-------------|------|
| タイトル | 48px | 中央上部（y=150） |
| ハイスコア | 24px | 中央（y=240） |
| ボタンテキスト | 32px | 中央（y=320） |
| スコア（GameOver） | 36px | 中央（y=180） |
| ボタン間隔 | — | 60px 以上確保 |

---

## UI-03: タッチヒットエリア 44×44px 以上

| 項目 | 設計方針 |
|------|---------|
| 実装 | `setInteractive({ useHandCursor: true })` + `text.setInteractive(new Phaser.Geom.Rectangle(-100, -22, 200, 44), Phaser.Geom.Rectangle.Contains)` でヒットエリアを拡張 |

---

## StorageService エラー耐性

| 項目 | 設計方針 |
|------|---------|
| try/catch | 全 localStorage アクセスをラップ |
| フォールバック | 例外時は `0` を返し、ゲームを継続。ユーザーへのエラー表示なし |
