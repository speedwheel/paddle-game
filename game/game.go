package game

import (
	"time"

	"github.com/rs/xid"
	"github.com/speedwheel/paddle-game/env"

	"github.com/kataras/neffos"
	"github.com/speedwheel/paddle-game/models"
)

var games []*Game

// Game holds the game information
type Game struct {
	ID              string
	Players         map[string]models.Paddle
	Sockets         map[string]*neffos.NSConn
	Ball            models.Ball
	LastUpdatedTime time.Time
}

// New returns an instance of a new game
func New() *Game {
	return &Game{
		ID:              xid.New().String(),
		Players:         make(map[string]models.Paddle, 2),
		Sockets:         make(map[string]*neffos.NSConn, 2),
		LastUpdatedTime: time.Now(),
		Ball: models.Ball{
			X: env.CanvasWidth / 2,
			Y: env.CanvasHeight / 2,
		},
	}
}

func SearchForGame() *Game {
	// if there are not opened games, create and return
	// a new game
	if len(games) <= 0 {
		return New()
	}

	// if there are opened games and one of them has only
	// 1 player, return that game
	for _, g := range games {
		if len(g.Sockets) == 1 {
			return g
		}
	}

	// if there are opened games but none of them have only
	// 1 player, then create and return a new game
	return New()
}

// AddPlayer adds a new player to the game
func (g *Game) AddPlayer(socket *neffos.NSConn, player models.Paddle) {
	g.Players[socket.Conn.ID()] = models.Paddle{}
	g.Sockets[socket.Conn.ID()] = socket
}
