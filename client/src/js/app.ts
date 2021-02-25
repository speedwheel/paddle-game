declare var require: any;
import {Game} from "./core/Game";
require("../css/main.less");

class App {

    constructor() {
        this.init();
        Game.start(process.env.CANVAS_WIDTH, process.env.CANVAS_HEIGHT);
    }

    public init() {
        const wrapperSelector = document.querySelector(".wrapper") as HTMLElement;
        const menuSelector = document.querySelector("#menu") as HTMLElement;
        const playSelector = document.querySelector(".play") as HTMLElement;

        wrapperSelector.style.height = process.env.CANVAS_HEIGHT as unknown as string + "px";
        wrapperSelector.style.width = process.env.CANVAS_WIDTH as unknown as string + "px";

        playSelector.addEventListener("click", () => {
            menuSelector.style.display = "none";
        });
    }
}

window.onload = () => {
    new App();
};
