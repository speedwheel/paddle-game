import {Game} from "../core/Game";

export default class Canvas {
    public draw() {
        Game.graphics.rect(0, 0, Game.width, Game.height, "black");
    }
}
