import Log from "./Log"

/**
 * One base class to rule them all. This was created to automatically add
 * the log mixin to all lib classes where relevant plus set the log context appropriately.
 *
 * @mixes Log
 */
class BrutalDOMBase {
  static logContext = "brutaldom"
  constructor() {
    Log.mixin(this.constructor)
  }
}
export default BrutalDOMBase
