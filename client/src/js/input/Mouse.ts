import {Game} from "../core/Game";
import {Vector} from "../util/Vector";

export class Mouse {

    public static init(): void {
        Mouse.position = new Vector(0, 0);
        Mouse.positionNext = new Vector(0, 0);

        Game.root.addEventListener("mousemove", (e: MouseEvent) => {
            Mouse.setNextMouseTo(e.pageX, e.pageY);
            this.start = true;
        });
    }

    public static update(): void {
        this.position = this.positionNext;
    }

    private static position: Vector;
    private static positionNext: Vector;
    private static start: boolean;

    public static get x(): number { return this.position.x; }
    public static get y(): number  { return this.position.y; }
    public static get pos(): Vector  { return this.positionNext; }
    public static get startedMoving(): boolean  { return this.start; }

    private static setNextMouseTo(pageX: number, pageY: number): void {
        const screen = Game.graphics.canvas.getBoundingClientRect();

        Mouse.positionNext = new Vector(
            pageX - screen.left - Game.root.scrollLeft,
            pageY - screen.top - Game.root.scrollTop,
        );
    }
}
