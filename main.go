package main

import (
	"encoding/json"
	"io"
	"log"
	"log/slog"
	"net/http"
	"net/url"
	"os"

	"github.com/joho/godotenv"
)

var apiKey = loadAPIKEY()

type Apod struct {
	CopyRight       string `json:"copyright"`
	Date            string `json:"date"`
	Explanation     string `json:"explanation"`
	Hdurl           string `json:"hdurl"`
	Media_type      string `json:"media_type"`
	Service_version string `json:"service_version"`
	Title           string `json:"title"`
	Url             string `json:"url"`
}

func loadAPIKEY() string {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	apiKey := os.Getenv("API_KEY")
	return apiKey
}

func apodHandler(w http.ResponseWriter, r *http.Request) {

	var apod Apod

	u, err := url.Parse("https://api.nasa.gov/planetary/apod")
	if err != nil {
		slog.Error("Parse Error")
	}

	query := r.URL.Query()
	date := query.Get("date")

	q := u.Query()
	q.Set("api_key", apiKey)
	q.Set("date", date)

	u.RawQuery = q.Encode()

	res, err := http.Get(u.String())
	if err != nil {
		slog.Error("Requet Error")
	}
	defer res.Body.Close()

	if res.StatusCode != 200 {
		slog.Error("HTTP Error")
	}

	body, _ := io.ReadAll(res.Body)

	if err := json.Unmarshal(body, &apod); err != nil {
		slog.Error("Error")
	}

	response := map[string]Apod{
		"apod": apod,
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(response)
}

func main() {
	http.HandleFunc("/api/apod", apodHandler)
	http.ListenAndServe(":8000", nil)
}
