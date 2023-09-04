import WrapsElement from "./WrapsElement"
/**
 * A convienience for wrapping the body element.  This is handy as a starting point for locating
 * elements to wrap inside components.
 */
class Body extends WrapsElement {
  constructor() {
    super(document.body)
  }
}

export default Body
