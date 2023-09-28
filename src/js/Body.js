import WrapsElement from "./WrapsElement"
/**
 * A convienience for wrapping the body element.  This is handy as a starting point for locating
 * elements to wrap inside components without having to use `document.querySelector` and friends.
 *
 * @example
 *
 * // Assuming something like this in HTML:
 * //
 * //    <html>
 * //      <body>
 * //        <a href="#" data-get-started>Get Started</a>
 * //      </body>
 * //    </html>
 * //
 * document.addEventListener("DOMContentLoaded", () => {
 *   const body = new Body()
 *
 *   const link = new Link(body.$("get-started"))
 *   link.onClick( () => alert("You got started!") )
 * })
 */
class Body extends WrapsElement {
  constructor() {
    super(document.body)
  }
}

export default Body
