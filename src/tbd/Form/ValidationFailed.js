class ValidationFailed {
  constructor(message) {
    this.message = message
  }
  valid() { return false }
  errorMessage() { return this.message }
}

export default ValidationFailed
