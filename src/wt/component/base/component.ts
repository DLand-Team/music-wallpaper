export abstract class Component<T> {

    protected dom!: T;

    protected constructor() {
    }

    getDom(): T {
        return this.dom;
    }

}