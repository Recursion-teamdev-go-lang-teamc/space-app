# space-app
本リポジトリは、[Nasa API](https://api.nasa.gov/)よりAPOD:Astrinomy Picture of the Dayを取得するbackendと、
その使用例となるdemo appを実装したものである。

=== ToDo デモ動画を載せる ===

# 使用方法

### Nasa APIよりAPI Keyの取得
- https://api.nasa.gov/にて、API Keyを取得
![image](https://github.com/user-attachments/assets/11eb69ed-142d-4bfa-abc5-e2357d28f972)

- `./space-app`ディレクトリ直下に`.env`を作成し、API Keyを記述
```
API_KEY=your_api_key
```

### HTTP Server立ち上げ
```go
go run main.go
```

### demo App立ち上げ
`index.html`をブラウザで開く

# Frontend: Demo App

# Backend: Swagger API Document
https://recursion-teamdev-go-lang-teamc.github.io/space-app/swagger/

# 
