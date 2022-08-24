import { IState } from "./StateMachine";

export default class EndingState implements IState {
    name: string;
    data: any;

    constructor() {
        this.name = "Ending";
    }

    onEnter() {
    }

    onExit() {
    }

    onUpdate(dt: number) {
    }
}
