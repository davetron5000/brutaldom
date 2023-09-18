import BrutalJSBase        from "./BrutalJSBase"
import HumanizedString     from "./HumanizedString"
import TypeOf              from "./TypeOf"
import EventAlreadyDefined from "./EventAlreadyDefined"

const debounce = (callback, wait) => {
  let timeout;
  return (...args) => {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback.apply(context, args)
    }, wait);
  };
}

/**
 * Defines an event and handles setting up methods needed for an object o
 * handle this event and its listeners.
 *
 * @private
 */
class EventDefinition {
  /**
   * Create an EventDefinition, but don't add it to the object, yet.
   *
   * @param {Object} object - the object that will fire this event
   * @param {String} name - name of the event
   *
   * @throws {EventAlreadyDefined} if the object already has this event defined or if the methods it will create conflict with existing methods.
   */
  constructor(object, name) {
    this.object           = object
    this.name             = name
    this.eventManagerName = `${name}EventManager`
    this.addListenerName  = `on${HumanizedString.for(name)}`

    if (object[this.eventManagerName]) {
      throw new EventAlreadyDefined(name,this.eventManagerName)
    }
    if (object[this.addListenerName]) {
      throw new EventAlreadyDefined(name,this.addListenerName)
    }
  }

  /**
   * Create the event mechanism on the object.  This modified the object 
   * passed to the constructor so that it will have the onXXX method.
   */
  create() {
    const eventManager = new EventManager(this.object,this.name)
    this.object[this.eventManagerName] =  eventManager
    this.object[this.addListenerName] = (listener) => {
      eventManager.addListener(listener)
    }
    return eventManager
  }
}

/**
 * Basic publish/subscribe class for modeling events and managing listeners.
 *
 * A core concept of the library is that your code should not rely on the
 * builtin EventTarget or Event APIs, as they are quite low level.  Rather,
 * your components would model explicit events such as `onClick` or
 * `onSubmit`.  The `EventManager` is provided to facilitate the implementation
 * of those events.
 *
 * @example
 * class Button extends Component {
 *   constructor(element) {
 *     super(element)
 *     this.clickEventManager = new EventManager(this,"click")
 *     this.element.addEventListener("click", () => {
 *       this.clickEventManager.fireEvent()
 *     })
 *   }
 *
 *   onClick(listener) { this.clickEventManager.addListener(listener) }
 * }
 *
 * @example
 * class Button extends Component {
 *   constructor(element) {
 *     super(element)
 *     EventManager.defineEvents(this, "click")
 *   }
 * }
 *
 * const button = new Button(document.querySelector("button"))
 * button.onClick( (event) => {
 *   // do whatever on a click
 * })
 */
class EventManager extends BrutalJSBase {

  /** Shortcut to creating event managers explcitly.
   *
   * Ideally used in the constructor of your class to define all
   * the events that your class will broadcast.
   *
   * @param {Object} object - the object on which the events will be defined
   * @param {...String} names - a list of names of events.  For each name, this method will define an EventManager
   *         for that named event, and then a method on«name» (where name is upper-case camelized)
   *         that will register the passed listener for that event.  To fire an event, use
   *         the EventNamager. For example, a name like "formSubmitted" would create the method `onFormSubmitted` which
   *         you could trigger by calling `this.formSubmittedEventManager.fireEvent()`
   */
  static defineEvents(object, ...names) {
    names.map( (name) => {
      return new EventDefinition(object,name)
    }).forEach( (eventDefinition) => {
      eventDefinition.create()
    })
  }

  /**
   * Create an EventManager attached to the given object for the given event name.
   *
   * @param {Object} object - the object that will be firing events. This is only used for logging.
   * @param {String} eventName - the name of the event.  This is only used for logging.
   */
  constructor(object, eventName) {
    super()
    this.listeners = new Set()
    this.eventName = eventName
    this.objectClass = TypeOf.asString(object)
  }

  /** Adds a listener to this event. 
   *
   * @param {EventManager~listener} listener to be called when the event fires.
   */
  addListener(listener) { this.listeners.add(listener) }

  /** Remove a listener from this event. 
   *
   * @param {EventManager~listener} listener to be called when the event fires.
   */
  removeListener(listener) { return this.listeners.delete(listener) }

  /**
   * Modifies this EventManager to debounce its fireEvent methods by timeoutMS milliseconds.
   *
   * @param {int} timeoutMS - Milliseconds to debounce the fireEvent method. If 0, debouncing is removed.
   */
  debounce(timeoutMS) {
    if (timeoutMS == 0) {
      delete this._debouncedFireEvent
    }
    else {
      this._debouncedFireEvent = debounce(this._fireEvent.bind(this), timeoutMS)
    }
  }

  /**
   * Called with whatever arguments were given to fireEvent.
   * @callback EventManager~listener
   */

  /** Fire the event, passing each listener the given args.
   *
   * @param {...Object} args - any args relevant to the event. You should document what these are.
   */
  fireEvent(...args) {
    if (this._debouncedFireEvent) {
      this.event("usingDebounced",{})
      this._debouncedFireEvent(...args)
    }
    else {
      this._fireEvent(...args)
    }
  }

  _fireEvent(...args) {
    this.methodStart("fireEvent", { listeners: this.listeners.size, eventName: this.eventName, objectClass: this.objectClass })
    this.listeners.forEach( (listener) => {
      listener(...args)
    })
    this.methodDone("fireEvent")
  }

  /**
   * Creates an EventManager and related methods for an existing DOM event.  Calls preventDefault on
   * the fired event before triggering listeners.
   *
   * @param object {Object} - the object that is firing the event
   * @param {Object} namedParams
   * @param {external:Element} namedParams.element - Element that will fire the event
   * @param {String} namedParams.eventName - name of the event that the element will fire
   *
   * @example
   * class Button extends Component {
   *   constructor(element) {
   *     super(element)
   *     this.onClickEventManager = EventManager.createDirectProxyFor(
   *       this,
   *       {
   *         element: this.element,
   *         eventName: "click"
   *       }
   *     )
   *   }
   * }
   *
   * const button = new Button(document.querySelector("button"))
   * button.onClick( () => {
   *   // whatever the button should do
   *   // noting that preventDefault has been called
   * })
   *
   */
  static createDirectProxyFor(object,{element,eventName}) {
    const eventDefinition = new EventDefinition(object,eventName)
    const eventManager = eventDefinition.create()
    element.addEventListener(eventName, (event) => {
      event.preventDefault()
      eventManager.fireEvent()
    })
  }
}

export default EventManager
