import Component    from "./Component"
import EventManager from "./EventManager"

/** Wrapper for a single `<SELECT>` element.  Provides an onInput event manager to retrieve
 * the value selected as well as a selected setter that will set the selected element.
 *
 * Note that this only works for single-selects.
 */
class Select extends Component {
  wasCreated() {
    EventManager.defineEvents(this,"selected")
    this.element.addEventListener("input", (event) => {
      event.preventDefault()
      this.selectedEventManager.fireEvent(event.target.value)
    })
  }

  /**
   * Write-only property to set the selected value of this select.  Should be given  the `value=` of the `<option>` to select.
   */
  set selected(val) {
    Array.from(this.element.options).forEach( (option) => {
      if (option.value == val) {
        option.selected = true
      }
      else {
        option.selected = false
      }
    })
  }
}
/**
 * @name onSelected
 * @function
 * @memberof Select
 * @instance
 * @description Called when a value is chosen from this select.
 * @param {function} callback - function to call when something is selected.  This will be given the `value=` of the `<option>`
 * that was selected.
 */
export default Select
