import BrutalDOMBase from "./BrutalDOMBase"

/** Wrapper for preferences regarding animation.
 * @property {Boolean} immediateAlways - if true, the user's browser is set to reduce motion and thus animations should happen
 * immediately.
 */
class AnimatorPreferences extends BrutalDOMBase {
  constructor() {
    super()
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion)").matches
    this.immediateAlways = prefersReducedMotion
    if (document.body.dataset.animatorImmediate === "true") {
      this.immediateAlways = true
    }
    else if (document.body.dataset.animatorImmediate === "false") {
      this.immediateAlways = false
    }
  }
}

export default AnimatorPreferences
