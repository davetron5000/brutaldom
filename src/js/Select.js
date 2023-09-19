import Component    from "./Component"
import EventManager from "./EventManager"

/** Wrapper for a single `<SELECT>` element.  Provides an onInput event manager to retrieve
 * the value selected as well as a selected setter that will set the selected element.
 */
class Select extends Component {
  wasCreated() {
    EventManager.defineEvents(this,"input")
    this.element.addEventListener("input", (event) => {
      event.preventDefault()
      this.inputEventManager.fireEvent(event.target.value)
    })
  }

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
export default Select
