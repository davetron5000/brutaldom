import "./Animator.test"
import "./Body.test"
import "./Component.test"
import "./Template.test"
import "./TypeOf.test"
import "./WrapsElement.test"

import { suites, FailedAsError, TestDidntReturn, ErrorTestResult } from "./shared"

const uid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(10);
}

const outputPass = ($output,suite,test) => {
  $output.innerText = $output.innerText + `OK   : ${suite.description} - ${test.description}\n`
}

const outputFail = ($output,suite,test,result) => {
  if (result.messageArgs && result.messageArgs.length > 0) {
    $output.innerText = $output.innerText + `FAIL : ${suite.description} - ${test.description}\n       [ see console for error ]\n`
    console.warn(result.failureMessage,...result.messageArgs)
  }
  else {
    $output.innerText = $output.innerText + `FAIL : ${suite.description} - ${test.description}\n`
    result.failureMessage.split("\n").forEach( (line, index) => {
      let message = `                ${line}`
      if (index == 0) {
        message = `       message: ${line}`
      }
      $output.innerText = $output.innerText + `${message}\n`
    })
  }
}
const outputError = ($output,suite,test,resultOrError,context) => {
  context = context || ""
  if (resultOrError instanceof Error) {
    $output.innerText = $output.innerText + `ERROR: ${context}${suite.description} - ${test.description}\n       error: ${resultOrError}\n\n       [See console for details]\n`
    console.error(resultOrError)
  }
  else {
    $output.innerText = $output.innerText + `ERROR: ${context}${suite.description} - ${test.description}\n       message: ${resultOrError.errorMessage}\n`
  }
}

const runTests = () => {
  const $output = document.getElementById("output")
  $output.innerText = "HERE WE GO\n"
  suites.forEach( (suite) => {
    const defaultArgs = { document, uid }
    const results = suite.tests.map( (test) => {
      let testArgs = defaultArgs
      if (suite.setup) {
        const additionalArgs = suite.setup(defaultArgs)
        testArgs = { ...defaultArgs, ...additionalArgs }
      }
      let result
      try {
        result = test.run(testArgs)
        if (!result) {
          result = new TestDidntReturn()
        }
      }
      catch (e) {
        if (e instanceof FailedAsError) {
          result = e.asTestResult()
        }
        else {
          result = new ErrorTestResult(e)
        }
      }
      if (!(result instanceof Promise)) {
        result = Promise.resolve(result)
      }
      return {
        test: test,
        result: result,
        args: testArgs,
      }
    })
    results.forEach( ({test,result,args}) => {
      result.then( (result) => {
        let teardownError
        if (suite.teardown) {
          try {
            suite.teardown(args)
          }
          catch (e) {
            outputError($output,suite,test,e,"in teardown ")
          }
        }
        try {
          if (!result) {
            throw `Test ${suite.description} - ${test.description} didn't return anything - you must return Passed or an instance of Failed`
          }
          if (result.isPassed()) {
            outputPass($output,suite,test)
            return
          }
          if (result.isFailed()) {
            outputFail($output,suite,test,result)
            return
          }
          outputError($output,suite,test,result)
        }
        catch (e) {
          outputError($output,suite,test,e)

        }
      }).catch( (e) => {
        if (e instanceof FailedAsError) {
          result = e.asTestResult()
          outputFail($output,suite,test,e.asTestResult())
        }
        else {
          outputError($output,suite,test,e)
        }
      })
    })
  })
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(runTests,200)
})
