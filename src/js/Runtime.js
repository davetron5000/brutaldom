import BrutalDOMBase from "./BrutalDOMBase"
import Env           from "./Env"

/**
 * Provides access to information about the runtime of the app.
 *
 * @see Env
 */
class Runtime extends BrutalDOMBase {
  /** @returns {Runtime} the only instance of this class */
  static instance() {
    if (!this._instance) {
      this._instance = new Runtime()
    }
    return this._instance
  }
  /** @returns {Env} the env you are running in */
  static env() {
    return this.instance().env
  }

  /**
   * Create the runtime.  This assumes that a global variable named `ENV` is defined somewhere and that it
   * has a value compatible with the Env class' constructor.
   *
   * If no such `ENV` variable exists, it will assuming it's running in the dev environment.
   *
   * @see Env
   */
  constructor() {
    super()
    if (typeof ENV !== "undefined") {
      this.env = new Env(ENV)
    }
    else {
      this.env = new Env("dev")
    }
    this.event("runtimeConfigured", { env: this.env.toString() })
  }
}

export default Runtime;
