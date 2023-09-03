/**
 * Thrown when an event has already been defined on a class.
 *
 * @property {String} eventName - name of the event that was attempted to be defined
 * @property {String} propertyNameFound - the name of that property that was found. This name is derived from eventName and tells
 * you the specific property that the EventManager was trying to create.
 *
 * @see EventManager
 */
class EventAlreadyDefined extends Error {
  constructor(eventName,propertyNameFound) {
    super(`${eventName} appears to have already been defined - found '${propertyNameFound}' defined`)
    this.eventName = eventName
    this.propertyNameFound = propertyNameFound
  }
}
export default EventAlreadyDefined
