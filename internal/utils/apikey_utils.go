package utils

import (
	"log/slog"
	"os"

	"github.com/joho/godotenv"
)

func LoadAPIKey() string {
	err := godotenv.Load()
	if err != nil {
		slog.Error("Error loading .env file", "error", err)
	}
	apiKey := os.Getenv("API_KEY")
	return apiKey
}
