package main

import (
	"encoding/json"
	"fmt"
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

	date, err := getDateFromQuery(r)
	if err != nil {
		slog.Error("Date format error", "error", err)
		http.Error(w, "Bad Request", http.StatusBadRequest)
	}

	fmt.Println("test")

	apod, err := fetchApodData(date)
	if err != nil {
		slog.Error("Error fetching APOD data", "error", err)
		http.Error(w, "Bad Request", http.StatusServiceUnavailable)
	}

	response := map[string]Apod{
		"apod": apod,
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	json.NewEncoder(w).Encode(response)
}

func getDateFromQuery(r *http.Request) (string, error) {
	reqQuery := r.URL.Query()
	date := reqQuery.Get("date")
	if date != "" {
		return convertDateFormat(date)
	}
	return "", nil
}

func fetchApodData(date string) (Apod, error) {

	var apod Apod

	nasaAPIURL, err := buildApodURL(date)
	if err != nil {
		return apod, err
	}

	res, err := http.Get(nasaAPIURL)
	if err != nil {
		return apod, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return apod, fmt.Errorf("NASA API returns non 200 status: %d", res.StatusCode)
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return apod, err
	}

	if err := json.Unmarshal(body, &apod); err != nil {
		return apod, err
	}
	return apod, nil
}

func buildApodURL(date string) (string, error) {

	nasaAPIURL, err := url.Parse(apodURL)
	if err != nil {
		return "", err
	}

	nasaAPIQuery := nasaAPIURL.Query()
	nasaAPIQuery.Set("api_key", apiKey)
	nasaAPIQuery.Set("date", date)

	nasaAPIURL.RawQuery = nasaAPIQuery.Encode()

	return nasaAPIURL.String(), nil

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
