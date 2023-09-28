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
 *
 * Note that this is *not* and instance of `Component`, but instead a wrapper for radio buttons.  Each radio button
 * is wrapped in a `Component`, but if you want to treat a set of radio buttons as a component, you should create a class
 * for that, and have that class use this one internally.
 *
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

 /** 
   * Write-only setter that sets which radio button is selected. Should be given the `value=` of the radio button to select.
   * Will not fire the Event Manager.
   */
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
/**
 * @name onSelected
 * @function
 * @memberof RadioButtons
 * @instance
 * @description Called when a radio button is selected
 * @param {function} callback - function to call when this checkbox is unchecked, given the value of the radio button.
 */
export default RadioButtons
