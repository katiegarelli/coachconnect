import { Timestamp } from "rxjs/internal/operators/timestamp";

export interface Video {
    dateUploaded : any,
    reviewStatus : String,
    dateReviewed : Date,
    reviewer : string,
    outcome : string,
    comments : string,
    contentLocation : string,
    uploaderId: string,
    reviewerId: string,
    creditsCharged: number,
    opponent : string,
    weight : number,
    matchDate : Date,
    home : boolean,
    scoreW : number,
    scoreL : number,
    pin: boolean
};