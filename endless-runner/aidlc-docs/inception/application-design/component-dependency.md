# Application Design: Component Dependencies

## 依存関係マップ

```
GameConfig ◄─────────────────── AudioManager
               (定数参照)              │
                                       │ init() / load/save volume
                                       ▼
StorageService ◄────────────── AudioManager
               (音量読み書き)

Phaser.Sound.BaseSoundManager ◄── AudioManager
               (実際の音声再生)

AudioManager ◄──── BootScene      (init)
AudioManager ◄──── MenuScene      (playBGM, setBgmVolume, setSfxVolume)
AudioManager ◄──── GameScene      (playBGM, playSFX, onPause, onResume)
AudioManager ◄──── GameOverScene  (stopBGM, playSFX)
```

## 依存方向の原則

- **各シーン → AudioManager**: シーンは AudioManager の public メソッドのみ呼ぶ
- **AudioManager → StorageService**: 音量変更時のみ
- **AudioManager → GameConfig**: 定数参照のみ（循環依存なし）
- **シーン同士は直接依存しない**

## SFX 呼び出し一覧

| 呼び出し元 | メソッド | SFX キー |
|-----------|---------|---------|
| GameScene（Player.jump後） | playSFX | 'jump' |
| GameScene（Player.jump 2段後） | playSFX | 'double-jump' |
| GameScene（takeDamage後） | playSFX | 'hit' |
| GameScene（scoreItem取得後） | playSFX | 'coin' |
| GameScene（recover後） | playSFX | 'heal' |
| GameScene（powerUp取得後） | playSFX | 'powerup' |
| GameOverScene（create内） | playSFX | 'gameover' |

## データフロー（音量設定）

```
ユーザーがスライダー操作
  └── MenuScene の UI ハンドラ
        └── AudioManager.setBgmVolume(v)
              ├── Phaser SoundManager.volume = v  (即時反映)
              └── StorageService.saveBgmVolume(v) (永続化)

次回起動
  └── AudioManager.init(game)
        └── StorageService.loadBgmVolume()
              └── Phaser SoundManager に適用
```
