import ValidationPassed from "./ValidationPassed"
import ValidationFailed from "./ValidationFailed"

/** Base class for custom form validations */
class CustomFormValidator {
  /** Subclasses should implement this to return
   * either this.passed() or this.failed(message)
   *
   * formData:: FormData object containing the form data
   */
  validate(formData) { return this.passed() }

  passed()        { return new ValidationPassed() }
  failed(message) { return new ValidationFailed(message) }
}
export default CustomFormValidator
