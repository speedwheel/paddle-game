import {Game} from "../core/Game";
import {Vector} from "../util/Vector";
import {Component} from "./Component";

export interface IPaddle {
    x: number;
    y: number;
    player: number;
}

export class Paddle extends Component {
    public size: Vector = new Vector(0, 0);

    public get width(): number { return this.size.x; }
    public set width(val: number) { this.size.x = val; }
    public get height(): number { return this.size.y; }
    public set height(val: number) { this.size.y = val; }

    constructor(size: Vector, position?: Vector) {
        super();

        this.size.copy(size);

        if (position) {
            this.position.copy(position);
        }
    }

    public render(): void {
        Game.graphics.rect(this.x, this.y, this.width, this.height, "white");
    }
}
