export interface Unit {
    ID: number;
    Active: boolean;
    DateAdded: string;
    SensorTypeID: number;
    LocationID: number;
    LocationName: string;
    SensorTypeName: string;
}

export interface UnitResponse {
    success: boolean;
    data: Unit[];
}
