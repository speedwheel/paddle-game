package ws

import (
	"net/http"

	"github.com/kataras/golog"
	"github.com/kataras/neffos"
	"github.com/kataras/neffos/gobwas"
)

type connHandler struct {
	Server *neffos.Server
}

func New() *connHandler {
	namespace := make(neffos.Namespaces)
	return &connHandler{
		Server: neffos.New(gobwas.DefaultUpgrader, namespace),
	}
}

func (h *connHandler) GetNamespaces() neffos.Namespaces {
	h.Server.OnConnect = h.onConnect
	h.Server.OnDisconnect = h.onDisconnect
	h.Server.OnUpgradeError = func(err error) {
		golog.Error(err)
	}
	h.Server.IDGenerator = func(w http.ResponseWriter, r *http.Request) string {
		if userID := r.Header.Get("X-Username"); userID != "" {
			return userID
		}

		return neffos.DefaultIDGenerator(w, r)
	}

	return neffos.Namespaces{
		"default": neffos.Events{
			neffos.OnNamespaceConnected:  h.onNamespaceConnected,
			neffos.OnNamespaceDisconnect: h.onNamespaceDisconnect,
			neffos.OnRoomJoined:          h.onRoomJoined,
		},
	}
}

func (h *connHandler) onConnect(c *neffos.Conn) error {
	return nil
}

func (h *connHandler) onDisconnect(c *neffos.Conn) {}

func (h *connHandler) onNamespaceConnected(ns *neffos.NSConn, msg neffos.Message) error {
	return nil
}

func (h *connHandler) onNamespaceDisconnect(ns *neffos.NSConn, msg neffos.Message) error {
	return nil
}

func (h *connHandler) onRoomJoined(ns *neffos.NSConn, msg neffos.Message) error {
	return nil
}
