import Component from "../Component"
import EventManager from "../EventManager"

class Button extends Component {
  constructor(element) {
    super(element)
    this.onClickEventManager = EventManager.createDirectProxyFor(
      this,
      {
        element: this.element,
        eventName: "click"
      }
    )
  }
}
export default Button
