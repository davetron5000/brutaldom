import Component    from "./Component"
import EventManager from "./EventManager"

/** Simple wrapper for a link that exposes an onClick event that preventsDefault. */
class Link extends Component {
  wasCreated() {
    this.clickEventManager = EventManager.createDirectProxyFor(this, { element: this.element, eventName: "click" })
  }
}
export default Link
