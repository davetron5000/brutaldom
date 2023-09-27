import BrutalDOMBase   from "./BrutalDOMBase"
import SelectorMethods from "./private/SelectorMethods"

/**
 * Simplifies creating new DOM elements from `template` elements.
 *
 * Given a `template`, it's common to want to use it to create a new node, and to
 * prefill that nodes slots with dynamic information. For example, you may have
 * a template for a table row where each cell is a slot that needs data for that
 * row inserted.  This class helps manage that process.
 */
class Template extends BrutalDOMBase {
  /**
   * Create a Template with the given element. Note that the element *must*
   * be a `template` element.
   *
   * @param {external:Element} element - Element that this will wrap. It must be a `template` element.
   */
  constructor(element) {
    super()
    this.element = element
    if (this.element.tagName != "TEMPLATE") {
      throw `You may not create a Template from a ${this.element.tagName}`
    }
  }

  /**
   * Create a new `Node` based on this template. The new node will
   * optionally have any slots it contains filled with values. This Node can be inserted into the DOM.
   *
   * @param {Object} options
   * @param {Object} options.fillSlots - if present, this is an object where the property names are assumed to be slots with that name and the values are to be set as the innerText of the slot.  Each element of this object *must* be a slot inside the template. There can be more than one slot with any name and all will be filled in.
   *
   * @returns {external:Node} a new Node, filled with `options.fillSlots`, ready to be inserted into the DOM. 
   */
  newNode(options) {
    this.methodStart("newNode")
    const node = this.element.content.firstElementChild.cloneNode(true)
    this.event("newNode", { fillSlots: options ? options.fillSlots : undefined })
    if (options && options.fillSlots) {
      Object.entries(options.fillSlots).forEach( ([name,value]) => {
        SelectorMethods.$slots(name,node).forEach( (slot) => {
          slot.innerText = value
        })
      })
    }
    this.methodDone("newNode")
    return node
  }
}
export default Template
