import Component    from "./Component"
import EventManager from "./EventManager"

/** Simple wrapper for a link that exposes an `onClick` event that prevents the links default behavior. 
 *
 * @see Button
 */
class Link extends Component {
  wasCreated() {
    this.clickEventManager = EventManager.createDirectProxyFor(this, { element: this.element, eventName: "click" })
  }
}
/**
 * @name onClick
 * @function
 * @memberof Link
 * @instance
 * @description Called when this link is clicked
 * @param {function} callback - function to call when this link is clicked
 */
export default Link
