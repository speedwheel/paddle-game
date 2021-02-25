package models

type Paddle struct {
	X      float64 `json:"x"`
	Y      float64 `json:"y"`
	Player int     `json:"player"`
	Width  float64 `json:"width,omitempty"`
	Height float64 `json:"height,omitempty"`
}
