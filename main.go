package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/kataras/neffos"
	"github.com/kataras/neffos/gobwas"
	"github.com/speedwheel/paddle-game/env"
	"github.com/speedwheel/paddle-game/models"
)

/*
	Read the README.md
*/

const (
	addr      = "localhost:8081"
	endpoint  = "/"
	namespace = "default"
)

var (
	players = make(map[string]models.Paddle)
	ball    = models.Ball{X: 1000 / 2, Y: 600 / 2, Radius: 10, Speed: 2}
	connsMu sync.RWMutex
)

// userMessage implements the `MessageBodyUnmarshaler` and `MessageBodyMarshaler`.
type userMessage struct {
	From string `json:"from"`
	Text string `json:"text"`
}

// Defaults to `DefaultUnmarshaler & DefaultMarshaler` that are calling the json.Unmarshal & json.Marshal respectfully
// if the instance's Marshal and Unmarshal methods are missing.
func (u *userMessage) Marshal() ([]byte, error) {
	return json.Marshal(u)
}

func (u *userMessage) Unmarshal(b []byte) error {
	return json.Unmarshal(b, u)
}

var serverAndClientEvents = neffos.Namespaces{
	namespace: neffos.Events{
		neffos.OnNamespaceConnected: func(c *neffos.NSConn, msg neffos.Message) error {
			log.Printf("[%s] connected to namespace [%s].", c, msg.Namespace)

			var roomPlayersCount int
			connections := c.Conn.Server().GetConnectionsByNamespace("default")
			fmt.Println(connections)
			var waitingPlayer string
			for _, conn := range connections {
				if conn.Room("battle") != nil {
					waitingPlayer = conn.String()
					fmt.Println(conn.String())
					roomPlayersCount++
				}
			}

			if roomPlayersCount == 0 {
				c.JoinRoom(nil, "battle")
				connsMu.Lock()
				players[c.String()] = models.Paddle{
					Player: 1,
				}
				connsMu.Unlock()
			} else if roomPlayersCount == 1 {
				var playerNumber = 2
				c.JoinRoom(nil, "battle")
				connsMu.Lock()
				if players[waitingPlayer].Player == 2 {
					playerNumber = 1
				}
				players[c.String()] = models.Paddle{
					Player: playerNumber,
				}
				connsMu.Unlock()
			}

			return nil
		},
		neffos.OnNamespaceDisconnect: func(c *neffos.NSConn, msg neffos.Message) error {
			log.Printf("[%s] disconnected from namespace [%s].", c, msg.Namespace)
			return nil
		},

		neffos.OnRoomJoined: func(c *neffos.NSConn, msg neffos.Message) error {
			text := fmt.Sprintf("[%s] joined to room [%s].", c, msg.Room)
			log.Printf("%s", text)

			c.Conn.Server().Broadcast(c, neffos.Message{
				Namespace: msg.Namespace,
				Room:      msg.Room,
				Event:     "notify",
				Body:      []byte(text),
			})

			return nil
		},
		neffos.OnRoomLeft: func(c *neffos.NSConn, msg neffos.Message) error {
			text := fmt.Sprintf("[%s] left from room [%s].", c, msg.Room)
			log.Printf("%s", text)

			connsMu.Lock()
			if len(players) <= 2 {
				delete(players, c.String())
			}

			connsMu.Unlock()

			return nil
		},

		"input": func(c *neffos.NSConn, msg neffos.Message) error {
			var input models.Paddle
			if err := msg.Unmarshal(&input); err != nil {
				return err
			}
			connsMu.Lock()
			if len(players) > 0 {
				if val, ok := players[c.String()]; ok {
					val.Y = input.Y
					players[c.String()] = val
				}
			}
			connsMu.Unlock()

			return nil
		},
		// client-side only event to catch any server messages comes from the custom "notify" event.
		"notify": func(c *neffos.NSConn, msg neffos.Message) error {
			if !c.Conn.IsClient() {
				return nil
			}

			fmt.Println(string(msg.Body))
			return nil
		},
	},
}

func main() {
	env.Load("")

	startServer()
}

func startServer() {
	server := neffos.New(gobwas.DefaultUpgrader, serverAndClientEvents)
	server.IDGenerator = func(w http.ResponseWriter, r *http.Request) string {
		if userID := r.Header.Get("X-Username"); userID != "" {
			return userID
		}

		return neffos.DefaultIDGenerator(w, r)
	}

	server.OnUpgradeError = func(err error) {
		log.Printf("ERROR: %v", err)
	}

	server.OnConnect = func(c *neffos.Conn) error {
		if c.WasReconnected() {
			log.Printf("[%s] connection is a result of a client-side re-connection, with tries: %d", c.ID(), c.ReconnectTries)
		}

		log.Printf("[%s] connected to the server.", c)

		// if returns non-nil error then it refuses the client to connect to the server.
		return nil
	}

	server.OnDisconnect = func(c *neffos.Conn) {
		log.Printf("[%s] disconnected from the server.", c)
	}

	log.Printf("Listening on: %s\nPress CTRL/CMD+C to interrupt.", addr)
	http.Handle(endpoint, server)
	go func() {
		log.Fatal(http.ListenAndServe(addr, nil))
	}()

	const N = 50
	ticker := time.NewTicker(time.Second / N)
	for range ticker.C {

		if len(players) <= 0 {
			continue
		}

		connsMu.RLock()
		paddleJSON, err := json.Marshal(players)
		connsMu.RUnlock()
		if err != nil {
			fmt.Println(err)
		}

		msg := neffos.Message{Namespace: namespace, Room: "battle", Event: "input", Body: []byte(string(paddleJSON))}
		server.Broadcast(nil, msg)
	}

}
