export type Coordinates = [number, number];

export interface PointAttributes {
    coordinates: Coordinates;
}

export class Point implements PointAttributes {
    public coordinates!: Coordinates;

    constructor(coordinates?:Coordinates) {
        if (coordinates) {
           this.coordinates = coordinates; 
        }        
    }

    getLatitude(): number {
        return this.coordinates[0];
    }

    getLongitude(): number {
        return this.coordinates[1]
    }


}
