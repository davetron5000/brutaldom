import Component from "../Component"
import EventManager from "../EventManager"

class TextField extends Component {
  constructor(element) {
    super(element)

    this.inputChangedEventManager = new EventManager(this,"inputChanged")
    this.element.addEventListener("input", (event) => {
      this.inputChangedEventManager.fireEvent(this.element.name, this.element.value)
    })
  }
  onValueChanged(listener) { this.inputChangedEventManager.addListener(listener) }

  focus() { this.element.select() }
}

export default TextField
