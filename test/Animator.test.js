import Animator from "Animator"

import { Passed, Failed, Test, TestSuite, assert, assertEqual, suite } from "./shared"

suite("Animator", { "AnimatorPreferences.immediateAlways": "does not perform animation" }, ({test, setup, teardown}) => {
  setup( ({document}) => {
    const element = document.createElement("div")
    element.style.opacity = 0
    element.innerText = "Hello"
    document.body.appendChild(element)
    document.body.dataset.animatorImmediate = "true"
    return { element: element }
  })
  teardown( ({document, element}) => {
    delete document.body.dataset.animatorImmediate
  })
  test("sets the element to the forward state immediately", ({document, element}) => {
    const now = Date.now()

    const animator = new Animator(element,{
      duration: 1000,
      styles: {
        opacity: {
          from: 0,
          to: 1,
        },
        backgroundColor: {
          from: "#000",
          to: "#fff",
        },
      }
    })
    return animator.animateForward().then( () => {
      const diff = Date.now() - now
      assertEqual("1", element.style.opacity)
      assertEqual("rgb(255, 255, 255)", element.style.backgroundColor)
      assert(diff < 20,`Expected animation to be immediate, which is less than 20ms, but it took ${diff}ms`)
      return Passed
    })
  })
  test("sets the element to the backward state immediately", ({document, element}) => {
    const now = Date.now()
    element.style.opacity = 1

    const animator = new Animator(element,{
      duration: 1000,
      styles: {
        opacity: {
          from: 0,
          to: 1,
        },
        backgroundColor: {
          from: "#000",
          to: "#fff",
        },
      }
    })
    return animator.animateBackward().then( () => {
      const diff = Date.now() - now
      assertEqual("0", element.style.opacity)
      assertEqual("rgb(0, 0, 0)", element.style.backgroundColor)
      assert(diff < 20,`Expected animation to be immediate, which is less than 20ms, but it took ${diff}ms`)
      return Passed
    })
  })
})

suite("Animator", { "AnimatorPreferences.immediateAlways == false": "performs animation and sets styles on element after animation is completed" }, ({test, setup, teardown}) => {
  setup( ({document}) => {
    const element = document.createElement("div")
    element.style.opacity = 0
    element.innerText = "Hello"
    document.body.appendChild(element)
    document.body.dataset.animatorImmediate = "false"
    return { element: element }
  })
  teardown( ({document, element}) => {
    delete document.body.dataset.animatorImmediate
  })
  test("sets the element to the forward state by animating", ({document, element}) => {
    const now = Date.now()

    const animator = new Animator(element,{
      duration: 125,
      styles: {
        opacity: {
          from: 0,
          to: 1,
        },
        backgroundColor: {
          from: "#000",
          to: "#fff",
        },
      }
    })
    return animator.animateForward().then( () => {
      const diff = Date.now() - now
      assertEqual("1", element.style.opacity)
      assertEqual("rgb(255, 255, 255)", element.style.backgroundColor)
      assert(diff < 150,`Expected animation to take 125ms (less than 150 total), but it took ${diff}ms`)
      return Passed
    })
  })
  test("sets the element to the backward state immediately", ({document, element}) => {
    const now = Date.now()
    element.style.opacity = 1

    const animator = new Animator(element,{
      duration: 125,
      styles: {
        opacity: {
          from: 0,
          to: 1,
        },
        backgroundColor: {
          from: "#000",
          to: "#fff",
        },
      }
    })
    return animator.animateBackward().then( () => {
      const diff = Date.now() - now
      assertEqual("0", element.style.opacity)
      assertEqual("rgb(0, 0, 0)", element.style.backgroundColor)
      assert(diff < 150,`Expected animation to take 125ms (less than 150 total), but it took ${diff}ms`)
      return Passed
    })
  })
})
