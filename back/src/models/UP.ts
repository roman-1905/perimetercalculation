import { Point } from './Point';
import { Shape } from './Shape';
import { Segment } from './Segment';

export interface UPAttributes {
    zone: Shape;
}

export class UP implements UPAttributes {

    zone!: Shape;

    constructor(sides?: Segment[]) {
        if (sides) {
            this.zone = new Shape(sides);
        }
    }

    getEdges(): Shape {
        return this.zone;
    }


}