# Space App
本アプリケーションは、[NASA Open APIs](https://api.nasa.gov/)のAPOD (Astronomy Picture of the Day)を利用した天体写真ビューアです。バックエンドはGo言語で実装され、フロントエンドのデモアプリケーションではカレンダービューとギャラリービューを提供しています。

https://github.com/user-attachments/assets/2218264f-6f84-4693-953e-0319fd9fbe1b

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
3. プロジェクトルート直下に`.env`ファイルを作成し、ファイル内に以下を記述(your_api_keyを変更してください)
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

### アプリケーションコード
本プロジェクトは[MIT License](LICENSE)の下で公開されています

### NASA APIコンテンツ
本アプリケーションで表示される天体写真およびその説明文は、[NASA API](https://api.nasa.gov/)から取得しています
NASA APIのコンテンツは以下の条件で使用されています：

- NASA APIの利用規約に従い、すべての画像とデータはNASAに帰属します
- NASAは一般的に、そのイメージ、映像、オーディオファイルを教育または情報提供目的で使用することを推奨しています
- NASA APIから取得したコンテンツの使用にあたっては、以下のクレジット表記が必要です：
  > Image Credit: NASA

詳細なNASAのメディア使用ガイドラインは[NASA Media Usage Guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/)を参照してください

## 著者
- [stshf](https://github.com/stshf)
- [mumiso710](https://github.com/mumiso710)
- [5103246](https://github.com/5103246)

## 謝辞
- [NASA Open APIs](https://api.nasa.gov/)に感謝を申し上げる
