import {Game} from "../core/Game";
import {Vector} from "../util/Vector";
import {Component} from "./Component";

export class Ball extends Component {
    constructor(position?: Vector) {
        super();

        if (position) {
            this.position.copy(position);
        }
    }

    public render(): void {
        Game.graphics.circle(this.x, this.y, 10, 0, Math.PI * 2, true);
    }
}
