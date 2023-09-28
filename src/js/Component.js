import WrapsElement   from "./WrapsElement"
import BrutalDOMError from "./BrutalDOMError"


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
   * Creates a new component.  The main difference between a `WrapsElement` and a `Component` is that 
   * a `Component` can be hidden or shown.  This works by manipulating the `display` CSS property.
   *
   * This class must know the value for `display` when the component should be shown.  If the component's
   * `display` CSS property is not "none", that is the value used.  If the component is initially
   * hidden because `display` is set to "none", there *must* be an attribute named `data-brutaldom-display`
   * that contains the value for `display` to use when the component is shown.
   *
   * @param {external:Element} element - an Element from a web page that this component wraps
   * @param {...args} args - passed to the super class and then to `wasCreated` if implemented.
   *
   * @throws {BrutalDOMError} if there is no `data-brutaldom-display` attribute for a component that is hidden.
   *
   */
  constructor(element, ...args) {
    super(element, ...args)

    this.display = window.getComputedStyle(this.element).display
    this.hidden  = this.display === "none"
    if (this.hidden) {
      this.display = this.element.dataset["brutaldomDisplay"]
      if (!this.display) {
        throw new BrutalDOMError(`If your component is hidden by default, you must set data-brutaldom-display to the display value you want to use when showing it.`)
      }
    }
  }


  /**
   * Hides a component by setting its `display` CSS property to "none".
   *
   * If there is an animator, `animateBackward()` is called first and, when that completes, the component is hidden. If
   * there is no animator, the component is shown immediately.
   *
   * @returns {external:Promise} that, when resolved, means the component is hidden.
   */
  hide() {
    const hideImmediately = () => {
      this.element.style.display = "none"
      this.hidden = true
      return Promise.resolve()
    }
    if (this.animator) {
      return this.animator.animateBackward().then( () => hideImmediately() )
    }
    else {
      return hideImmediately()
    }
  }

  /**
   * Shows a component by setting its `display` CSS property to either the initial value (if the underlying
   * element was visible upon Component creation) or the value from data-brutaldom-display (if the underlying
   * element was initially hidden).
   *
   * If there is an animator, the component is shown and `animateForward()` is called.  The assumption is 
   * that the element will not be visible, even if `display` is not "none".  This is the only way to 
   * have the animation be shown.
   *
   * @returns {external:Promise} that, when resolved, means the component is hidden.
   */
  show() {
    const showImmediately = () => {
      this.element.style.display = this.display
      this.hidden = false
      return Promise.resolve()
    }
    if (this.animator) {
      return showImmediately().then ( () => this.animator.animateForward() )
    }
    else {
      return showImmediately()
    }
  }


  /** Toggles the shown/hidden state, effectively calling `show()` or `hide()` as appropriate and
    * returning what is returned.
    */
  toggle() {
    if (this.hidden) {
      return this.show()
    }
    else {
      return this.hide()
    }
  }

}
export default Component
