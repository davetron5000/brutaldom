import Runtime from "./Runtime"

class DetailAttributeFilter {
  constructor(attributeName, attributeValues) {
    this.attributeName  = attributeName
    this.attributeValues = Array.isArray(attributeValues) ? attributeValues : [ attributeValues ]
    this.all = attributeValues === "ALL"
  }
  entryFilter() {
    if (this.all) {
      return () => { return true }
    }
    return (entry) => {
      return entry.detail && this.attributeValues.indexOf(entry.detail[this.attributeName]) != -1
    }
  }
  excludeDetail(key,value) {
    return key == this.attributeName
  }
}

class FancyConsoleLogger {
  constructor(detailFilters) {
    this.detailFilters = detailFilters
  }
  log(entry) {
    const detail = entry.detailFiltered(this.detailFilters)

    let additional = null
    if (entry.attributeName) {
      additional = `${entry.attributeName}: ${entry.attributeValue}${entry.attributeUnits}`
    }
    const consoleArgs = [
      "%s\t%c%s %c%s",
      entry.char,
      "text-weight: bold; font-family: monospace; color: #00a",
      entry.name,
      "text-weight: bold; color: #0a4",
      additional,
    ]
    if (Object.entries(detail).length != 0) {
      console.groupCollapsed(...consoleArgs)
      console.log("%o",detail)
      console.groupEnd()
    }
    else {
      console.log(...consoleArgs)
    }
  }
}
class BasicConsoleLogger {
  constructor(detailFilters) {
    this.detailFilters = detailFilters
  }
  log(entry) {
    const detail = entry.detailFiltered(this.detailFilters)

    const logInfo = {
      type: entry.type,
      name: entry.name,
    }
    if (entry.attributeName) {
      logInfo[entry.attributeName] = `${entry.attributeValue}${entry.attributeUnits}`
    }
    if (Object.entries(detail).length != 0) {
      logInfo.detail = JSON.stringify(detail)
    }
    console.log(Object.entries(logInfo).map( ([key,value]) => {
      return `${key}: '${value}'`
    }).join("; "))
  }
}

class WrappedEntry {
  constructor(entry) {
    this.entry = entry
    this.name = entry.name
    this.type = entry.entryType
  }
  detailFiltered(detailFilters) {
    const detail = {}
    Object.entries(this.entry.detail || {}).forEach( ([key,value]) => {
      const exclude = detailFilters.find( (filter) => {
        return filter.excludeDetail(key,value)
      })
      if (!exclude) {
        detail[key] = value
      }
    })
    return detail
  }
}

class Mark extends WrappedEntry {
  constructor(entry) {
    super(entry)
    this.char = "⛳️"
  }
}
class Measure extends WrappedEntry {
  constructor(entry) {
    super(entry)
    this.char = "⏱"
    this.attributeName = "duration"
    this.attributeValue = this.entry.duration
    this.attributeUnits = "ms"
  }
}

let ConsoleLogger = FancyConsoleLogger
if (Runtime.env().isTest()) {
  ConsoleLogger = BasicConsoleLogger
}

class MarkType {
  constructor(detailFilters) {
    this.consoleLogger = new ConsoleLogger(detailFilters)
    this.typeFilter = (entry) => entry.entryType == "mark"
  }
  consoleLog(entry) { this.consoleLogger.log(new Mark(entry)) }
}

class MeasureType {
  constructor(detailFilters) {
    this.consoleLogger = new ConsoleLogger(detailFilters)
    this.typeFilter = (entry) => entry.entryType == "measure"
  }

  consoleLog(entry) { this.consoleLogger.log(new Measure(entry)) }
}

/**
 * An interface to allow viewing of the log entries sent using Log and the Performance API.  Under the covers, this
 * uses a PerformanceObserver to receive the messages.
 *
 * @see external:PerformanceObserver
 */
class LogViewer { // DO NOT EXTEND BrutalDOMBase
  /**
   * Create a LogViewer.
   *
   * @param {Object} namedParams
   * @param {String} namedParams.logContext - Ignore log messages that don't match this context.  The special value "ALL" means to
   * show all log messages.  Otherwise, this is used to filter messages that have both have details and have a logContext key
   * in the details.  If the value of that key includes this value, the message is shown. Otherwise it is filtered out.  Note
   * that any class that mixes in the Log mixin can set its context for messages it logs by setting the logContext static
   * property.  This is useful to tag a group of classes or module.
   * @param {String} namedParams.className - Filter for only messages from a certain class.  Like logContext, this works by matching
   * on the details value and the className key, which is set automatically by any class using the Log mixin.  The value "ALL" means
   * to shnow all classes.
   * @param {String} type if "BOTH" then both marks and measures are shown. If mark, only marks are shown. If measure, only measures
   * are shown.
   */
  constructor({ logContext = "ALL", className = "ALL", type = "BOTH" } = {}) {

    const logContextFilter = new DetailAttributeFilter("logContext",logContext)
    const classNameFilter  = new DetailAttributeFilter("className",className)

    const detailFilters = [
      logContextFilter,
      classNameFilter,
    ]

    const types = {
      mark: new MarkType(detailFilters),
      measure: new MeasureType(detailFilters),
    }

    let typeFilter = () => { return true }
    if (type !== "BOTH") {
      typeFilter = types[type].typeFilter
    }

    this.observer = new PerformanceObserver( (list,observer) => {
      list.getEntries().
        filter(typeFilter).
        filter(logContextFilter.entryFilter()).
        filter(classNameFilter.entryFilter()).
        forEach( (entry) => {
          types[entry.entryType].consoleLog(entry)
        })
    })
  }
  /**
   * Start the observer. Without calling this, no messages will be viewed.
   */
  start() {
    this.observer.observe({ entryTypes: ["measure", "mark"] })
  }
}
export default LogViewer
