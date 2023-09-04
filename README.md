# @brutaljs - Treat your web pages for what they are, not what you'd like them to be

A web page is a bunch of HTML and CSS. It can include JavaScript that responds to events.  The browser includes
many powerful APIs for building just about any user interface you might need.  Thus, you can build whatever you
need without any third party framework. But the browser's API is complex and contains many more features and
behaviors than *your* app is going to need.

The goal of BrutalJS is to provide tools to make it easier to model *your* app.  For example, you may have a button
that shows a message to the user when clicked.

```html
<main>
  <button>Show Message</button>
  <p style="display:none">Hello there!</p>
</main>
```

You can implement this with the browser directly, like so:

```javascript
const setup = () {
  const button = document.querySelector("main button")
  const message = document.querySelector("main p")
  if (button && message) {
    button.addEventListener("click", () => {
      message.style.display = "block"
    })
  }
  else {
    if (!button) {
      throw `Could not find button`
    }
    if (!message) {
      throw `Could not find message`
    }
  }
}

window.addEventListener("DOMContentLoaded",setup)
```

This is not so bad, however with more complicated needs, this can become quite difficult:

* Your code has to check that the elements its going to decorate are there
* The actual behavior relies on magical strings like "click" and "block". If you mis-type these, no error occurs, your app just doesn't work.

While you could certainly use a big framework, BrutalJs provides classes to wrap DOM elements and use them as the basis for richer
components and objects that respond to the needs of your app.

For example:

```javascript
window.addEventListener("DOMContentLoaded",() => {
  const body = new Body()
  const button = new Button(body.$selector("main button"))
  const message = new Message(body.$selector("main p"))

  button.onClick( () => message.show() )
})
```

This is the core logic that glues together the app.  `Body` is provided by BrutalJS, but `Button` and `Message` are defined by you:

```javascript
class Button extends Component {
  constructor(element) {
    super(element)
    EventManager.defineEvents(this, "click")
    this.element.addEventListener("click", (event) => {
      event.preventDefault()
      this.clickEventManager.fireEvent()
    })
  }
}

class Message extends Component {
}
```

`Component` is provided by `BrutalJS` and has `hide` and `show` methods.  `EventManager` is provided by BrutalJS

That's it!  It may seem like a bit more code, but this gives you the smallest possible footprint to use the underlying DOM APIs.


