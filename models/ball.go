package models

type Ball struct {
	X      float64 `json:"x"`
	Y      float64 `json:"y"`
	Radius int     `json:"radius"`
	Speed  float64 `json:"speed"`
}
