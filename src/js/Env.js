import BrutalDOMError from "./BrutalDOMError"

/**
 * Wrapper around which stage or environment the code is running in.  For example, this class will tell you
 * if you are running in test or production mode.
 */
class Env {
  /**
   * Create the Env
   *
   * @param {String} string - name of the env. Must be a known name.
   * @throw if string is not a known environment
   */
  constructor(string) {
    if ( (string === "dev") ||
         (string === "test") ||
         (string === "production") ) {
      this.string = string
    }
    else {
      throw new BrutalDOMError(`'${string}' is not a valid ENV`)
    }
  }

  /** @return true if we are running in the test environment */
  isTest()       { return this.string == "test" }
  /** @return true if we are running in the dev environment */
  isDev()        { return this.string == "dev" }
  /** @return true if we are running in the production environment */
  isProduction() { return this.string == "production" }

  toString() { return this.string }
}

export default Env

