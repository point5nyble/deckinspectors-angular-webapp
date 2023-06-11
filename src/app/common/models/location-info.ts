export class LocationInfo {
    name!: string;
    createdOn!: string;
    createdBy!: string;
    assignedTo!: string;

    constructor(name: string, createdOn: string, createdBy: string, assignedTo: string) {
        this.name = name;
        this.createdOn = createdOn;
        this.createdBy = createdBy;
        this.assignedTo = assignedTo;
    }
}