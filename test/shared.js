class Passed {
  isPassed() { return true }
  isFailed() { return false }
  isError()  { return false }
}

class Failed {
  constructor(message,...messageArgs) {
    this.failureMessage = message
    this.messageArgs = messageArgs
  }
  isPassed() { return false }
  isFailed() { return true }
  isError()  { return false }
}

class Test {
  constructor({description,run}) {
    this.description = description
    this._run = run
  }
  run(args) {
    return this._run(args)
  }
}

class TestSuite {
  constructor(description) {
    this.description = description
    this.tests = []
  }

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

class TestSuiteDescription {
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


export {
  Passed,
  Failed,
  Test,
  TestSuite,
  suite,
  suites,
}

