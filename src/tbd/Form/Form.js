import Component from "../Component"
import EventManager from "../EventManager"

/** 
 * HTML forms should inherit from this class, as it will handle validation and other things.
 *
 * To use this:
 *
 * 1. Create a subclass of FormObject.
 * 2. In your constructor, pass an instance of your FormObject to super. If you don't have
 *    the object available at that time, you can call connectFormObject(formObject) later.
 * 3. Handle submission of valid data. You can do this in two ways:
 *    1. call this.proxySubmit() in the constructor. This defines a "submit" event
 *       that others subscribe to. It will be called when the form is submitted and all validations
 *       are passing.  It'll be given a formObject instance described in the next step.
 *    2. Implement formSubmitted(event,formObject) which will be called when the form is submitted
 *       and all validations are passing. It will be given the event and formObject as described below.
 *       This method is useful is you need access to the event in order to figure out what to do.
 * 4. When the form is submitted and all validations are passing, the formObject you supplied
 *    via the constructor or connectFormObject will be populated with data from the form
 *    via properties based on the form element names, so you can reliably
 *    call e.g. formObject.userName to get the value of the userName element at the time
 *    of submission.
 * 5. Use onValidationErrors to handle global or non-field-related validation errors. It will
 *    be given an array of ValidationFailed objects you can call errorMessage() on.
 */
class Form extends Component {

  constructor(element, formObject) {
    super(element)

    EventManager.defineEvents(this, "validationErrors")

    if (formObject) {
      this.connectFormObject(formObject)
    }

    this.element.addEventListener("submit", (event) => {
      event.preventDefault()
      const formData = new FormData(this.element)

      const globalValidationErrors = this.formObject.customValidators.map( (validator) => {
        return validator.validate(formData)
      }).filter( (validationResult) => {
        return !validationResult.valid()
      })

      if (globalValidationErrors.length > 0) {
        this.validationErrorsEventManager.fireEvent(globalValidationErrors)
      }
      else {
        this.formObject.formData = new FormData(this.element)
        if (this.onSubmit) {
          this.submitEventManager.fireEvent(this.formObject)
        }
        else {
          this.formSubmitted(event, this.formObject)
        }
      }
    })
  }

  connectFormObject(formObject) {
    this.event("willConnectFormObject")
    this.formObject = formObject
    Array.from(this.element.elements).forEach( (formElement) => {
      const eventConnectionDetails = {
        formElement: `${formElement.name}#${formElement.type}`
      }
      const connection = this.formObject.connect(formElement)
      if (connection.fieldFound() && connection.validator) {
        formElement.addEventListener("input", (event) => {
          const validityCheck = connection.validator.valid(formElement.value)
          if (validityCheck.valid()) {
            formElement.setCustomValidity("")
            eventConnectionDetails.valid = true
          }
          else {
            formElement.setCustomValidity(validityCheck.errorMessage())
            eventConnectionDetails.valid = false
          }
          formElement.reportValidity()
        })
        eventConnectionDetails.connected = true
      }
      this.event("elementConnected",eventConnectionDetails)
    })
    this.event("formObjectConnected")
    this.measure("formObjectConnection","willConnectFormObject","formObjectConnected")
    this.formObject.checkThatAllFieldFound()
  }

  proxySubmit() {
    EventManager.defineEvents(this, "submit")
  }

  formSubmitted(event,formObject) { throw `Subclass must implement` }

  reset() { this.element.reset() }

}
export default Form
