import "./Component.test"
import "./WrapsElement.test"
import "./Body.test"
import { suites } from "./shared"

const runTests = () => {
  const $output = document.getElementById("output")
  $output.innerText = "HERE WE GO\n"
  suites.forEach( (suite) => {
    const defaultArgs = { document }
    suite.tests.forEach( (test) => {
      try {
        let testArgs = defaultArgs
        if (suite.setup) {
          const additionalArgs = suite.setup(defaultArgs)
          testArgs = { ...defaultArgs, ...additionalArgs }
        }
        const result = test.run(testArgs)
        if (result.isPassed()) {
          $output.innerText = $output.innerText + `OK   : ${suite.description} - ${test.description}\n`
        }
        else if (result.isFailed()) {
          if (result.messageArgs) {
            $output.innerText = $output.innerText + `FAIL : ${suite.description} - ${test.description}\n       [ see console for error ]\n`
            console.warn(result.failureMessage,...result.messageArgs)
          }
          else {
            $output.innerText = $output.innerText + `FAIL : ${suite.description} - ${test.description}\n       error: ${result.failureMessage}\n`
          }
        }
        else {
          $output.innerText = $output.innerText + `ERROR: ${suite.description} - ${test.description}\n       error: ${result.errorMessage}\n`
        }
      }
      catch (e) {
        $output.innerText = $output.innerText + `ERROR: ${suite.description} - ${test.description}\n       error: ${e}\n`

      }
    })
  })
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(runTests,200)
})
