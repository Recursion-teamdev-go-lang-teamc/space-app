package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

const (
	apodURL          = "https://api.nasa.gov/planetary/apod"
	defaultApodCount = 10
)

var apiKey = loadAPIKey()

type Apod struct {
	CopyRight      string `json:"copyright"`
	Date           string `json:"date"`
	Explanation    string `json:"explanation"`
	Hdurl          string `json:"hdurl"`
	MediaType      string `json:"media_type"`
	ServiceVersion string `json:"service_version"`
	Title          string `json:"title"`
	Url            string `json:"url"`
}

func loadAPIKey() string {
	err := godotenv.Load()
	if err != nil {
		slog.Error("Error loading .env file", "error", err)
	}
	apiKey := os.Getenv("API_KEY")
	return apiKey
}

func apodsHandler(w http.ResponseWriter, r *http.Request) {

	apods := make([]Apod, defaultApodCount)

	date, err := getDateFromQuery(r)
	if err != nil {
		slog.Error("Date format error", "error", err)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	body, err := fetchApodData(date, defaultApodCount)
	if err != nil {
		slog.Error("Error fetching APOD data", "error", err)
		http.Error(w, "Service Unavailable", http.StatusServiceUnavailable)
		return
	} else {
		slog.Info("Fetch APOD data")
	}

	if err := json.Unmarshal(body, &apods); err != nil {
		slog.Error("Unmarshal error", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	response := map[string][]Apod{
		"apods": apods,
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	json.NewEncoder(w).Encode(response)

}

func apodHandler(w http.ResponseWriter, r *http.Request) {

	var apod Apod

	date, err := getDateFromQuery(r)
	if err != nil {
		slog.Error("Date format error", "error", err)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	body, err := fetchApodData(date, 0)
	if err != nil {
		slog.Error("Error fetching APOD data", "error", err)
		http.Error(w, "Service Unavailable", http.StatusServiceUnavailable)
		return
	} else {
		slog.Info("Fetch APOD data")
	}

	if err := json.Unmarshal(body, &apod); err != nil {
		slog.Error("Unmarshal error", "error", err)
		return
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

func fetchApodData(apodDate string, apodCount int) ([]byte, error) {

	nasaAPIURL, err := buildApodURL(apodDate, apodCount)
	if err != nil {
		slog.Error("Failed to build APOD URL", "error", err)
		return nil, err
	}

	res, err := http.Get(nasaAPIURL)
	if err != nil {
		slog.Error("Failed to fetch APOD data", "error", err)
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		err := fmt.Errorf("NASA API returns non 200 status: %d", res.StatusCode)
		slog.Error("Failed to fetch APOD data", "error", err)
		return nil, err
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		slog.Error("Failed to read response body", "error", err)
		return body, err
	}

	return body, nil

}

func buildApodURL(apodDate string, apodCount int) (string, error) {

	nasaAPIURL, err := url.Parse(apodURL)
	if err != nil {
		return "", err
	}

	nasaAPIQuery := nasaAPIURL.Query()
	nasaAPIQuery.Set("api_key", apiKey)
	nasaAPIQuery.Set("date", apodDate)
	if apodCount != 0 {
		nasaAPIQuery.Set("count", strconv.Itoa(apodCount))
		nasaAPIQuery.Set("date", "")
	}

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
	http.HandleFunc("/api/apods/random", apodsHandler)
	http.ListenAndServe(":8000", nil)
}
