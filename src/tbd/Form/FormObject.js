import TypeOf from "../JunkDrawer/TypeOf"

class FieldConnected {
  constructor(validator) {
    this.validator = validator
  }
  fieldFound() { return true }
}
class FieldNotFound {
  fieldFound() { return false }
}

/**
 * When using forms, you must create a FormObject that declares *all* fields you wish to manage 
 * on the form.
 *
 * 1. Each field's HTML should use HTML5 as necessary to validate the values.
 * 2. If you require custom validation, implement a subclass of CustomValidator.
 * 3. In the constructor, for *each* field, call this.field(name) or this.field(name,customValidator). You
 *    must call this for all fields, not just those with custom validations.
 *
 * Note that any field you declare must be in the form. If not, your form will raise an error.
 */
class FormObject {
  constructor() {
    this.fields = {}
    this.customValidators = []
  }

  /**
   * Configure a field.  You must call this for each field you want to access.
   *
   * name:: name of the field
   * options:: any options about the field, such as a default value or validation.  Options:
   *     validator:: if present, an instance of CustomValidator that will validate the value of this field.
   *                 This is used if the HTML5 validations are insufficient to validate the value.
   *     defaultValue:: if present, this value is used if the form value is null, undefined, or empty string
   *
   */
  field(name,{validator,defaultValue}={}) {
    this.fields[name] = {
      validator: validator,
      connectedToForm: false,
      defaultValue: defaultValue,
    }
  }

  addCustomValidation(validator) {
    this.customValidators.push(validator)
  }

  set formData(data) {
    Object.entries(this.fields).forEach( ([key,fieldConfig]) => {
      let value = data.get(key)
      if ((value === null) || (value === undefined) || (value === "")) {
        if ( (fieldConfig.defaultValue !== null) && (fieldConfig.defaultValue !== undefined) ) {
          value = fieldConfig.defaultValue
        }
      }

      this[key] = value
    })
  }

  connect(formElement) {
    const name = formElement.name
    if (this.fields[name]) {
      this.fields[name].connectedToForm = true
      return new FieldConnected(this.fields[name].validator)
    }
    else {
      return new FieldNotFound()
    }
  }

  checkThatAllFieldFound() {
    const missingFields = Array.from(Object.entries(this.fields)).filter( ([key,value]) => {
      return !value.connectedToForm
    }).map( ([key,value]) => {
      return key
    })
    if (missingFields.length > 0) {
      throw `Configured fields were not found on the page: ${missingFields.join(", ")}`
    }
  }

}
export default FormObject
