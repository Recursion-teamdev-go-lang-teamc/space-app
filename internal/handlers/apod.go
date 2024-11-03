package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"github.com/Recursion-teamdev-go-lang-teamc/space-app/internal/client"
	"github.com/Recursion-teamdev-go-lang-teamc/space-app/internal/utils"
)

const (
	DefaultApodCount = 8
)

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

func ApodsHandler(w http.ResponseWriter, r *http.Request) {

	apods := make([]Apod, DefaultApodCount)

	date, err := utils.GetDateFromQuery(r)
	if err != nil {
		slog.Error("Date format error", "error", err)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	body, err := client.FetchApodData(date, DefaultApodCount)
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

func ApodHandler(w http.ResponseWriter, r *http.Request) {

	var apod Apod

	date, err := utils.GetDateFromQuery(r)
	if err != nil {
		slog.Error("Date format error", "error", err)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	body, err := client.FetchApodData(date, 0)
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
