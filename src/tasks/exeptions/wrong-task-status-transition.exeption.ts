export class WrongTaskStatusTransitionException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "WrongTaskStatusTransitionException";
    }
}