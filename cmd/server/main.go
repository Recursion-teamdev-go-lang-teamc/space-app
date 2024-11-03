package main

import (
	"fmt"
	"net/http"

	"github.com/Recursion-teamdev-go-lang-teamc/space-app/internal/handlers"
)

func main() {

	fmt.Println("Starting Server...")

	http.HandleFunc("/api/apod", handlers.ApodHandler)
	http.HandleFunc("/api/apods/random", handlers.ApodsHandler)
	http.ListenAndServe(":8000", nil)
}
