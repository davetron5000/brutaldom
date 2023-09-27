import BrutalDOMBase   from "./BrutalDOMBase"
import Template        from "./Template"
import SelectorMethods from "./private/SelectorMethods"

/**
 * Base class for wrapping a DOM element to provide logic.  This is the core class of the library and 
 * provides a few convienience methods useful when interacting with the DOM.
 *
 * In general, you likely want to use Component as your base class. See docs there.
 *
 * @see Component
 * @extends BrutalDOMBase
 */
class WrapsElement extends BrutalDOMBase {
  /**
   * Create the wrapped element.
   *
   * @param {external:Element} Element to wrap
   */
  constructor(element,...args) {
    super()
    this.element = element
    if (this.wasCreated) {
      this.wasCreated(...args)
    }
  }

  /**
   * Called with no arguments
   * @callback WrapsElement~whenNotFound
   */

  /**
   * Called with no arguments
   * @callback WrapsElement~whenMultipleFound
   * @param {Number} number of elements found.  Will be greater than 1.
   */

  /** Access an element relvative to this component's element based on
   *  a selector as you'd use for querySelectorAll() or querySelector()
   *
   *  It is expected to return exactly one element and will blow up if it does not
   *  locate exactly one.
   *
   *  If exactly on element is not found, by default an error is thrown. You can
   *  customize this behavior by providing whenNotFound and/or whenMultipleFound.
   *
   *  @param {String} selector -  A selector compatible wiht querySelectorAll or querySelector
   *  @param {external:Element} baseElement -  if omitted, uses this component's element. If given, uses it
   *                as the basis for the search.
   *  @param {WrapsElement~whenNotFound} whenNotFound -  if provided, will be called if no elements matching the selector
   *                 are found. No arguments given.
   *  @param {WrapsElement~whenMultipleFound} whenMultipleFound -  if provided, will be called if more than one element matching
   *                      the selector is found. Given an argument with the number of elements found.
   *                  
   *  @returns {external:Element} Return the element located.  Return value is undefined if whenNotFound or whenMultipleFound are
   *  called.
   *
   *  @throws an error if no elements matched and whenNotFound was not provided, OR if more than one element matched and
   *  whenMultipleFound was not provided.
   *
   */
  $selector(selector,baseElement,whenNotFound,whenMultipleFound) {
    if (!baseElement) {
      baseElement = this.element
    }
    return SelectorMethods.$selector(selector,baseElement,whenNotFound,whenMultipleFound)
  }

  /** Access elements relvative to this component's element based on
   *  a selector as you'd use for querySelectorAll(), but with the requirement
   *  that at least one element be found.
   *
   *  @param {String} selector - A selector compatible wiht querySelectorAll or querySelector
   *  @param {external:Element} baseElement - if omitted, uses this component's element. If given, uses it
   *                as the basis for the search.
   *                  
   *  @returns {external:Element[]} the elements located
   *  @throws an error if no elements matched
   */
  $selectors(selector,baseElement) {
    if (!baseElement) {
      baseElement = this.element
    }
    return SelectorMethods.$selectors(selector,baseElement)
  }

  /** Calls $selector with `[data-${dataAttribute}]` */
  $(dataAttribute,baseElement,whenNotFound) { 
    return this.$selector(`[data-${dataAttribute}]`,baseElement, whenNotFound)
  }
  
  /** Calls $selector with `[slot=name='${slotName}']` */
  $slot(slotName,baseElement,whenNotFound) { 
    return SelectorMethods.$slot(slotName,baseElement || this.element,whenNotFound)
  }

  /** Calls $selectors with `slot[name='${slotName}']` */
  $slots(slotName,baseElement) { 
    return SelectorMethods.$slots(slotName,baseElement || this.element)
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
}
export default WrapsElement
