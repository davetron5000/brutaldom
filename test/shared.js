/**
 * A passed test result
 */
class Passed {
  isPassed() { return true }
  isFailed() { return false }
  isError()  { return false }
}

/**
 * A failed test result.
 */
class Failed {
  /**
   * @param {string} message - the failure message, optionally containing console formatting instructrions
   * @param {..string} messageArgs - if present, these are assumed to go into the formatting instructions of message
   */
  constructor(message,...messageArgs) {
    this.failureMessage = message
    this.messageArgs = messageArgs
  }
  isPassed() { return false }
  isFailed() { return true }
  isError()  { return false }
}

class FailedAsError extends Error {
  constructor(message,...messageArgs) {
    super(message)
    this.failureMessage = message
    this.messageArgs = messageArgs
  }
  asTestResult() {
    return new Failed(this.failureMessage,...this.messageArgs)
  }
}

/**
 * A test to run.  It has a description and a run method
 *
 * @property {String} description - human readable description of this test.  It may be assumed to be in context of a suite.
 */
class Test {
  /**
   * @param {object} namedArgs
   * @param {String} namedArgs.description - description to use
   * @param {Function} namedArgs.run - function that runs the test
   */
  constructor({description,run}) {
    this.description = description
    this._run = run
  }
  run(args) {
    return this._run(args)
  }
}

/**
 * A suite of tests.
 *
 * @property {TestSuiteDescription} description - description of the test
 * @property {Test[]} tests - all the tests in this suite
 *
 */
class TestSuite {
  constructor(description) {
    this.description = description
    this.tests = []
  }

  /**
   * Create a test based on a description and a function
   */
  test(description, f) {
    const oneTest = new Test({
      description: description,
      run: (args) => {
        return f(args)
      }
    })
    this.tests.push(oneTest)
    return oneTest
  }
}

/**
 * A way to describe a test suite without just using a string.
 */
class TestSuiteDescription {
  /**
   * @param {Object} descOrKlass - if this is a class, it's name is used as the description. Otherwise, this must be a String
   * @param {Object} options - if present, this must have exactly one key, representing the method being tested, that has one value,
   * representing a description of the behavior being tested.
   */
  constructor(descOrKlass, options) {
    if (descOrKlass.name) {
      this.desc = descOrKlass.name
    }
    else if (typeof descOrKlass === "string") {
      this.desc = descOrKlass
    }
    else {
      throw `You must supply either a class or a string. Got ${typeof descOrKlass}`
    }
    if (options) {
      const entries = Object.entries(options)
      if (entries.length != 1) {
        throw `You must supply only the method and behavior: ${entries}`
      }
      this.method = entries[0][0]
      this.behavior = entries[0][1]
    }
  }

  toString() {
    if (this.method) {
      return `${this.desc}#${this.method} - ${this.behavior}`
    }
    else {
      return this.desc
    }
  }
}
const suites = []
/**
 * DSL Method to create a test suite.  This method accepts some parameters to describe the suite and
 * then accepts a function that will be given arguments useful in writing tests.
 *
 * @param {Object} descOrKlass - a string describing the suite, or a class that is being tested
 * @param {Object} descOrCreateTests - if this is an object, it must have exactly one key, representing the method being tested, that has one value, representing a description of the behavior being tested.  createTestsOrUndefined must be passed in this case.  If descOrCreateTests is NOT an object, it must conform to the function as described by createTestsOrUndefined
 * @param {Function} createTestsOrUndefined - this is a function that accepts args used to create a test.  It should accept an
 * object using named parameters (see examples).  The following parameters can be passed:
 *    - test - the test function of TestSuite. You call this to define a test
 *    - setup - a function to proviate setup for the test.  This function accepts a function and THAT function must return an
 *    object.  That object will be passed as named params to the test.
 *
 */
const suite = (descOrKlass, descOrCreateTests, createTestsOrUndefined) => {
  let description
  let createTests

  if (!createTestsOrUndefined) {
    createTests = descOrCreateTests
    description = new TestSuiteDescription(descOrKlass)
  }
  else {
    createTests = createTestsOrUndefined
    description = new TestSuiteDescription(descOrKlass, descOrCreateTests)
  }

  const suiteObject = new TestSuite(description)
  const setSetup = (f) => {
    suiteObject.setup = f
  }
  createTests({
    setup: setSetup,
    test: suiteObject.test.bind(suiteObject)
  })
  suites.push(suiteObject)
}

const assertEqual = (expected,got,context) => {
  if (got !== expected) {
    if (context) {
      context = `\nContext : ${context}`
    }
    else {
      context = ""
    }
    throw new FailedAsError(`Expected: '${expected}'\nGot     : '${got}'${context}`)
  }
}

export {
  Passed,
  Failed,
  FailedAsError,
  Test,
  TestSuite,
  suite,
  suites,
  assertEqual,
}

