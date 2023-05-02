export class DateTime {
    static getDateTimeAheadInMilli(timeInMilli: number) {
        return new Date().getTime() + timeInMilli
    }
    static getDateTimeInMilli() {
        return new Date().getTime()
    }
    static getSecondsRemaining(timeAhead: number, timeNow: number) {
        const remainingTime = timeAhead - timeNow
        return (remainingTime / 1000)
    }
}