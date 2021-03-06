
export enum States {
    MENU,
    GAME,
    SCORE,
    EDITOR
}

export class StateManager {

    public activeState: States;

    constructor(initialState: States = States.GAME) {
        this.activeState = initialState;
    }

    public switchTo(state: States): void {
        this.activeState = state;
    }

}