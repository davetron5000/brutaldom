import BrutalJSBase from "./BrutalJSBase"

/** Wrapper for preferences regarding animation.
 * @property {Boolean} immediateAlways - if true, the user's browser is set to reduce motion and thus animations should happen
 * immediately.
 */
class AnimatorPreferences extends BrutalJSBase {
  constructor() {
    super()
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion)").matches
    const documentForcingNoAnimations = document.body.dataset.animatorImmediate === "true"
    this.immediateAlways = documentForcingNoAnimations || prefersReducedMotion
  }
}

export default AnimatorPreferences
