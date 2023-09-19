import Component    from "./Component"
import EventManager from "./EventManager"

class RadioButton extends Component {
  wasCreated() {
    this.inputEventManager = EventManager.createDirectProxyFor(this, { element: this.element, eventName: "input" })
  }

  get value() { return this.element.value }
  set checked(val) { this.element.checked = val }
}

/** Wrapper around radio buttons that allows treating this like a select. Exposes onSelected that will
 * include the selected value, as transformed by valueTransform.  A selected setter allows setting the selected value.
 */
class RadioButtons {

  /**
   * @param {NodeList} elements - the radio button elements.
   * @param {RadioButtons~valueTransform} valueTransform - optional function to transform the value of the HTML element to a
   * richer type.
   */
  constructor(elements,valueTransform) {
    if (!valueTransform) {
      valueTransform = (x) => x
    }
    EventManager.defineEvents(this,"selected")

    this.radioButtons = Array.from(elements).map( (element) => {
      const radioButton = new RadioButton(element)
      radioButton.onInput( (event) => {
        if (event.target.checked) {
          this.selectedEventManager.fireEvent(valueTransform(event.target.value))
        }
      })
      return radioButton
    })
  }

  set selected(val) {
    this.radioButtons.forEach( (radioButton) => {
      if (radioButton.value == val) {
        radioButton.checked = true
      }
      else {
        radioButton.checked = false
      }
    })
  }
}
/**
 * Called to transform the radio button's value before the event manager is fired.
 * @callback RadioButton~valueTransform
 */
export default RadioButtons
