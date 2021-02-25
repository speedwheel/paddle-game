import * as neffos from "neffos.js";
import { IPaddle } from "../components/Paddle";
import { Game } from "./Game";

export class Networking {

    public static init() {
        Networking.events = new Map<string, neffos.MessageHandlerFunc>();
        Networking.events.set("_OnNamespaceConnected", (c: neffos.NSConn, msg: neffos.Message): Error => {
            if (c.conn.wasReconnected()) {
                Game.conn = c;
            }
            return null;
        });

        Networking.events.set("input", (c: neffos.NSConn, msg: neffos.Message): Error => {
            const playerInputs = JSON.parse(msg.Body);
                // console.log(playerInputs)
            for (const [key, p] of Object.entries(playerInputs)) {
                const paddle = p as IPaddle;
                if (key === c.conn.ID) {
                    const currentPlayer = playerInputs[c.conn.ID] as IPaddle;
                    if (currentPlayer.player === 1) {
                        Game.paddle.y = currentPlayer.y - Game.paddleHeight / 2;
                    } else if (paddle.player === 2) {
                        Game.paddle2.y = currentPlayer.y - Game.paddleHeight / 2;
                    }
                    // console.log(currentPlayer.y)
                } else {
                    if (paddle.player === 1) {
                        Game.paddle.y = paddle.y - Game.paddleHeight / 2;
                    } else if (paddle.player === 2) {
                        Game.paddle2.y = paddle.y - Game.paddleHeight / 2;
                    }
                }
            }
            return null;
        });
    }

    public static async connect(): Promise<neffos.NSConn> {
        const conn = await neffos.dial(Networking.wsURL, { default: Networking.events }, {
            reconnect: 5000,
        });
        return conn.connect("default");
    }

    private static scheme: string = document.location.protocol === "https:" ? "wss" : "ws";
    private static port: string = ":8081";
    private static wsURL: string = Networking.scheme + "://" + document.location.hostname + Networking.port;
    private static events: neffos.Events;
}
