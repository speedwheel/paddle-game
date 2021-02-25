import {Game} from "./Game";

export class Graphics {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;

    constructor() {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");
    }

    public resize(): void {
        this.canvas.width = Game.width;
        this.canvas.height = Game.height;
    }

    public rect(x: number, y: number, w: number, h: number, color: string): void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);
    }

    public circle(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
        this.ctx.fillStyle = "red";
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
        this.ctx.fill();
    }

    public clear(): void {
        this.ctx.clearRect(0, 0, Game.width, Game.height);
    }
}
