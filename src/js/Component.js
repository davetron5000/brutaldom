import WrapsElement    from "./WrapsElement"


/**
 * Wraps an external:Element that is intended to be some sort of interactive
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
 * Extendors should avoid creating a constructor and instead implement `wasCreated`. This
 * method will be called by the constructor with whatever arguments are given to the constructor
 * other than the wrapped element.  This is to make it easier to create a construction
 * routine without having to remember to do `super(element)` every time.
 *
 * @example
 * // Given this markup:
 * // 
 * //   <header>
 * //     <h1>Message</h1>
 * //     <a href="#">Show / Hide</a>
 * //   </header>
 * // 
 * // allow the href to show/hide the h1
 *
 * class HideableHeading extends Component {
 *   wasCreated() {
 *     this.title = this.$selector("h1")
 *     this.link = new Link(this.$selector("a"))
 *     this.link.onClick( () => this.title.toggle() )
 *   }
 * }
 *
 * const heading = new HideableHeading(body.$selector("header"))
 *
 * @extends WrapsElement
 *
 */
class Component extends WrapsElement {

  /**
   * Creates a new component
   *
   * @param {external:Element} element - an Element from a web page that this component wraps
   * @param {...args} args - passed to the super class and then to `wasCreated` if implemented.
   *
   */
  constructor(element, ...args) {
    super(element, ...args)
    this.element = element
    this.hidden  = window.getComputedStyle(this.element).display === "none"
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
