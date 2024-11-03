# Directory Structure
.
├── LICENSE
├── README.md
├── .env                        # API Key格納用 (.gitignoreに記載)
├── go.mod
├── go.sum
├── cmd/
│   └── server/                 # Backend server
│       └── main.go
├── docs/
│   ├── development-workflow.md # 開発ルール
│   └── directory-structure.md  # RepositoryのDirectory構造
├── api/
│   ├── swagger/                # Swagger UI
│   └── openapi.yaml            # SwaggerのOpen API仕様書
├── internal/
│   ├── handler/                # API エンドポイントのハンドラー
│   │   └── apod.go         
│   ├── client/                 # NASA APOD APIクライアント
│   │   └── apod_client.go  
│   └── utils/                  # ユーティリティ関数
│       └── apikey_utils.go     # API Key ロード
│       └── date_utils.go       # 日付関連のユーティリティ
└── public/
    ├── index.html
    └── js/
        └── script.js

# 参考
https://github.com/golang-standards/project-layout/blob/master/README_ja.md