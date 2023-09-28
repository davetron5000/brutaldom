import WrapsElement from "WrapsElement"
import { Passed, Failed, Test, TestSuite, suite } from "./shared"

class Extender extends WrapsElement {
  wasCreated(arg1,arg2) {
    this.arg1 = arg1
    this.arg2 = arg2
  }
}
suite(WrapsElement, { "constructor": "passes args" }, ({setup,test}) => {
  setup( ({document}) => {
    const element = document.createElement("div")
    const innerElement = document.createElement("div")
    innerElement.dataset.testid="1234"
    document.body.appendChild(element)
    element.appendChild(innerElement)
    return { element }
  })
  test("subclass constructor passes args", ({document, element}) => {
    const wrapped = new Extender(element,"foo",42)
    if ( (wrapped.arg1 == "foo") && (wrapped.arg2 == 42)) {
      return Passed
    }
    else {
      return new Failed(
        `Expected wrapped.arg1 to be 'foo' but was '${wrapped.arg1}; Expected wrapped.arg2 to be 42 but was ${wrapped.arg2}`
      )
    }
  })
})

suite(WrapsElement, { "$selector": "exactly one element" }, ({setup,test}) => {
  setup( ({document}) => {
    const element = document.createElement("div")
    const innerElement = document.createElement("div")
    innerElement.dataset.testid="1234"
    document.body.appendChild(element)
    element.appendChild(innerElement)
    return { element }
  })
  test("doesn't raise error", ({document, element}) => {
    const wrapped = new WrapsElement(element)
    try {
      const inner = wrapped.$selector("[data-testid='1234']")
      return Passed
    }
    catch (e) {
      return new Failed(e)
    }
  })
})

suite(WrapsElement, { "$selector": "no elements" }, ({setup,test}) => {
  setup( ({document}) => {
    const element = document.createElement("div")
    document.body.appendChild(element)
    return { element }
  })

  test("calls callback", ({document, element}) => {
    const wrapped = new WrapsElement(element)
    try {
      let called = false
      const cb = () => {
        called = true
      }
      const inner = wrapped.$selector("[data-testid='5678']",null,cb,null)
      if (called) {
        return Passed
      }
      else {
        return new Failed(`whenNotFound was not called (${inner})`)
      }
    }
    catch (e) {
      return new Failed(e)
    }
  })
  test("raises error", ({document, element}) => {
    const wrapped = new WrapsElement(element)
    try {
      const inner = wrapped.$selector("[data-testid='5678']")
      return new Failed(`Found element when not expected: ${inner}`)
    }
    catch (e) {
      return Passed
    }

  })

})

suite(WrapsElement,{ "$selector": "more than one match" }, ({setup, test}) => {
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

  test("raises error", ({document, element}) => {
    const wrapped = new WrapsElement(element)
    try {
      const inner = wrapped.$selector("[data-testid='1234']")
      return new Failed(`Found element when not expected: ${inner}`)
    }
    catch (e) {
      return Passed
    }
  })

  test("calls callback", ({document, element}) => {
    const wrapped = new WrapsElement(element)
    try {
      let called = false
      const cb = () => {
        called = true
      }
      const inner = wrapped.$selector("[data-testid='1234']",null,null,cb)
      if (called) {
        return Passed
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

suite(WrapsElement,{ "$selectors": "no matches" }, ({setup, test}) => {
  setup( ({document}) => {
    const element = document.createElement("div")
    document.body.appendChild(element)
    return { element }
  })
  test("raises an error", ({document, element}) => {
    const wrapped = new WrapsElement(element)
    try {
      const result = wrapped.$selectors("[data-foo]")
      return new Failed("Expected an error, but got results: %o", result)
    }
    catch (e) {
      return Passed
    }
  })
})

suite(WrapsElement,{ "$selectors": "one match" }, ({setup, test}) => {
  setup( ({document}) => {
    const element = document.createElement("div")
    document.body.appendChild(element)
    const innerElement = document.createElement("div")
    innerElement.dataset.foo = "true"
    element.appendChild(innerElement)
    return { element }
  })
  test("returns an array of size 1", ({document, element}) => {
    const wrapped = new WrapsElement(element)
    const result = wrapped.$selectors("[data-foo]")
    if (result.length == 1) {
      return Passed
    }
    else {
      return new Failed(`Expected exactly 1 result, but got ${result.length}`)
    }
  })
})

suite(WrapsElement,{ "$selectors": "more than one match" }, ({setup, test}) => {
  setup( ({document}) => {
    const element = document.createElement("div")
    document.body.appendChild(element)
    const innerElement = document.createElement("div")
    innerElement.dataset.foo = "true"
    element.appendChild(innerElement)
    const innerElement2 = document.createElement("div")
    innerElement2.dataset.foo = "true"
    element.appendChild(innerElement2)
    return { element }
  })
  test("returns an array of size 2", ({document, element}) => {
    const wrapped = new WrapsElement(element)
    const result = wrapped.$selectors("[data-foo]")
    if (result.length == 2) {
      return Passed
    }
    else {
      return new Failed(`Expected exactly 1 result, but got ${result.length}`)
    }
  })
})

suite(WrapsElement,{ "$": "calls through" }, ({setup, test}) => {
  setup( ({document}) => {
    const element = document.createElement("div")
    const innerElement = document.createElement("div")
    innerElement.dataset.foo = "true"
    document.body.appendChild(element)
    element.appendChild(innerElement)
    return { element }
  })
  test("returns what $selector would", ({document, element}) => {
    const wrapped = new WrapsElement(element)
    try {
      const inner = wrapped.$("foo")
      const fromSelect = wrapped.$selector("[data-foo]")
      if (inner == fromSelect) {
        return Passed
      }
      else {
        return new Failed(`$ got %o, but $selector got %o`,inner,fromSelect)
      }
    }
    catch (e) {
      return new Failed(e)
    }
  })
})
suite(WrapsElement,{ "$slot": "calls through" }, ({setup, test}) => {
  setup( ({document}) => {
    const element = document.createElement("div")
    const innerElement = document.createElement("slot")
    innerElement.setAttribute("name","foo")
    document.body.appendChild(element)
    element.appendChild(innerElement)
    return { element }
  })
  test("returns what $selector would", ({document, element}) => {
    const wrapped = new WrapsElement(element)
    try {
      const inner = wrapped.$slot("foo")
      const fromSelect = wrapped.$selector("slot[name='foo']")
      if (inner == fromSelect) {
        return Passed
      }
      else {
        return new Failed(`$slot got %o, but $selector got %o`,inner,fromSelect)
      }
    }
    catch (e) {
      return new Failed(e)
    }
  })
})
suite(WrapsElement,{ "$slots": "calls through" }, ({setup, test}) => {
  setup( ({document}) => {
    const element = document.createElement("div")
    document.body.appendChild(element)

    const innerElement = document.createElement("slot")
    innerElement.setAttribute("name","foo")
    element.appendChild(innerElement)

    const innerElement2 = document.createElement("slot")
    innerElement2.setAttribute("name","foo")
    element.appendChild(innerElement2)

    return { element }
  })
  test("returns what $selectors would", ({document, element}) => {
    const wrapped = new WrapsElement(element)
    try {
      const inner = wrapped.$slots("foo")
      const fromSelect = wrapped.$selectors("slot[name='foo']")
      if (inner.length == fromSelect.length) {
        if ( (inner[0] == fromSelect[0]) && (inner[1] == fromSelect[1])) {
          return Passed
        }
        else {
          return new Failed(`$slots got %o, but $selectors got %o`,inner,fromSelect)
        }
      }
      else {
        return new Failed(`$slots got %o, but $selectors got %o`,inner,fromSelect)
      }
    }
    catch (e) {
      return new Failed(e)
    }
  })
})
