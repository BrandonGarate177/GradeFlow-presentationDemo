package main

import (
    "fmt"
    "log"
    "net/http"
    "os"

    "github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/config"
    httpinternal "github.com/BrandonGarate177/GradeFlow-presentationDemo/backend/internal/http"
)

func main() {
    cfg := config.Load()

    // Ensure public/audio exists
    if err := os.MkdirAll("public/audio", 0755); err != nil {
        log.Fatalf("failed to create public/audio: %v", err)
    }

    mux := http.NewServeMux()
    httpinternal.RegisterRoutes(mux, cfg)

    addr := fmt.Sprintf("%s:%s", cfg.Host, cfg.Port)
    log.Printf("starting server at %s", addr)
    if err := http.ListenAndServe(addr, mux); err != nil {
        log.Fatalf("server failed: %v", err)
    }
}