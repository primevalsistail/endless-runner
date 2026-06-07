# Business Rules — Unit 2: ui-infrastructure

## シーン遷移ルール

| ID | ルール |
|----|--------|
| SC-01 | BootScene は create() 直後に MenuScene へ遷移する |
| SC-02 | GameScene へは MenuScene の startButton からのみ遷移できる（直接 URL アクセス不可） |
| SC-03 | GameOverScene は GameScene の endGame() からのみ起動される |
| SC-04 | GameOverScene の retryButton は GameScene を新規スタートする（resume ではない） |

## ハイスコア表示ルール

| ID | ルール |
|----|--------|
| HS-01 | MenuScene と GameOverScene の両方でハイスコアを表示する |
| HS-02 | ハイスコア未設定時（初回起動）は "BEST: 0" と表示する |
| HS-03 | ハイスコアの更新は GameScene（ScoreManager）が行う。Unit 2 は読み取りのみ |

## StorageService ルール

| ID | ルール |
|----|--------|
| ST-01 | localStorage へのアクセスは必ず try/catch でラップする |
| ST-02 | 例外発生時（プライベートブラウジング等）はデフォルト値 0 を返し、ゲームを継続する |
| ST-03 | 保存キーは GameConfig.HIGH_SCORE_KEY を使用する（文字列リテラルを直接書かない） |
