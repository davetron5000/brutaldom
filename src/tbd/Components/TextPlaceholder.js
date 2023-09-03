import Component from "../Component"

/* A component that simply wraps dynamic text */
class TextPlaceholder extends Component {

  set text(value) {
    this.element.innerText = value
  }
}

export default TextPlaceholder
