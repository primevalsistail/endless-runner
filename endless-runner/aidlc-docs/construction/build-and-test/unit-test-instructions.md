# Unit Test Instructions: BGM & 効果音

## 自動テスト
音声システムはブラウザのWeb Audio APIに依存するため、Node.js環境での自動テストは対象外。

```bash
npm test
# → 既存テスト（GameConfig, ScoreManager等）のみ実行
```

## 手動ユニットテスト（AudioManager単体確認）

ブラウザのデベロッパーコンソールで実行：

### AudioManager の初期化確認
```javascript
// MenuScene が表示されている状態で実行
const audio = window.__phaserGame?.sound;
console.log(audio); // PhaserのSoundManagerが表示されれば OK
```

### 音量設定の永続化確認
1. MenuSceneの BGMスライダーを動かす
2. `localStorage.getItem('endless_runner_bgm_volume')` の値が変わることを確認
3. ページリロード後、スライダーが前回の位置に戻ることを確認

### SFX 有効/無効確認
1. ゲームプレイ中にジャンプ → `jump.ogg` が再生されること
2. ポーズ中にジャンプ（仮にできたとして）→ SFXが再生されないこと（sfxEnabled=false）
