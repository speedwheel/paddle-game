package env

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

var (
	// CanvasWidth the width of the canvas
	CanvasWidth float64
	// CanvasHeight the height of the canvas
	CanvasHeight float64
)

func parse() {
	var err error

	CanvasWidth, err = strconv.ParseFloat(os.Getenv("CANVAS_WIDTH"), 64)
	if err != nil {
		panic(fmt.Sprint("error, CANVAS_WIDTH must be integer"))
	}
	CanvasHeight, err = strconv.ParseFloat(os.Getenv("CANVAS_HEIGHT"), 64)
	if err != nil {
		panic(fmt.Sprint("error, CANVAS_HEIGHT must be integer"))
	}
}

func Load(envFileName string) {
	if args := os.Args; len(args) > 1 && args[1] == "help" {
		log.Print("https://github.com/netdata/netdata-ga/blob/master/README.md")
		os.Exit(-1)
	}

	log.Printf("Loading environment variables from file: %s\n", envFileName)
	envFiles := strings.Split(envFileName, ",")
	for i := range envFiles {
		if filepath.Ext(envFiles[i]) == "" {
			envFiles[i] += ".env"
		}
	}

	if err := godotenv.Load(envFiles...); err != nil {
		panic(fmt.Sprintf("error loading '%s' environment variables from file(s): %v", envFileName, err))
	}

	envMap, _ := godotenv.Read(envFiles...)
	for k, v := range envMap {
		log.Printf("◽ %s=%s\n", k, v)
	}

	parse()
}
