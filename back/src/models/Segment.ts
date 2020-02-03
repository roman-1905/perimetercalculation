import { Point } from './Point';

export interface SegmentAttributes {
    edges: [Point, Point];
}

export class Segment implements SegmentAttributes {
    public edges!: [Point, Point];

    constructor(coordinates?:[Point, Point]) {
        if (coordinates) {
           this.edges = coordinates; 
        }        
    }

    getFirstPoint(): Point {
        return this.edges[0];
    }

    getSecondPoint(): Point {
        return this.edges[1];
    }

}
