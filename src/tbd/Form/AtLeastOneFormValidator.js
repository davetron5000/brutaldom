import CustomFormValidator from "./CustomFormValidator"

class AtLeastOneFormValidator extends CustomFormValidator {
  constructor(fields) {
    super()
    this.fields = fields
  }

  validate(formData) {
    const hasAValue = this.fields.filter( (field) => {
      return !!formData.get(field)
    })
    if (hasAValue.length > 0) {
      return this.passed()
    }
    else {
      return this.failed(`At least one of ${this.fields.join(', ')} is required`)
    }
  }
}
export default AtLeastOneFormValidator
