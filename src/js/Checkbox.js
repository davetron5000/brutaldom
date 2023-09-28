import Component    from "./Component"
import EventManager from "./EventManager"

/** Wraper for an `<input type="checkbox">` that exposes an onChecked and onUnchecked event managers as well
 * as a setter to set the checked value
 *
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

  /** Write-only property to set the Checkbox as checked or not. */
  set checked(val) {
    this.element.checked = String(val) == "true"
  }
}
/**
 * @name onChecked
 * @function
 * @memberof Checkbox
 * @instance
 * @description Called when this checkbox is checked
 * @param {function} callback - function to call when this checkbox is checked
 */
/**
 * @name onUnchecked
 * @function
 * @memberof Checkbox
 * @instance
 * @description Called when this checkbox is unchecked
 * @param {function} callback - function to call when this checkbox is unchecked
 */
export default Checkbox
