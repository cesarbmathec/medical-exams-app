package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

type GenericResponse struct {
	Status  string      `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

// GenericRequest es el puente universal para todas tus peticiones API
// GenericRequest es el puente universal para todas tus peticiones API
func (a *App) GenericRequest(method string, endpoint string, body interface{}, token string) (*GenericResponse, error) {
	apiUrl := "http://127.0.0.1:8080/api/v1" + endpoint

	var req *http.Request
	var err error

	// 1. Preparación de la petición
	if body != nil && method != "GET" {
		jsonBody, _ := json.Marshal(body)
		req, err = http.NewRequest(method, apiUrl, bytes.NewBuffer(jsonBody))
	} else {
		req, err = http.NewRequest(method, apiUrl, nil)
	}

	if err != nil {
		return nil, fmt.Errorf("error creando petición: %w", err)
	}

	// 2. Configuración de Headers y Token
	req.Header.Set("Content-Type", "application/json")
	if token != "" && token != "null" {
		req.Header.Set("Authorization", "Bearer "+token)
	}

	// 3. Ejecución de la petición
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error de red: %v", err)
	}
	defer resp.Body.Close()

	// 4. Manejo de errores del Servidor (401, 403, 404, 500, etc.)
	if resp.StatusCode != http.StatusOK {
		// Intentamos leer el mensaje de error del servidor si existe
		var errorRes GenericResponse
		json.NewDecoder(resp.Body).Decode(&errorRes)

		if errorRes.Message != "" {
			return nil, fmt.Errorf("error %d: %s", resp.StatusCode, errorRes.Message)
		}
		return nil, fmt.Errorf("el servidor respondió con código: %d", resp.StatusCode)
	}

	// 5. Decodificación de la respuesta exitosa
	var result GenericResponse
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		return nil, fmt.Errorf("error decodificando respuesta JSON: %v", err)
	}

	return &result, nil
}
