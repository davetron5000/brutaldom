import Template        from "./Template"
import WrapsElement    from "./WrapsElement"


/**
 * a Component wraps an external:Element that is intended to be some sort of interactive
 * part of the UI. A Component is the building block of any dynamic element
 * and the intention is that you provide an implementation that wraps a DOM
 * element with a vastly simplified API.
 *
 * For example, an `HTMLFormElement` supports many events and actions. 
 * If you have a button, you likely only care about the clicked event. You may
 * also prefer to model enable/disable directly.  Thus, you'd extend `Component`
 * and provide a `Button` class for how you want buttons to work.
 *
 * Most of the methods of this class are helpers to be used internally by subclasses.
 *
 * @extends WrapsElement
 *
 */
class Component extends WrapsElement {

  /**
   * Creates a new component
   *
   * @param {external:Element} element - an Element from a web page that this component wraps
   *
   */
  constructor(element) {
    super(element)
    this.element = element
    this.hidden  = window.getComputedStyle(this.element).display === "none"
  }

  /**
   * Creates a `Template` based on an element inside this component.
   *
   * A common pattern with dynamic UIs is to use a template element to create dynamic
   * elements with actual data in them.  This method simplifies that by locating the
   * template (which is assumed to exist or there is an error) and then returning
   * an instance of `Template` that wraps the templated markup.
   *
   * @param {String} dataAttribute - if present, the name of a data attribute to identify the template. This will be combined with `data-` so you should omit that. If omitted, this will locate a `template` element.  In either case, there must be exactly one such element within this component's element (or the provided `baseElement`)
   * @param {Element} baseElement - if present, this is used to locate the template.  If omitted, will use this component's wrapped element.
   *
   * @returns {Template} a Template instance wrapping the template element
   */
  template(dataAttribute,baseElement) { 
    const selector = dataAttribute ? `template[data-${dataAttribute}]` : "template"
    return new Template(this.$selector(selector,baseElement))
  }

  /**
   * Hides a component.
   *
   * It's common to want to hide or show components. This method can be called
   * by others to hide the component. By default, the hiding is done via 
   * the CSS display property.  If an animator is configured, it is used instead.
   *
   * XXX: Change impl
   */
  hide() {
    this.hidden = true
    if (this.animator) {
      this.animator.animateBackward()
    }
    else {
      this.element.classList.remove("db")
      this.element.classList.add("dn")
    }
  }

  /**
   * Shows a component.
   *
   * It's common to want to hide or show components. This method can be called
   * by others to show the component. By default, the showing is done via 
   * the CSS display property.  If an animator is configured, it is used instead.
   *
   * XXX: Change impl
   */
  show() {
    this.hidden = false
    if (this.animator) {
      this.animator.animateForward()
    }
    else {
      this.element.classList.remove("dn")
      this.element.classList.add("db")
    }
  }

  /** Toggles the shown/hidden state */
  toggle() {
    if (this.hidden) {
      this.show()
    }
    else {
      this.hide()
    }
  }

}
export default Component
