import AnimatorPreferences from "./AnimatorPreferences"
import BrutalJSBase        from "./BrutalJSBase"

/**
 * Simplified abstraction over the Element.animate() method, useful for
 * animations where you are animating to certain styles and you want those
 * styles to persist after the animation, e.g. for hiding elements.
 *
 * Uses AnimatorPreferences to alter its behavior based on the user's browser.
 *
 * @see AnimatorPreferences
 *
 */
class Animator extends BrutalJSBase {
  /**
   * Create an Animator that can animate the given element forward and backward.
   *
   * @param {external:Element} element - The Element that will be animated
   * @param {Object} namedParams
   * @param {Number} namedParams.duration - a number representing the ms for the animation. Default is 500
   * @param {String} namedParams.easing - An easing value for the animation. Default is "ease-in"
   * @param {Object} namedParams.styles - An object where the keys are styles that can be animated.  Each key's
   *          value should be an object with the keys "from" and "to".  For forward
   *          animations, the element will be animated from the "from" to the "to"
   *          and the "to" styles will be applied at the end.  For backwards animation
   *          it uses "to" as the starting point and "from" as the end, with the
   *          "from" styles being applied.
   */
  constructor(element, { duration, easing, styles }) {
    super()
    this.element  = element
    this.duration = duration || 500
    this.easing   = easing   || "ease-in"

    this.animatorPreferences = new AnimatorPreferences()

    this.from = {}
    this.to   = {}
    this.whenDoneForward = []
    this.whenDoneBackward = []

    Object.entries(styles).forEach( (entry) => {
      const styleName   = entry[0]
      const styleFromTo = entry[1]

      this.from[styleName] = styleFromTo.from
      this.to[styleName]  = styleFromTo.to
      this.whenDoneForward.push( () => {
        this.element.style[styleName] = styleFromTo.to
      })
      this.whenDoneBackward.push( () => {
        this.element.style[styleName] = styleFromTo.from
      })
    })
  }

  /**
   * Animate the element forward, with "from" at the start and
   * "to" at the end.
   *
   * @param {Number} durationOverride - Set this to override the duration used in the constructor.
   *
   * @returns {external:Promise} on which you can call then() to perform additional
   * functions after the animation completes. Note when animation is skipped, the 'from' state is set immediately on the element,
   * but the promise is still returned
   */
  animateForward(durationOverride) {
    if (this.animatorPreferences.immediateAlways) {
      this.setForwardNow()
      return new Promise( (resolve) => {
        resolve()
      })
    }
    else {
      return this.element.animate(
        [
          this.from,
          this.to,
        ],
        {
          duration: durationOverride || this.duration,
          easing: this.easing,
        }
      ).finished.then( () => {
        this.whenDoneForward.forEach( (f) => f() )
      })
    }
  }

  /**
   * Set the element to its completed-after-forward-animation state
   * immediately. This is useful if you want to style a component
   * in its pre-animated state, but bring the UI with the forward
   * animation completed.
   */
  setForwardNow() {
    this.whenDoneForward.forEach( (f) => f() )
  }

  /**
   * Animate the element backwaord, with "to" at the start and
   * "from" at the end.
   *
   * @param {Number} durationOverride - Set this to override the duration used in the constructor.
   *
   * @returns {external:Promise} on which you can call then() to perform additional
   * functions after the animation completes
   */
  animateBackward(durationOverride) {
    if (this.animatorPreferences.immediateAlways) {
      this.setBackwardNow()
      return new Promise( (resolve) => {
        resolve()
      })
    }
    else {
      return this.element.animate(
        [
          this.to,
          this.from,
        ],
        {
          duration: durationOverride || this.duration,
          easing: this.easing,
        }
      ).finished.then( () => {
        this.whenDoneBackward.forEach( (f) => f() )
      })
    }
  }

  /**
   * Set the element to its completed-after-backward-animation state
   * immediately. This is useful if you want to style a component
   * in its pre-animated state, but being the UI with the forward
   * animation completed.
   */
  setBackwardNow() {
    this.whenDoneBackward.forEach( (f) => f() )
  }

}

export default Animator
