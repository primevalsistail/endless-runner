# NFR Requirements — Unit 2: ui-infrastructure

## Unit 1 から継承する NFR

Unit 1 の PERF・COMPAT・REL・MAINT 要件はすべて Unit 2 にも適用される。

---

## Unit 2 固有の追加 NFR

### デプロイ

| ID | 要件 | 基準値 |
|----|------|--------|
| DEPLOY-01 | GitHub Pages への自動デプロイ | main ブランチへの push で自動公開 |
| DEPLOY-02 | ビルド成果物 | `dist/` フォルダを GitHub Pages のルートとして公開 |
| DEPLOY-03 | 公開 URL | `https://<username>.github.io/<repo>/` でアクセス可能 |

### UI / シーン

| ID | 要件 | 基準値 |
|----|------|--------|
| UI-01 | シーン遷移 | タップ/クリックから 300ms 以内に遷移開始 |
| UI-02 | テキスト可読性 | 800×450 の論理解像度でスコア・ボタンが視認できるフォントサイズ |
| UI-03 | タッチ操作 | ボタンのヒットエリアは最小 44×44px（iOS HIG 準拠） |

## スコープ外

| 項目 | 理由 |
|------|------|
| アニメーション演出 | v1 スコープ外 |
| ローカライズ | v1 スコープ外（日本語固定） |
| PWA / Service Worker | v1 スコープ外 |
