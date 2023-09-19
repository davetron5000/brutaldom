import Component    from "./Component"
import EventManager from "./EventManager"

/** Wraper for an `<input type="checkbox">` that exposes an onChecked and onUnchecked event managers as well
 * as a setter to set the checked value
 */
class Checkbox extends Component {
  wasCreated() {
    EventManager.defineEvents(this,"checked","unchecked")

    this.element.addEventListener("input", (event) => {
      if (event.target.checked) {
        this.checkedEventManager.fireEvent()
      }
      else {
        this.uncheckedEventManager.fireEvent()
      }
    })
  }

  set checked(val) {
    this.element.checked = String(val) == "true"
  }
}
export default Checkbox
