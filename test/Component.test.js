import Component from "Component"
import Animator from "Animator"
import BrutalDOMError from "BrutalDOMError"

import { Passed, Failed, assertEqual, suite } from "./shared"

suite("Component", ({test}) => {
  test("detects hidden", ({document}) => {
    const hidden = document.createElement("div")
    hidden.style.display = "none"
    hidden.dataset.brutaldomDisplay = "block"
    document.body.appendChild(hidden)
    const hiddenComponent = new Component(hidden)
    if (hiddenComponent.hidden) {
      return Passed
    }
    else {
      return new Failed(`display was ${hiddenComponent.element.style.display}`)
    }
  })
  test("when hidden, requires a data element to know how to show it", ({document}) => {
    const hidden = document.createElement("div")
    hidden.style.display = "none"
    document.body.appendChild(hidden)
    try {
      new Component(hidden)
      return new Failed("Expected an exception")
    }
    catch (e) {
      if (e instanceof BrutalDOMError) {
        return Passed
      }
      else {
        return new Failed(`Expected a BrutalDOMError, but got a '${e.constructor.name}' (${e})`)
      }
    }
  })

  test("detects shown", ({document}) => {
    const shown = document.createElement("div")
    shown.style.display = "block"
    document.body.appendChild(shown)
    const shownComponent = new Component(shown)
    if (!shownComponent.hidden) {
      return Passed
    }
    else {
      return new Failed(`display was ${shownComponent.element.style.display}`)
    }
  })
})
suite("Component", { "show": "shows the component" }, ({test}) => {
  test("when already shown", ({document}) => {
    const element = document.createElement("div")
    element.style.display = "block"
    document.body.appendChild(element)
    const component = new Component(element)
    return component.show().then( () => {
      const display = window.getComputedStyle(component.element).display
      assertEqual("block", display)
      return Passed
    })
  })
  test("when initially hidden", ({document}) => {
    const element = document.createElement("div")
    element.style.display = "none"
    element.dataset.brutaldomDisplay = "block"
    document.body.appendChild(element)
    const component = new Component(element)
    return component.show().then( () => {
      const display = window.getComputedStyle(component.element).display
      assertEqual("block", display)
      return Passed
    })
  })
  test("when initially hidden and data attribute says flex", ({document}) => {
    const element = document.createElement("div")
    element.style.display = "none"
    element.dataset.brutaldomDisplay = "flex"
    document.body.appendChild(element)
    const component = new Component(element)
    return component.show().then( () => {
      const display = window.getComputedStyle(component.element).display
      assertEqual("flex", display)
      return Passed
    })
  })
  test("when initially shown, then hidden, it restores the display to what it was originally", ({document}) => {
    const element = document.createElement("div")
    element.style.display = "grid"
    document.body.appendChild(element)
    const component = new Component(element)
    return component.hide().then( () => {
      return component.show().then( () => {
        const display = window.getComputedStyle(component.element).display
        assertEqual("grid", display)
        return Passed
      })
    })
  })
  test("when there is an animator, it executes, then shows", ({document}) => {
    const element = document.createElement("div")
    element.style.display = "none"
    element.style.opacity = 0
    element.dataset.brutaldomDisplay = "flex"
    document.body.appendChild(element)
    const component = new Component(element)
    component.animator = new Animator(component.element,{
      duration: 1,
      styles:  {
        opacity: {
          from: 0,
          to: 0.9,
        }
      }
    })

    return component.show().then( () => {
      const style = window.getComputedStyle(component.element)
      assertEqual("flex", style.display)
      assertEqual("0.9", style.opacity)
      return Passed
    })
  })
})
suite("Component", { "hide": "hides the component" }, ({test}) => {
  test("when initially shown", ({document}) => {
    const element = document.createElement("div")
    element.style.display = "block"
    document.body.appendChild(element)
    const component = new Component(element)
    return component.hide().then( () => {
      const display = window.getComputedStyle(component.element).display
      assertEqual("none", display)
      return Passed
    })
  })
  test("when initially hidden", ({document}) => {
    const element = document.createElement("div")
    element.style.display = "none"
    element.dataset.brutaldomDisplay = "block"
    document.body.appendChild(element)
    const component = new Component(element)
    return component.hide().then( () => {
      const display = window.getComputedStyle(component.element).display
      assertEqual("none", display)
      return Passed
    })
  })
  test("when there is an animator, it executes, then hides", ({document}) => {
    const element = document.createElement("div")
    element.style.display = "none"
    element.style.opacity = 1
    element.dataset.brutaldomDisplay = "flex"
    document.body.appendChild(element)
    const component = new Component(element)
    component.animator = new Animator(component.element,{
      duration: 1,
      styles:  {
        opacity: {
          from: 0,
          to: 1,
        }
      }
    })

    return component.hide().then( () => {
      const style = window.getComputedStyle(component.element)
      assertEqual("none", style.display)
      assertEqual("0", style.opacity)
      return Passed
    })
  })
})
suite("Component", { "toggle": "toggles hide/show" }, ({test}) => {
  test("when initially shown", ({document}) => {
    const element = document.createElement("div")
    element.style.display = "block"
    document.body.appendChild(element)
    const component = new Component(element)
    return component.toggle().then( () => {
      const display = window.getComputedStyle(component.element).display
      assertEqual("none", display)
      return Passed
    })
  })
  test("when initially hidden", ({document}) => {
    const element = document.createElement("div")
    element.style.display = "none"
    element.dataset.brutaldomDisplay = "block"
    document.body.appendChild(element)
    const component = new Component(element)
    return component.toggle().then( () => {
      const display = window.getComputedStyle(component.element).display
      assertEqual("block", display)
      return Passed
    })
  })
})
