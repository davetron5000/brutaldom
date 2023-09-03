import Component    from "../Component"
import ViewRegistry from "./ViewRegistry"

/*
 * Interface to indicate the entire view for a page.
 *
 * Each page is wrapped by a Component to allow the page to have logic and events.
 * That Component is an instance of `View` instead, to indicate the difference
 * in purpose.
 *
 * This class also manages the static ViewRegistry which the library uses to associate the
 * right view class with the page being displayed.
 */
class View extends Component {
  static viewRegistry = new ViewRegistry()

  /** Register a view's class.  Since JavaScript can't do dynamic 
   * import or class lookup really, we have to tell it all the views in our app.
   *
   * Example:
   *
   * import MyView from "./MyApp/MyView"
   *
   * View.registerView({ MyView })
   */
  static registerView(view) {
    this.viewRegistry.registerView(view)
  }

  render(...fromLayout) {
    this.methodStart("render")
    const whenDone = () => { this.methodDone("render") }
    const result = this.prepareView(...fromLayout)
    if (result instanceof Promise) {
      return result.finally(whenDone)
    }
    else {
      throw `Expected a Promise from ${this.constructor.name}#prepareView(). Got: ${result}`
    }
  }

  /** 
   * Subclasses should implement to do whatever is needed to get
   * the view to be rendered
   */
  prepareView(...fromLayout) {
    return Promise.resolve()
  }

}
export default View
