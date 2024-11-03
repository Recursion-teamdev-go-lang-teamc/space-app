package client

import (
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/url"
	"strconv"

	"github.com/Recursion-teamdev-go-lang-teamc/space-app/internal/utils"
)

const (
	ApodURL = "https://api.nasa.gov/planetary/apod"
)

var apiKey = utils.LoadAPIKey()

func FetchApodData(apodDate string, apodCount int) ([]byte, error) {

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

	nasaAPIURL, err := url.Parse(ApodURL)
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
