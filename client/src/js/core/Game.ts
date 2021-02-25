import * as neffos from "neffos.js";
import {Ball} from "../components/Ball";
import {Paddle} from "../components/Paddle";
import {Networking} from "../core/Networking";
import {Mouse} from "../input/Mouse";
import {Vector} from "../util/Vector";
import {Graphics} from "./Graphics";

export class Game {
    public static start(width: number, height: number) {
        Game.started = true;
        new Game();

        Game.instance.paddleHeight = Math.round(height / 4);
        Game.instance.paddleWidth = Math.round(Game.instance.paddleHeight / 15);

        // init
        Game.instance.root = document.body || document.getElementsByTagName("body")[0];
        Game.instance.graphics = new Graphics();
        Game.resize(width, height);
        Game.instance.ball = new Ball(new Vector(this.width / 2, this.height / 2));
        Game.instance.paddle = new Paddle(
            new Vector(Game.instance.paddleWidth, Game.instance.paddleHeight),
            new Vector(Game.instance.paddleGap, this.height / 2 - Game.instance.paddleHeight / 2),
        );
        Game.instance.paddle2 = new Paddle(
            new Vector(Game.instance.paddleWidth, Game.instance.paddleHeight),
            new Vector(Game.instance.width - Game.instance.paddleGap - Game.instance.paddleWidth, this.height / 2 - Game.instance.paddleHeight / 2),
        );

        Mouse.init();

        // networking
        Networking.init();
        // (async () => {Game.instance.nsConn = await Networking.connect(); } )();
        Networking.connect().then((conn) => {
            Game.instance.nsConn = conn;
            // start update loop
            Game.instance.step();
        });
    }

    public static resize(width: number, height: number): void {
        Game.instance.width = width;
        Game.instance.height = height;
        Game.instance.graphics.resize();
    }

    public static get width(): number { return Game.instance.width; }
    public static get height(): number { return Game.instance.height; }
    public static get root(): HTMLElement { return Game.instance.root; }
    public static get graphics(): Graphics { return Game.instance.graphics; }

    public static get paddleHeight(): number { return Game.instance.paddleHeight; }
    public static get paddleWidth(): number { return Game.instance.paddleWidth; }

    public static get paddle(): Paddle { return Game.instance.paddle; }
    public static get paddle2(): Paddle { return Game.instance.paddle2; }
    public static get conn(): neffos.NSConn { return Game.instance.nsConn; }
    public static set conn(val: neffos.NSConn) { Game.instance.nsConn = val; }

    private static instance: Game = null;
    private static started: boolean = false;
    private static exiting: boolean = false;
    public ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    private dt: number;
    private elapsed: number;
    private startTime: number;
    private lastTime: number;
    private root: HTMLElement = null;
    private graphics: Graphics;
    private nsConn: neffos.NSConn;
    private ball: Ball;
    private paddle: Paddle;
    private paddle2: Paddle;
    private paddleHeight: number;
    private paddleWidth: number;
    private paddleGap: number = 15;

    constructor() {
        if (Game.instance != null) {
            throw Error("Game has already been instantiated");
        }
        if (!Game.start) {
            throw Error("Game must be instantiated through static Game.start");
        }

        Game.instance = this;
        this.startTime = Date.now();
    }

    public step(): void {
        // time management!
        const time = Date.now();
        this.elapsed = Math.floor(time - this.startTime) / 1000;
        this.dt = Math.floor(time - this.lastTime) / 1000;
        this.lastTime = time;

        // update inputs
        Mouse.update();

        // update positions
        if (Mouse.startedMoving) {
            Game.instance.nsConn.emit("input", JSON.stringify(Mouse.pos));
        }

        // render
        this.graphics.clear();
        this.ball.render();
        this.paddle.render();
        this.paddle2.render();

        if (!Game.exiting) {
            requestAnimationFrame(this.step.bind(this));
        }
    }

    private exit(): void {
        Game.exiting = true;
    }
}
