import TypeOf from "./TypeOf"

/**
 * Convienience methods for tracing/logging method behavior.  This is mixed-into BrutalDOMBase so should
 * be available to all your classes.  This ultimately wraps the Performance API for UserPerformance.
 *
 * The primary way to use this is to call methodStart, then event any number of times, and finally methodDone.  These methods
 * all accept details objects and these are compounded, so that methodDone will include ALL details recorded during the method.
 * This allows you to build up context about what happened inside the method.
 *
 * @mixin
 * @see BrutalDOMBase
 * @see {external:Performance}
 */
const LogMixin = {

  /** Used to log the start of a method for later measurement of the method's duration.
   *
   * @param {String} methodName - name of the method that just got called
   * @param {Object} details - passed to performance.mark
   */
  methodStart(methodName,details) {
    this.event(`${methodName}#called`,details)
  },

  /** Used to log the end of a method. You must have called methodStart. This will
   * record an event and a measurement
   *
   * @param {String} methodName - name of the method that just got called
   * @param {Object} details - passed to performance.mark and performance.measure
   *
   */
  methodDone(methodName,details) {
    this.event(`${methodName}#completed`,details)
    this.measure(methodName,`${methodName}#called`,`${methodName}#completed`)
  },
  /**
   * Record an event via performance.mark
   *
   * @param {String} eventName - name of the event - can be anything
   * @param {Object} details - passed to performance.mark and performance.measure. Added to the default details this mixin stores.
   */
  event(eventName,details) {
    details = {...this.__defaultDetails(), ...details }
    performance.mark(this._name(eventName),{ detail: details })
    this.__logMixinDetails = {...this.__logMixinDetails, ...details}
  },
  /**
   * Record a measurement with performance.measure
   *
   * @param {String} measurementName - name of the measurement. Can be anything.
   * @param {String} start - the start mark name, as used in the Performance API
   * @param {String} end - the end mark name, as used in the Performance API
   */
  measure(measurementName,start,end) {
    if (!start) {
      throw `You forgot to add start & end to measure(${measurementName})`
    }
    else if (!end) {
      throw `You forgot to add end to measure(${measurementName})`
    }

    performance.measure(this._name(measurementName),
      {
        start: this._name(start),
        end: this._name(end),
        detail: this.__logMixinDetails 
      }
    )
  },
  _name(eventName) {
    if ( (this.constructor) && (this.constructor.logContext) ) {
      return `${this.constructor.logContext}.${this.__className()}.${eventName}`
    }
    else {
      return `${this.__className()}.${eventName}`
    }
  },
  __defaultDetails() {
    const details = {
      logContext: this.constructor.logContext || "UNKNOWN",
      className: this.__className(),
    }
    if (window && window.location) {
      details[`window.location.pathname`] = window.location.pathname
    }
    return details
  },
  __className() {
    return TypeOf.asString(this)
  },

  /** Mixes this into any class
   * @param {Class} klass - a Class
   */
  mixin(klass) {
    Object.assign(klass.prototype,LogMixin)
  }
}
export default LogMixin
