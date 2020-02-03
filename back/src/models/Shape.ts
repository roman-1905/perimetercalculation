import { Point } from './Point';
import { Segment } from './Segment';

export interface ShapeAttributes {
    sides: Segment[];
}

export class Shape implements ShapeAttributes {

    sides!: Segment[];

    constructor(sides?: Segment[]) {
        if (sides) {
            this.sides = sides;
        }
    }

    getSides(): Segment[] {
        return this.sides;
    }


}