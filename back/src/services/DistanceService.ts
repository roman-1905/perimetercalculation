import { Point } from '../models/Point';
import LatLon from 'geodesy/latlon-spherical.js';
import inPairs from 'inpairs';

export type DistanceUnits = 'km' | 'm' | 'mi' | 'ft';

export class DistanceService {
    constructor() {
    }

    /**
     * Returns the distance between to points
     * @param pointA the origin point
     * @param pointB the destination point
     * @param unit the unit in which we want the distance to be returned ('km' | 'm' | 'mi' | 'ft')
     */
    calculateDistance(point1: Point, point2: Point, unit?: DistanceUnits): number {

        if (!point1 || !point2) return 0;

        let distance = 0;

        const p1 = new LatLon(point1.coordinates[0], point1.coordinates[1]);
        const p2 = new LatLon(point2.coordinates[0], point2.coordinates[1]);

        distance = p1.distanceTo(p2);

        if (unit) {           
            distance = this.formatToUnit(distance, unit);
        }

        return distance;


    }
    
    formatToUnit(distance: number, unit: DistanceUnits): number {

        switch (unit) {
            case "km": {
                distance = distance/1000;
                break;
            };
            case "ft": {
                distance = distance*3.281;
                break;
            };
            case "mi": {
                distance = distance/1609;
                break;
            }
        }

        return distance;

    }

    /**
     * Obtains the pairwise aggregated distance of the points passed in the parameter
     * @param points the array of points
     * @param unit the unit in which we want the distance to be returned ('km' | 'm' | 'mi' | 'ft')
     */
    aggregateDistance(points: Point[], unit?: DistanceUnits) {

        let totalDistance = 0;

        inPairs(points, (pointA: Point, pointB: Point) => {

            totalDistance += this.calculateDistance(pointA, pointB, unit);

        })

        // add the distance between the first and last elements

        totalDistance += this.calculateDistance(points[0], points[points.length], unit);        

        return totalDistance;

    }



}