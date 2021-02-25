import {Vector} from "../util/Vector";

export abstract class Component {

    public position: Vector = new Vector(0, 0);
    // public size: Vector = new Vector(0, 0);
    public get x(): number { return this.position.x; }
    public set x(val: number) { this.position.x = val; }
    public get y(): number { return this.position.y; }
    public set y(val: number) { this.position.y = val; }
    public abstract render(position: Vector): void;
}
