# Build Instructions: BGM & 効果音

## Prerequisites
- **Node.js**: 18以上
- **npm**: 9以上
- **音声ファイル**: `public/audio/` に配置済み（`README.md` 参照）

## Build Steps

### 1. Install Dependencies
```bash
cd endless-runner
npm install
```

### 2. Build（本番）
```bash
npm run build
```
- **期待出力**: `dist/` に `index.html` と `assets/index-*.js` が生成される
- `✓ built in X.XXs` が表示されれば成功

### 3. Dev Server（開発・確認用）
```bash
npm run dev
```
- `http://localhost:5173/endless-runner/` でアクセス

## 音声ファイルが未配置の場合

音声ファイルなしでもゲームは起動するが、コンソールに `404` エラーが出る。  
エラーは無視してゲームプレイには影響しない（SFX再生時に silent になる）。

音声ファイルを配置後は **ページリロード** で反映される（Vite のhot reloadは音声ファイルを自動的に更新しない）。
