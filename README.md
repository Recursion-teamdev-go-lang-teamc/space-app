# Space App
本アプリケーションは、[NASA Open APIs](https://api.nasa.gov/)のAPOD (Astronomy Picture of the Day)を利用した天体写真ビューアです。バックエンドはGo言語で実装され、フロントエンドのデモアプリケーションではカレンダービューとギャラリービューを提供しています。

=== ToDo: デモ動画を載せる ===

## 特徴
- 日付指定での天体写真表示
- ランダムな天体写真のギャラリービュー
- 軽量で高速なGo言語バックエンド

## 技術スタック
### フロントエンド
- HTML5
- Tailwind CSS
- JavaScript

### バックエンド
- Go 1.23.2

## セットアップ手順

### 1. 前提条件
- モダンなWebブラウザ（Chrome, Firefox, Safari等）
- NASA APIのAPI Key

### 2. NASA APIキーの取得
1. [NASA API Portal](https://api.nasa.gov/)にアクセス
2. フォームに必要情報を入力してAPI Keyを取得
3. プロジェクトルート直下に`.env`ファイルを作成し、以下を記述:
```bash
API_KEY=your_api_key
```

### 3. アプリケーションの起動
#### バックエンドサーバーの起動
```bash
go run main.go
```
デフォルトでは`localhost:8000`で起動します。

#### フロントエンドの表示
`index.html`をWebブラウザで開いてください。

## 機能説明

### Date View（カレンダービュー）
- 指定した日付のAPODを表示
- 写真の詳細説明を確認可能

### List View（ギャラリービュー）
- ランダムに選ばれた8つのAPODをグリッド表示
- 写真をクリックで詳細表示
- 新しいセットの読み込みが可能

## API ドキュメント
バックエンドAPIの詳細な仕様は[Swagger UI](https://recursion-teamdev-go-lang-teamc.github.io/space-app/swagger/)で確認できます。

## ライセンス
[ライセンス情報を記載]

## 貢献について
[コントリビューションガイドラインを記載]

## 著者
[作者情報を記載]

## 謝辞
- [NASA Open APIs](https://api.nasa.gov/)に感謝を申し上げる
