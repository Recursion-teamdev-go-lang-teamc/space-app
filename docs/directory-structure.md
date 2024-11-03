.
├── LICENSE
├── README.md
├── .env                    # API Key格納用 (.gitignoreに記載)
├── cmd/
│   ├── server/             # backend server
│   │   └── main.go
├── docs/
│   ├── development-workflow.md # 開発ルール
│   └── directory-structure.md   # RepositoryのDirectory構造
├── go.mod
├── go.sum
├── internal/
│   ├── handler/            # API エンドポイントのハンドラー
│   │   └── apod.go         
│   ├── client/             # NASA APOD APIクライアント
│   │   └── apod_client.go  
│   └── utils/              # ユーティリティ関数
│       └── apikey_utils.go # API Key ロード
│       └── date_utils.go   # 日付関連のユーティリティ
└── public/
    ├── index.html
    └── js/
        └── script.js