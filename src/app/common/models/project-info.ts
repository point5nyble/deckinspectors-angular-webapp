export class ProjectInfo {
    title: string;
    date: string;
    address:string;
    assignedTo:string[];
    description!:string;
    imgUrl!:string;

    constructor(title: string, date: string, address:string, assignedTo:string[]) {
        this.title = title;
        this.date = date;
        this.address = address;
        this.assignedTo = assignedTo;
    }
} 