import Component from "Component"
import { Passed, Failed, Test, TestSuite, suite } from "./shared"

suite("Component", ({test}) => {
  test("detects hidden", ({document}) => {
    const hidden = document.createElement("div")
    hidden.style.display = "none"
    document.body.appendChild(hidden)
    const hiddenComponent = new Component(hidden)
    if (hiddenComponent.hidden) {
      return new Passed()
    }
    else {
      return new Failed(`display was ${hiddenComponent.element.style.display}`)
    }
  })
  test("detects shown", ({document}) => {
    const shown = document.createElement("div")
    shown.style.display = "block"
    document.body.appendChild(shown)
    const shownComponent = new Component(shown)
    if (!shownComponent.hidden) {
      return new Passed()
    }
    else {
      return new Failed(`display was ${shownComponent.element.style.display}`)
    }
  })
})

