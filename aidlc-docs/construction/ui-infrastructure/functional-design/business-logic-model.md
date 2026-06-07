# Business Logic Model — Unit 2: ui-infrastructure

## シーン遷移フロー

```
BootScene
    │  create() 直後
    ▼
MenuScene
    │  startButton タップ / クリック
    ▼
GameScene（Unit 1）
    │  GameStateManager.endGame(score) → scene.start('GameOverScene', { score })
    ▼
GameOverScene
    │  retryButton → scene.start('GameScene')
    │  menuButton  → scene.start('MenuScene')
    ▼
  （ループ）
```

---

## MenuScene ロジック

1. `create()` で StorageService.loadHighScore() を呼び出し highScore を取得
2. タイトル・ハイスコア・スタートボタンを描画
3. startButton の pointerdown で `this.scene.start('GameScene')` を呼び出す

---

## GameOverScene ロジック

1. `init(data: { score: number })` でスコアを受け取る
2. `create()` で StorageService.loadHighScore() を呼び出し highScore を取得
3. スコア・ハイスコア・ボタンを描画
4. retryButton: `this.scene.start('GameScene')`
5. menuButton: `this.scene.start('MenuScene')`

---

## StorageService ロジック

```
saveHighScore(score):
    try:
        localStorage.setItem(HIGH_SCORE_KEY, String(score))
    catch:
        // 無視（プライベートブラウジング等でも動作継続）

loadHighScore():
    try:
        const raw = localStorage.getItem(HIGH_SCORE_KEY)
        return raw ? parseInt(raw, 10) : 0
    catch:
        return 0
```
