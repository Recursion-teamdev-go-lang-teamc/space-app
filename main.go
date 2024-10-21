package main

import (
	"encoding/json"
	"io"
	"log"
	"log/slog"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/joho/godotenv"
)

const apodURL = "https://api.nasa.gov/planetary/apod"

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

// TODO: write apods function
func apodsHandler(w http.ResponseWriter, r *http.Request) {

}

func apodHandler(w http.ResponseWriter, r *http.Request) {

	var apod Apod

	nasaAPIURL, err := url.Parse(apodURL)
	if err != nil {
		slog.Error("Parse Error", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}

	reqQuery := r.URL.Query()
	date := reqQuery.Get("date")
	if date != "" {
		date, err = convertDateFormat(date)
		if err != nil {
			slog.Error("Date format error", "error", err)
			http.Error(w, "Bad Request", http.StatusBadRequest)
		}
	}

	nasaAPIQuery := nasaAPIURL.Query()
	nasaAPIQuery.Set("api_key", apiKey)
	nasaAPIQuery.Set("date", date)

	nasaAPIURL.RawQuery = nasaAPIQuery.Encode()

	res, err := http.Get(nasaAPIURL.String())
	if err != nil {
		slog.Error("Requet Error", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		slog.Error("HTTP Error", "error", err)
		http.Error(w, "Service Unavailable", http.StatusServiceUnavailable)
	}

	body, _ := io.ReadAll(res.Body)

	if err := json.Unmarshal(body, &apod); err != nil {
		slog.Error("Json Unmarshal Error", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}

	response := map[string]Apod{
		"apod": apod,
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(response)
}

func convertDateFormat(prev string) (string, error) {
	prevLayout := "01/02/2006"
	t, err := time.Parse(prevLayout, prev)
	if err != nil {
		return "", err
	}
	formatted := t.Format("2006-01-02")
	return formatted, nil
}

func main() {
	http.HandleFunc("/api/apod", apodHandler)
	http.HandleFunc("/api/apods", apodsHandler)
	http.ListenAndServe(":8000", nil)
}
