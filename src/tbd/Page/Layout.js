import BrutalJSBase   from "../BrutalJSBase"
import LayoutRegistry from "./LayoutRegistry"

/*
 * Base class for layouts, which represent the common code in which a view is displayed.
 * The layout could minimally just be the `<head>` and `<body>`, however it could have navs
 * or other persistent UI elements.
 *
 * Like views, layouts must be registered so that the library can associate the HTML with
 * the correct Layout class.
 */
class Layout extends BrutalJSBase {
  static layoutRegistry = new LayoutRegistry()

  /** Register a layout's class.  Since JavaScript can't do dynamic 
   * import or class lookup really, we have to tell it all the layouts in our app.
   *
   * Example:
   *
   * import MyLayout from "./MyApp/MyLayout"
   *
   * Layout.registerLayout({ MyLayout })
   */
  static registerLayout(layout) {
    this.layoutRegistry.registerLayout(layout)
  }

  constructor(window) {
    super()
    this.window   = window
    this.document = window.document
  }

  layout() {
    this.methodStart("layout")
    const whenDone = () => { this.methodDone("layout") }
    const result = this.prepareLayout()
    if (result instanceof Promise) {
      return result.finally(whenDone)
    }
    else {
      throw `Expected a Promise from ${this.constructor.name}#prepareLayout(). Got: ${result}`
    }
  }

  /** Subclasses should implement this to do whatever logic and execution
   * is needed to prepare the layout for the view to be rendered
   */
  prepareLayout() {
    return Promise.resolve()
  }
}

export default Layout
