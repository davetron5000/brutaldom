import BrutalDOMBase from "./BrutalDOMBase"
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
    if ( !(baseElement instanceof Element) && !(baseElement instanceof Document) ) {
      throw `Base element should be an Element or Document. Got ${JSON.stringify(baseElement)}`
    }
    if (!whenNotFound) {
      whenNotFound = () => {
          throw `Could not find '${selector}' from ${baseElement.outerHTML}`
      }
    }
    if (!whenMultipleFound) {
      whenMultipleFound = (numFound) => {
        throw `Found ${numFound} nodes instead of 1 matching '${selector}' from ${baseElement.outerHTML}`
      }
    }

    const elements = baseElement.querySelectorAll(selector)

    if (elements.length == 1) {
      return elements.item(0);
    }
    else if (elements.length == 0) {
      return whenNotFound()
    }
    else {
      return whenMultipleFound(elements.length)
    }
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

    const elements = baseElement.querySelectorAll(selector)
    if (elements.length == 0) {
      throw `Expected ${selector} to return 1 or more elements, but matched 0 from ${baseElement}`
    }
    return elements;
  }

  /** Calls $selector with `[data-${dataAttribute}]` */
  $(dataAttribute,baseElement,whenNotFound) { 
    return this.$selector(`[data-${dataAttribute}]`,baseElement, whenNotFound)
  }
  
  /** Calls $selector with `[slot=name='${slotName}']` */
  $slot(slotName,baseElement,whenNotFound) { 
    return this.$selector(`slot[name='${slotName}']`,baseElement, whenNotFound)
  }

  /** Calls $selectors with `slot[name='${slotName}']` */
  $slots(slotName,baseElement) { 
    return this.$selectors(`slot[name='${slotName}']`,baseElement)
  }

}
export default WrapsElement
