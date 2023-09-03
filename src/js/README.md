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

Even this simplified example has complexity that gets messy:

* Your code has to check that the elements its going to decorate are there
* The actual behavior relies on magical strings like "click" and "block". If you mis-type these, no error occurs, your app just doesn't work.

Here is how this works in BrutalJS:

```javascript
import { Component, EventManager, View } from "@brutaljs"

class Button extends Component {
  constructor(element) {
    super(element)
    this.clickManager = new EventManager()
    this.addEventListener("click", () => {
      this.clickManager.fireEvent()
    })
  }

  onClick(listener) { this.clickManager.addListener(listener) }
}

class Message extends Component {
}

class MyView extends View {
  constructor(element) {
    super(element)
    const button = new Button(this.$selector("button"))
    const message = new Message(this.$selector("p"))

    button.onClick( () => message.show() )
  }
}

window.addEventListener("DOMContentLoaded",() => {
  const view = new View(document.querySelector("main"))
})
```

Wow, that's way more code!  But, the core logic of our app is much clearer, *and* it uses methods that must be
defined. This implementation is free of silent failures, but it's still using the DOM API at its core.


