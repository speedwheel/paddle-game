export class Vector {
    public x: number = 0;
    public y: number = 0;

    constructor(x ?: number, y ?: number) {
        if (x !== undefined) {
            this.x = x;
        }

        if (y !== undefined) {
            this.y = y;
        }
    }

    public set(x: number, y: number): Vector {
        this.x = x;
        this.y = y;
        return this;
    }

    public copy(v: Vector): Vector {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    public add(v: Vector): Vector {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    public sub(v: Vector): Vector {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    public mult(v: Vector): Vector {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }

    public div(v: Vector): Vector {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    }

    public scale(s: number): Vector {
        this.x *= s;
        this.y *= s;
        return this;
    }

    public clone(): Vector {
        return new Vector(this.x, this.y);
    }

    public get length(): number {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    public get angle(): number {
        return Math.atan2(this.y, this.x);
    }

    public get normal(): Vector {
        const dist = this.length;
        return new Vector(this.x / dist, this.y / dist);
    }

    public normalize(length: number = 1): Vector {
        const dist = this.length;
        this.x = (this.x / dist) * length;
        this.y = (this.y / dist) * length;
        return this;
    }
}
