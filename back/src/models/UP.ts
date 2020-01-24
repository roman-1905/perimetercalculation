import { Point } from './Point';
import { Shape } from './Shape';

export interface UPAttributes {
    zone: Shape;
}

export class UP implements UPAttributes {

    zone!: Shape;

    constructor(edges?: Point[]) {
        if (edges) {
            this.zone = new Shape(edges);
        }
    }

    getEdges(): Shape {
        return this.zone;
    }


}