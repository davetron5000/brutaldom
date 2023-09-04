/**
 * Wraps a string to return a humanized version, which is basically capitalizing it.
 */
class HumanizedString {
  /**
   * @param {String} string - string to humanize
   * @returns {HumanizedString} for the given string.
   */
  static for(string) { return new HumanizedString(string) }
  /**
   * Create a HumanizedString, coercing falsey values to the empty string
   *
   * @param {String} string - string to humanize. May be undefined.
   */
  constructor(string) {
    string = `${string || ""}` // Force string coercion
    this.string = string[0].toUpperCase() + string.slice(1)
  }

  /** @returns {String} the humanized string */
  toString() {
    return this.string
  }
}
export default HumanizedString
