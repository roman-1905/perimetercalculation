import { Point } from './Point';

export interface ShapeAttributes {
    edges: Point[];
}

export class Shape implements ShapeAttributes {

    edges!: Point[];

    constructor(edges?: Point[]) {
        if (edges) {
            this.edges = edges;
        }
    }

    getPoints(): Point[] {
        return this.edges;
    }


}