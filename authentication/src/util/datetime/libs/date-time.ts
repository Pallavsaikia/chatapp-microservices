export class DateTime {
    static getDateTimeAheadInMilli(timeInMilli: number) {
        return new Date().getTime() + timeInMilli
    }
}