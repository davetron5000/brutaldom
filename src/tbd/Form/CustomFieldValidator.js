import ValidationPassed from "./ValidationPassed"
import ValidationFailed from "./ValidationFailed"

/** Base class for custom field validations */
class CustomFieldValidator {
  /** Subclasses should implement this to return
   * either this.passed() or this.failed(message)
   */
  valid(value) { return this.valueIsValid() }

  passed()        { return new ValidationPassed() }
  failed(message) { return new ValidationFailed(message) }
}
export default CustomFieldValidator
