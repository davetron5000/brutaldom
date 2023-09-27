class SelectorMethods {
  static $selector(selector,baseElement,whenNotFound,whenMultipleFound) {
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

  static $selectors(selector,baseElement) {
    const elements = baseElement.querySelectorAll(selector)
    if (elements.length == 0) {
      throw `Expected ${selector} to return 1 or more elements, but matched 0 from ${baseElement.outerHTML}`
    }
    return elements;
  }

  static $slot(slotName,baseElement,whenNotFound) { 
    return this.$selector(`slot[name='${slotName}']`,baseElement, whenNotFound)
  }

  static $slots(slotName,baseElement) { 
    return this.$selectors(`slot[name='${slotName}']`,baseElement)
  }

}
export default SelectorMethods
