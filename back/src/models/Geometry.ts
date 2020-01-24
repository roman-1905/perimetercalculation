export type Coordinates = [{lat: number}, {long: number}];

export interface Point {
  type: 'Point';
  coordinates: Coordinates;
}

export interface Polygon {
  type: 'Polygon';
  coordinates: [Coordinates[]];
}
