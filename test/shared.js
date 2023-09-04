class Passed {
  isPassed() { return true }
  isFailed() { return false }
  isError()  { return false }
}

class Failed {
  constructor(message) {
    this.failureMessage = message
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

const suites = []
const suite = (description, createTests) => {
  const suiteObject = new TestSuite(description)
  const doSetup = (f) => {
    suiteObject.setup = f
  }
  createTests({
    setup: doSetup,
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

