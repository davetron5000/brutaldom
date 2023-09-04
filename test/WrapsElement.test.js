import WrapsElement from "WrapsElement"
import { Passed, Failed, Test, TestSuite, suite } from "./shared"

suite("WrapsElement", ({setup,test}) => {
  setup( ({document}) => {
    const element = document.createElement("div")
    const innerElement = document.createElement("div")
    innerElement.dataset.testid="1234"
    document.body.appendChild(element)
    element.appendChild(innerElement)
    return { element }
  })
  test("selector not found raises error", ({document, element}) => {
    const wrapped = new WrapsElement(element)
    try {
      const inner = wrapped.$selector("[data-testid='5678']")
      return new Failed(`Found element when not expected: ${inner}`)
    }
    catch (e) {
      return new Passed()
    }

  })

  test("selector not found calls callback", ({document, element}) => {
    const wrapped = new WrapsElement(element)
    try {
      let called = false
      const cb = () => {
        called = true
      }
      const inner = wrapped.$selector("[data-testid='5678']",null,cb,null)
      if (called) {
        return new Passed()
      }
      else {
        return new Failed(`whenNotFound was not called (${inner})`)
      }
    }
    catch (e) {
      return new Failed(e)
    }
  })

  test("selector found", ({document, element}) => {
    const wrapped = new WrapsElement(element)
    try {
      const inner = wrapped.$selector("[data-testid='1234']")
      return new Passed()
    }
    catch (e) {
      return new Failed(e)
    }
  })
})

suite("WrapsElement (multiple selectors)", ({setup, test}) => {
  setup( ({document}) => {
    const element = document.createElement("div")
    const innerElement = document.createElement("div")
    innerElement.dataset.testid="1234"
    const innerElement2 = document.createElement("div")
    innerElement2.dataset.testid="1234"
    document.body.appendChild(element)
    element.appendChild(innerElement)
    element.appendChild(innerElement2)
    return { element }
  })

  test("selector finds multiple raises error", ({document, element}) => {
    const wrapped = new WrapsElement(element)
    try {
      const inner = wrapped.$selector("[data-testid='1234']")
      return new Failed(`Found element when not expected: ${inner}`)
    }
    catch (e) {
      return new Passed()
    }
  })

  test("selector finds multiple calls callback", ({document, element}) => {
    const wrapped = new WrapsElement(element)
    try {
      let called = false
      const cb = () => {
        called = true
      }
      const inner = wrapped.$selector("[data-testid='1234']",null,null,cb)
      if (called) {
        return new Passed()
      }
      else {
        return new Failed(`whenMultipleFound was not called (${inner})`)
      }
    }
    catch (e) {
      return new Failed(e)
    }
  })

})
