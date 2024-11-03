package utils

import (
	"net/http"
	"time"
)

func GetDateFromQuery(r *http.Request) (string, error) {
	reqQuery := r.URL.Query()
	date := reqQuery.Get("date")
	if date != "" {
		return ConvertDateFormat(date)
	}
	return "", nil
}

func ConvertDateFormat(prev string) (string, error) {
	prevLayout := "01/02/2006"
	t, err := time.Parse(prevLayout, prev)
	if err != nil {
		return "", err
	}
	formatted := t.Format("2006-01-02")
	return formatted, nil
}
