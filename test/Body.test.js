import Body      from "Body"
import Template  from "Template"
import Component from "Component"

import { Passed, Failed, suite } from "./shared"

suite(Body, { "$selector": "works generally" }, ({test}) => {
  test("can wrap as needed", ({document}) => {
    const div = document.createElement("div")
    div.dataset.testid="12345"
    document.body.appendChild(div)

    const body = new Body()

    const component = new Component(body.$selector("[data-testid='12345']"))
    if (component.element == div) {
      return Passed
    }
    else {
      return new Failed("Internal element was %o and not %o", div, component.element)
    }
  })
})
suite(Body, { "template": "works generally" }, ({test}) => {
  test("can find a template", ({document}) => {
    const templateElement = document.createElement("template")
    templateElement.dataset.foo = true
    document.body.appendChild(templateElement)

    const body = new Body()

    const template = body.template("foo")
    if (template.element == templateElement) {
      return Passed
    }
    else {
      return new Failed("Internal element was %o and not %o", div, component.element)
    }
  })
})

