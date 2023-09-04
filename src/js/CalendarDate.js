import TypeOf from "./TypeOf"

/** Represents a date, not a timestamp, but since Date was taken, here we are.
 *  @property {Number} year  - The four digit year
 *  @property {Number} month - The month where 1 is January
 *  @property {Number} day   - The day of the month
 */
class CalendarDate {
  /** @return {CalendarDate} the date for today */
  static today() {
    return CalendarDate.daysAgo(0)
  }
  /** 
    * @param {Number} days the number of days ago
    * @return {CalendarDate} the date as of days days ago
    */
  static daysAgo(days) {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return new CalendarDate(date)
  }

  /** Factory method to create a CalendarDate safely, or return undefined if the value isn't defined.
   * @see constructor
   *
   * @return {CalendarDate|undefined} if undefined is passed, undefined is returned, otherwise the constructor is called.
   */
  static fromDateOrStringOrUndefined(dateOrString) {
    if (dateOrString) {
      return new CalendarDate(dateOrString)
    }
    else {
      return undefined
    }
  }

  /**
   * Create a CalendarDate based on either a string or a Date
   *
   * @param {Date|String} dateOrString - if a string, assumes it's in YYYY-MM-DD format and parses it into a Date.
   * @throws an error if dateOrString is not a string and not a date
   */
  constructor(dateOrString) {
    let date = dateOrString
    if ( TypeOf.asString(dateOrString) == "String" ) {
      const parts = dateOrString.split("-")
      if (parts.length != 3) {
        throw `CalendarDate requires a Date or String in the form YYYY-MM-DD, but got '${dateOrString}'`
      }
      date = new Date(parts[0], parts[1] - 1, parts[2])
    }
    if (!(date instanceof Date)) {
      throw `CalendarDate requires a Date, but got ${new TypeOf(date)} ('${date}')`
    }

    this.date  = date
    this.year  = date.getFullYear()
    this.month = date.getMonth() + 1
    this.day   = date.getDate()
    this.MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000

    this.string = `${this.year}-${this._zeroPad(this.month)}-${this._zeroPad(this.day)}`
  }

  /**
   * @returns true if the other calendar date is the same day as this one
   *
   * @param {CalendarDate} otherCalendarDate
   */
  isSameDayAs(otherCalendarDate) {
    if (!(otherCalendarDate instanceof CalendarDate)) {
      return false
    }
    return (this.year  === otherCalendarDate.year) &&
      (this.month === otherCalendarDate.month) &&
      (this.day   === otherCalendarDate.day)
  }

  /** 
   * @returns number of days between this CalendarDate and the passed-in one. Positive value
   * means that this date is after the passed one. This works
   * by converted both to UTC, then examining the difference in milliseconds.
   *
   * @param {CalendarDate} otherCalendarDate
   */
  daysDiff(otherCalendarDate) {

    const usUTC    = this.asUTC()
    const otherUTC = otherCalendarDate.asUTC()

    return ( otherUTC.date - usUTC.date) / this.MILLISECONDS_PER_DAY
  }

  /** @return true if this date is after the passed on.
   *
   * @param {CalendarDate} otherCalendarDate
   */
  isAfter(otherCalendarDate) {
    return this.daysDiff(otherCalendarDate) > 0
  }

  _zeroPad(number) {
    if (number > 9) {
      return `${number}`
    }
    else {
      return `0${number}`
    }
  }

  /** @return {String} the YYYY-MM-DD version of this date */
  toString()    { return this.string }

  /** @return {CalendarDate} in UTC */
  asUTC() {
    const inUTC = new Date(this.date);
    inUTC.setMinutes(inUTC.getMinutes() - inUTC.getTimezoneOffset());
    return new CalendarDate(inUTC);
  }
}
export default CalendarDate
