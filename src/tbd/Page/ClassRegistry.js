import BrutalJSBase from "./BrutalJSBase"
/** Register classes by name to allow dynamic lookup. */
class ClassRegistry extends BrutalJSBase {
  constructor() {
    super()
    this.registeredClasses = {}
  }
  /** Register a name to a class. The intended use of this is to call it once
   * per class using the { ClassName } syntax:
   *
   * ClassRegistry.registerClass({ FooBar })
   *
   * That would make the class `FooBar` availbale via the name `"FooBar"`.
   */
  registerClass(keyToClass) {
    Object.keys(keyToClass).forEach( (key) => {
      this.registeredClasses[key] = keyToClass[key]
    })
  }

  classFromName(name) {
    const klass = this.registeredClasses[name]
    if (klass) {
      return klass
    }
    throw `Nothing with name '${name}' registered`
  }

  /* Get the registered class from the document using a data element that contains
   * the class' name
   */
  classFromDocument(document, dataAttribute) {
    const elements = document.querySelectorAll(`[data-${dataAttribute}]`)
    if (elements.length == 0) {
      throw `Could not find any elements with data-${dataAttribute}`
    }
    else if (elements.length != 1) {
      throw `Found ${elements.length} elements tagged data-${dataAttribute}, but should've found exactly one`
    }
    const element = elements[0]
    const name = element.dataset[dataAttribute]

    const klass = this.classFromName(name)
    return [ klass, element ]
  }
}
export default ClassRegistry
