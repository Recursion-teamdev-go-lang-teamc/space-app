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
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

const (
	apodURL = "https://api.nasa.gov/planetary/apod"
	count   = 10
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

func apodsHandler(w http.ResponseWriter, r *http.Request) {

	apods := make([]Apod, count)

	date, err := getDateFromQuery(r)
	if err != nil {
		slog.Error("Date format error", "error", err)
		http.Error(w, "Bad Request", http.StatusBadRequest)
	}

	body, err := fetchApodData(date, count)
	if err != nil {
		slog.Error("Error fetching APOD data", "error", err)
		http.Error(w, "Servicee Unavailable", http.StatusServiceUnavailable)
	} else {
		slog.Info("Fetch APOD data")
	}

	if err := json.Unmarshal(body, &apods); err != nil {
		slog.Error("Unmarshal error", "error", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
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
	}

	body, err := fetchApodData(date, 0)
	if err != nil {
		slog.Error("Error fetching APOD data", "error", err)
		http.Error(w, "Bad Request", http.StatusServiceUnavailable)
	} else {
		slog.Info("Fetch APOD data")
	}

	if err := json.Unmarshal(body, &apod); err != nil {
		slog.Error("Unmarshal error", "error", err)
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

func fetchApodData(date string, count int) ([]byte, error) {

	var body []byte

	nasaAPIURL, err := buildApodURL(date, count)
	if err != nil {
		slog.Error("APOD URL build Error", "error", err)
		return body, err
	}

	fmt.Println(nasaAPIURL)

	res, err := http.Get(nasaAPIURL)
	if err != nil {
		return body, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return body, fmt.Errorf("NASA API returns non 200 status: %d", res.StatusCode)
	}

	body, err = io.ReadAll(res.Body)
	if err != nil {
		return body, err
	}

	return body, nil

}

func buildApodURL(date string, count int) (string, error) {

	nasaAPIURL, err := url.Parse(apodURL)
	if err != nil {
		return "", err
	}

	nasaAPIQuery := nasaAPIURL.Query()
	nasaAPIQuery.Set("api_key", apiKey)
	nasaAPIQuery.Set("date", date)
	if count != 0 {
		nasaAPIQuery.Set("count", strconv.Itoa(count))
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
