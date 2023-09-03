import Button from "./Button"
import CSSClassList from "../JunkDrawer/CSSClassList"

class DisableableButton extends Button {
  constructor(element) {
    super(element)

    this.classesWhenEnabled  = new CSSClassList(this.element.dataset.classesWhenEnabled)
    this.classesWhenDisabled = new CSSClassList(this.element.dataset.classesWhenDisabled)

    if (this.classesWhenEnabled.isEmpty()) {
      throw "Created DisableableButton but it does not have any data-classes-when-enabled"
    }
    if (this.classesWhenDisabled.isEmpty()) {
      throw "Created DisableableButton but it does not have any data-classes-when-disabled"
    }
  }

  disable() {
    this.element.disabled = true
    this.classesWhenEnabled.removeFromElement(this.element)
    this.classesWhenDisabled.addToElement(this.element)
  }
  enable() {
    this.element.disabled = false
    this.classesWhenEnabled.addToElement(this.element)
    this.classesWhenDisabled.removeFromElement(this.element)
  }
}
export default DisableableButton
