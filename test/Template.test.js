import Template from "Template"
import { Passed, Failed, Test, TestSuite, suite, assertEqual } from "./shared"

suite("Template", { "newNode": "creates nodes" }, ({test, setup}) => {
  test("no slots", ({document, uid}) => {
    const id = uid()
    const div = document.createElement("div")
    div.innerHTML = `<div><template data-test-id="${id}"><div><h1>HI</h1></div></template></div>`
    document.body.appendChild(div)
    const $template = document.querySelector(`template[data-test-id='${id}']`)
    if (!$template) {
      return new Failed("Setup is borked - no template created in document")
    }
    const template = new Template($template)
    const node = template.newNode()
    node.dataset.fromTemplate = id
    document.body.appendChild(node)
    const fromTemplate = document.querySelector(`[data-from-template=${id}]`)
    if (fromTemplate) {
      return new Passed()
    }
    else {
      return new Failed(`Somehow, adding the new node didn't work: ${document}`)
    }
  })
  test("fills in slots", ({document,uid}) => {
    const id = uid()
    const div = document.createElement("div")
    div.innerHTML = `<div><template data-test-id="${id}"><div><h1><slot name="name"></slot></h1><p><slot name="name"></slot></p><span><slot name="other"></slot></span></div></template></div>`
    document.body.appendChild(div)
    const $template = document.querySelector(`template[data-test-id='${id}']`)
    if (!$template) {
      return new Failed("Setup is borked - no template created in document")
    }
    const template = new Template($template)
    const node = template.newNode({ fillSlots: {
      name: "Pat",
      other: "Blah",
    }})
    node.dataset.fromTemplate = id
    document.body.appendChild(node)
    const fromTemplate = document.querySelector(`[data-from-template=${id}]`)
    if (fromTemplate) {
      assertEqual("Pat",fromTemplate.querySelector("h1").textContent)
      assertEqual("Pat",fromTemplate.querySelector("p").textContent)
      assertEqual("Blah",fromTemplate.querySelector("span").textContent)
      return new Passed()
    }
    else {
      return new Failed(`Somehow, adding the new node didn't work: ${document}`)
    }
  })
  test("raises if asked to fill non-existent slots", ({document,uid}) => {
    const id = uid()
    const div = document.createElement("div")
    div.innerHTML = `<div><template data-test-id="${id}"><div><h1><slot name="name"></slot></h1><p><slot name="name"></slot></p><span><slot name="other"></slot></span></div></template></div>`
    document.body.appendChild(div)
    const $template = document.querySelector(`template[data-test-id='${id}']`)
    if (!$template) {
      return new Failed("Setup is borked - no template created in document")
    }
    const template = new Template($template)
    try {
      const node = template.newNode({ fillSlots: {
        foo: "Pat",
      }})
      return new Failed("Expected an error for trying to fill slot 'foo'")
    }
    catch (e) {
      return new Passed()
    }
  })
})

